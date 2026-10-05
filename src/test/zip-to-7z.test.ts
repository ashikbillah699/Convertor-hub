import { describe, expect, it } from "vitest";
import { create7zFileName, flattenArchiveFiles } from "@/lib/zipTo7z";

describe("ZIP to 7z helpers", () => {
  it("preserves nested file paths and creates a 7z filename", () => {
    const file = new File(["content"], "readme.txt");
    const entries = flattenArchiveFiles({ docs: { "readme.txt": file } });

    expect(entries).toEqual([{ file, pathname: "docs/readme.txt" }]);
    expect(create7zFileName("project.ZIP")).toBe("project.7z");
  });

  it("accepts archive file arrays that include directory paths", () => {
    const file = new File(["content"], "readme.txt");

    expect(flattenArchiveFiles([{ file, path: "docs/" }])).toEqual([{ file, pathname: "docs/readme.txt" }]);
  });

  it("rejects paths that could escape the archive root", () => {
    const file = new File(["content"], "secret.txt");

    expect(() => flattenArchiveFiles({ "../outside.txt": file })).toThrow("unsafe file path");
    expect(() => flattenArchiveFiles([{ file, path: "../outside.txt" }])).toThrow("unsafe file path");
  });
});