import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { createZipFileName, createZipFromArchiveFiles } from "@/lib/rarToZip";

describe("RAR to ZIP helpers", () => {
  it("creates a ZIP filename from a RAR file name", () => {
    expect(createZipFileName("project.rar")).toBe("project.zip");
    expect(createZipFileName("Project.RAR")).toBe("Project.zip");
  });

  it("uses a default archive name when the source name has no base name", () => {
    expect(createZipFileName(".rar")).toBe("archive.zip");
  });

  it("writes extracted files and their paths into a valid ZIP archive", async () => {
    const file = new File(["RAR-to-ZIP test"], "readme.txt");
    const output = await createZipFromArchiveFiles(
      [{ file, pathname: "docs/readme.txt" }],
      "project.zip",
    );
    const zip = await JSZip.loadAsync(output);

    expect(output.name).toBe("project.zip");
    expect(await zip.file("docs/readme.txt")?.async("text")).toBe("RAR-to-ZIP test");
  });
});
