import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { extractPptxSlideText } from "../lib/pptx";

describe("PPTX conversion helpers", () => {
  it("extracts slide text from a basic PPTX package", async () => {
    const zip = new JSZip();
    zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst/><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst></p:presentation>`);
    zip.file("ppt/slides/slide1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:sp><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:t>First title</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`);
    zip.file("ppt/slides/slide2.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:t>Second slide</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`);

    const arrayBuffer = await zip.generateAsync({ type: "arraybuffer" });
    const slides = await extractPptxSlideText(arrayBuffer);

    expect(slides).toHaveLength(2);
    expect(slides[0]).toContain("First title");
    expect(slides[1]).toContain("Second slide");
  });

  it("rejects unsupported legacy PPT files with a clear message", async () => {
    await expect(extractPptxSlideText(new Uint8Array([1, 2, 3, 4]).buffer)).rejects.toThrow(/valid.*pptx|Legacy.*ppt/i);
  });
});
