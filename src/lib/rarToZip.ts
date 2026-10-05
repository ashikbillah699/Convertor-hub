import JSZip from "jszip";
import { extractArchiveFiles, type ArchiveFile } from "@/lib/archiveConversion";

export const createZipFileName = (rarFileName: string) =>
  `${rarFileName.replace(/\.rar$/i, "") || "archive"}.zip`;

export const createZipFromArchiveFiles = async (
  files: ArchiveFile[],
  outputFileName: string,
): Promise<File> => {
  const zip = new JSZip();
  files.forEach(({ file, pathname }) => zip.file(pathname, file));
  const content = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  return new File([content], outputFileName, { type: "application/zip" });
};

export const convertRarToZip = async (
  rarFile: File,
  onStage: (stage: string) => void,
): Promise<File> => {
  const files = await extractArchiveFiles(rarFile, {
    readingStage: "Reading RAR contents...",
    encryptedArchiveMessage: "Password-protected RAR archives are not supported yet.",
    emptyArchiveMessage: "This RAR archive contains no files to convert.",
  }, onStage);
  onStage("Creating ZIP archive...");
  return createZipFromArchiveFiles(files, createZipFileName(rarFile.name));
};
