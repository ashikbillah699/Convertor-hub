import { ArchiveCompression, ArchiveFormat } from "libarchive.js";
import { convertArchive, flattenArchiveFiles } from "@/lib/archiveConversion";

export { flattenArchiveFiles } from "@/lib/archiveConversion";
export type { ArchiveFile } from "@/lib/archiveConversion";

export const create7zFileName = (zipFileName: string) =>
  `${zipFileName.replace(/\.zip$/i, "") || "archive"}.7z`;

export const convertZipTo7z = async (
  zipFile: File,
  onStage: (stage: string) => void,
): Promise<File> => {
  return convertArchive(zipFile, {
    outputFileName: create7zFileName(zipFile.name),
    outputFormat: ArchiveFormat.SEVEN_ZIP,
    compression: ArchiveCompression.LZMA,
    readingStage: "Reading ZIP contents...",
    writingStage: "Creating 7z archive...",
    encryptedArchiveMessage: "Password-protected ZIP archives are not supported yet.",
    emptyArchiveMessage: "This ZIP archive contains no files to convert.",
  }, onStage);
};