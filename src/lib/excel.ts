import JSZip from "jszip";

const xmlText = (node: Element | null) => node?.textContent ?? "";

const asTableRows = (value: string) => {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.split(/\s{2,}|\t/).map(cell => cell.trim()).filter(Boolean));
};

export const readSpreadsheetRows = async (fileName: string, arrayBuffer: ArrayBuffer): Promise<string[][]> => {
  if (/\.csv$/i.test(fileName)) {
    const csvText = new TextDecoder().decode(arrayBuffer);
    return csvText
      .split(/\r?\n/)
      .filter(line => line.trim().length > 0)
      .map(line => line.split(",").map(value => value.trim()));
  }

  return readXlsxRows(arrayBuffer);
};

export const readXlsxRows = async (arrayBuffer: ArrayBuffer): Promise<string[][]> => {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const sharedStrings = zip.file("xl/sharedStrings.xml")
    ? await zip.file("xl/sharedStrings.xml")!.async("string")
    : "";

  const parser = new DOMParser();
  const sharedList = sharedStrings
    ? Array.from(parser.parseFromString(sharedStrings, "application/xml").getElementsByTagName("si"))
        .map(node => Array.from(node.getElementsByTagName("t")).map(item => item.textContent ?? "").join(""))
    : [];

  const sheetFiles = Object.keys(zip.files)
    .filter(name => /^xl\/worksheets\/sheet\d+\.xml$/i.test(name))
    .sort((left, right) => {
      const leftIndex = Number((left.match(/sheet(\d+)/i)?.[1] ?? "0"));
      const rightIndex = Number((right.match(/sheet(\d+)/i)?.[1] ?? "0"));
      return leftIndex - rightIndex;
    });

  if (!sheetFiles.length) {
    throw new Error("This spreadsheet file does not contain a readable worksheet.");
  }

  const rows: string[][] = [];

  for (const sheetPath of sheetFiles) {
    const content = await zip.file(sheetPath)?.async("string");
    if (!content) continue;

    const document = parser.parseFromString(content, "application/xml");
    const rowNodes = Array.from(document.getElementsByTagName("row"));

    for (const row of rowNodes) {
      const cells = Array.from(row.getElementsByTagName("c"));
      const rowValues: string[] = [];
      for (const cell of cells) {
        const cellType = cell.getAttribute("t");
        const valueNode = cell.getElementsByTagName("v")[0];
        const inlineNode = cell.getElementsByTagName("is")[0];
        let value = "";

        if (cellType === "inlineStr") {
          value = xmlText(inlineNode?.getElementsByTagName("t")[0]);
        } else if (cellType === "s") {
          const index = Number(valueNode?.textContent ?? "0");
          value = sharedList[index] ?? "";
        } else if (cellType === "b") {
          value = valueNode?.textContent === "1" ? "TRUE" : "FALSE";
        } else {
          value = xmlText(valueNode) || xmlText(cell.getElementsByTagName("is")[0]);
        }

        rowValues.push(value.trim());
      }

      if (rowValues.some(value => value.length > 0)) {
        rows.push(rowValues);
      }
    }
  }

  return rows;
};

const columnLabel = (index: number) => {
  let label = "";
  let current = index;
  while (current >= 0) {
    const remainder = current % 26;
    label = String.fromCharCode(65 + remainder) + label;
    current = Math.floor(current / 26) - 1;
  }
  return label;
};

export const createXlsxFromText = async (rows: string[][]) => {
  const zip = new JSZip();
  const sheetData = rows
    .map((row, rowIndex) => {
      const cells = row.map((cell, cellIndex) => {
        const safeCell = String(cell ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<c r="${columnLabel(cellIndex)}${rowIndex + 1}" t="inlineStr"><is><t>${safeCell}</t></is></c>`;
      }).join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");

  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`);

  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`);

  zip.file("docProps/core.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Converted PDF Worksheet</dc:title>
  <dc:creator>ConvNexus</dc:creator>
  <cp:lastModifiedBy>ConvNexus</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-10-04T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-10-04T00:00:00Z</dcterms:modified>
</cp:coreProperties>`);

  zip.file("docProps/app.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>ConvNexus</Application>
</Properties>`);

  zip.file("xl/workbook.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`);

  zip.file("xl/_rels/workbook.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`);

  zip.file("xl/worksheets/sheet1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${sheetData}
  </sheetData>
</worksheet>`);

  return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
};

export const pdfTextToRows = (text: string) => {
  const chunks = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);

  const rows: string[][] = [];
  for (const chunk of chunks) {
    rows.push(asTableRows(chunk).length ? asTableRows(chunk) : [[chunk]]);
  }

  return rows.flat();
};
