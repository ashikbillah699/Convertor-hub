import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { LogOut, Plus, Save, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { adminApi, type ManagedBlog, type ManagedProduct } from "@/lib/contentApi";

type ContentType = "blogs" | "products";
type ManagedContent = ManagedBlog | ManagedProduct;

const newBlog = (): ManagedBlog => ({
  id: `blog-${Date.now()}`,
  title: "New blog post",
  excerpt: "",
  category: "Tools Guide",
  author: "OpticThirst Team",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  readTime: "5 min read",
  image: "#",
  content: [],
  tags: [],
  relatedToolCategories: [],
  isPublished: false,
});

const newProduct = (): ManagedProduct => ({
  id: `product-${Date.now()}`,
  name: "New product",
  slug: `new-product-${Date.now()}`,
  description: "",
  longDescription: "",
  category: "Software",
  price: "See website",
  rating: 0,
  image: "#",
  badge: null,
  features: [],
  pros: [],
  cons: [],
  affiliateUrl: "#",
  countries: [],
  relatedToolCategories: [],
  isPublished: false,
});

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [contentType, setContentType] = useState<ContentType>("blogs");
  const [blogs, setBlogs] = useState<ManagedBlog[]>([]);
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [editor, setEditor] = useState("");
  const [creating, setCreating] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const items: ManagedContent[] = contentType === "blogs" ? blogs : products;
  const selected = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId],
  );

  const loadContent = useCallback(async () => {
    setLoadingContent(true);
    setError("");
    try {
      const [nextBlogs, nextProducts] = await Promise.all([adminApi.blogs(), adminApi.products()]);
      setBlogs(nextBlogs);
      setProducts(nextProducts);
      const nextItems = contentType === "blogs" ? nextBlogs : nextProducts;
      setSelectedId((current) => nextItems.some((item) => item.id === current) ? current : nextItems[0]?.id || "");
      setCreating(false);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load content.");
    } finally {
      setLoadingContent(false);
    }
  }, [contentType]);

  useEffect(() => {
    let active = true;
    adminApi.session()
      .then(() => {
        if (!active) return;
        setAuthenticated(true);
      })
      .catch((sessionError: unknown) => {
        if (!active) return;
        if (sessionError instanceof Error && !sessionError.message.includes("authentication is required")) {
          setError(sessionError.message);
        }
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (authenticated) void loadContent();
  }, [authenticated, loadContent]);

  useEffect(() => {
    if (!creating && selected) setEditor(JSON.stringify(selected, null, 2));
    else if (creating && contentType === "blogs") setEditor(JSON.stringify(newBlog(), null, 2));
    else if (creating) setEditor(JSON.stringify(newProduct(), null, 2));
  }, [contentType, creating, selected]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminApi.login(username, password);
      setPassword("");
      setAuthenticated(true);
      setNotice("Signed in to the admin panel.");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const record = JSON.parse(editor) as ManagedContent;
      if (contentType === "blogs") {
        const saved = await adminApi.saveBlog(record as ManagedBlog, creating);
        const updated = creating ? [...blogs, saved] : blogs.map((item) => item.id === saved.id ? saved : item);
        setBlogs(updated);
        setSelectedId(saved.id);
      } else {
        const saved = await adminApi.saveProduct(record as ManagedProduct, creating);
        const updated = creating ? [...products, saved] : products.map((item) => item.id === saved.id ? saved : item);
        setProducts(updated);
        setSelectedId(saved.id);
      }
      setCreating(false);
      setNotice("Content saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Content could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm(`Delete "${"title" in selected ? selected.title : selected.name}"?`)) return;
    setBusy(true);
    setError("");
    try {
      if (contentType === "blogs") await adminApi.deleteBlog(selected.id);
      else await adminApi.deleteProduct(selected.id);
      await loadContent();
      setNotice("Content deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Content could not be deleted.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    setError("");
    try {
      await adminApi.logout();
      setAuthenticated(false);
      setBlogs([]);
      setProducts([]);
      setSelectedId("");
      setNotice("You have signed out.");
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Sign-out failed.");
    } finally {
      setBusy(false);
    }
  };

  const changeContentType = (type: ContentType) => {
    setContentType(type);
    setCreating(false);
    const nextItems = type === "blogs" ? blogs : products;
    setSelectedId(nextItems[0]?.id || "");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container min-h-[70vh] py-12">
        {checkingSession ? (
          <p className="text-center text-muted-foreground">Checking admin session…</p>
        ) : !authenticated ? (
          <section className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="mb-2 text-3xl font-bold">Admin sign in</h1>
            <p className="mb-6 text-sm text-muted-foreground">Sign in to manage published blogs and affiliate products.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-sm font-medium">
                Username
                <input
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3"
                />
              </label>
              <label className="block text-sm font-medium">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3"
                />
              </label>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="gradient" disabled={busy} className="w-full">
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </section>
        ) : (
          <section>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Content admin</h1>
                <p className="mt-1 text-muted-foreground">Manage blog posts and affiliate products stored in MongoDB.</p>
              </div>
              <Button variant="outline" onClick={() => void handleLogout()} disabled={busy}>
                <LogOut /> Sign out
              </Button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {(["blogs", "products"] as const).map((type) => (
                <Button
                  key={type}
                  variant={contentType === type ? "default" : "outline"}
                  onClick={() => changeContentType(type)}
                >
                  {type === "blogs" ? `Blogs (${blogs.length})` : `Products (${products.length})`}
                </Button>
              ))}
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => { setCreating(true); setSelectedId(""); setError(""); }}
              >
                <Plus /> Add {contentType === "blogs" ? "blog" : "product"}
              </Button>
            </div>

            {error && <p role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            {notice && <p role="status" className="mb-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">{notice}</p>}
            {loadingContent ? (
              <p className="py-10 text-center text-muted-foreground">Loading content…</p>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[minmax(220px,1fr)_2fr]">
                <aside className="max-h-[70vh] space-y-2 overflow-auto rounded-xl border border-border p-3">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setCreating(false); setSelectedId(item.id); setError(""); }}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${selectedId === item.id && !creating ? "border-primary bg-primary/5" : "border-transparent hover:bg-secondary"}`}
                    >
                      <span className="block truncate font-medium">{"title" in item ? item.title : item.name}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {item.isPublished ? "Published" : "Draft"} · {item.id}
                      </span>
                    </button>
                  ))}
                  {items.length === 0 && <p className="p-3 text-sm text-muted-foreground">No {contentType} yet.</p>}
                </aside>

                <div className="rounded-xl border border-border p-4 sm:p-6">
                  <label className="mb-2 block text-sm font-medium" htmlFor="content-json">
                    {creating ? "New content" : selected ? ("title" in selected ? selected.title : selected.name) : "Select content"}
                    <span className="ml-2 font-normal text-muted-foreground">JSON editor</span>
                  </label>
                  <textarea
                    id="content-json"
                    value={editor}
                    onChange={(event) => setEditor(event.target.value)}
                    spellCheck={false}
                    disabled={!creating && !selected}
                    className="min-h-[55vh] w-full rounded-lg border border-input bg-background p-4 font-mono text-xs leading-5"
                    aria-label="Edit content JSON"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Keep all field names and types valid. Set <code>isPublished</code> to true to publish; set it to false to save as a draft.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    {!creating && selected && (
                      <Button variant="destructive" onClick={() => void handleDelete()} disabled={busy}>
                        <Trash2 /> Delete
                      </Button>
                    )}
                    <Button variant="gradient" onClick={() => void handleSave()} disabled={busy || (!creating && !selected)}>
                      <Save /> {busy ? "Saving…" : creating ? "Create" : "Save changes"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
