import { Archive, ArchiveCompression, ArchiveFormat } from "libarchive.js";

export interface ArchiveFile {
  file: File;
  pathname: string;
}

export interface ArchiveExtractionOptions {
  readingStage: string;
  encryptedArchiveMessage: string;
  emptyArchiveMessage: string;
}

export interface ArchiveConversionOptions extends ArchiveExtractionOptions {
  outputFileName: string;
  outputFormat: ArchiveFormat;
  compression: ArchiveCompression;
  writingStage: string;
}

let archiveRuntimeInitialized = false;

const normalizeArchivePath = (pathname: string) => {
  const normalized = pathname.replace(/\\/g, "/");
  const segments = normalized.split("/").filter(Boolean);

  if (normalized.startsWith("/") || /^[a-zA-Z]:/.test(normalized) || segments.some(segment => segment === ".." || segment === ".")) {
    throw new Error("This archive contains an unsafe file path and cannot be converted.");
  }

  return segments.join("/");
};

const resolveArchiveFilePath = (basePath: string, fileName: string) => {
  const directoryPath = basePath.replace(/\/+/g, "/").replace(/\/+$/, "");
  const nextPath = directoryPath ? `${directoryPath}/${fileName}` : fileName;
  return normalizeArchivePath(nextPath);
};

export const flattenArchiveFiles = (entry: unknown, parentPath = ""): ArchiveFile[] => {
  if (entry instanceof File) {
    const pathname = normalizeArchivePath(parentPath || entry.name);
    return pathname ? [{ file: entry, pathname }] : [];
  }

  if (Array.isArray(entry)) {
    return entry.flatMap((item) => {
      if (!item || typeof item !== "object") return [];

      const file = "file" in item ? item.file : item;
      const itemPath = "path" in item ? String(item.path) : "pathname" in item ? String(item.pathname) : "";

      if (file instanceof File) {
        const pathname = resolveArchiveFilePath(itemPath, file.name);
        return pathname ? [{ file, pathname }] : [];
      }

      return flattenArchiveFiles(file, parentPath || itemPath);
    });
  }

  if (!entry || typeof entry !== "object") return [];

  return Object.entries(entry).flatMap(([name, child]) =>
    flattenArchiveFiles(child, parentPath ? `${parentPath}/${name}` : name),
  );
};

const initializeArchiveRuntime = () => {
  if (archiveRuntimeInitialized) return;

  const workerUrl = new URL(
    `${import.meta.env.BASE_URL}archive-runtime/worker-bundle.js`,
    window.location.origin,
  );
  Archive.init({ workerUrl });
  archiveRuntimeInitialized = true;
};

export const extractArchiveFiles = async (
  sourceFile: File,
  options: ArchiveExtractionOptions,
  onStage: (stage: string) => void,
): Promise<ArchiveFile[]> => {
  initializeArchiveRuntime();
  onStage(options.readingStage);
  const archive = await Archive.open(sourceFile);

  try {
    if (await archive.hasEncryptedData()) {
      throw new Error(options.encryptedArchiveMessage);
    }

    const files = flattenArchiveFiles(await archive.extractFiles());
    if (!files.length) throw new Error(options.emptyArchiveMessage);
    return files;
  } finally {
    await archive.close();
  }
};

export const convertArchive = async (
  sourceFile: File,
  options: ArchiveConversionOptions,
  onStage: (stage: string) => void,
): Promise<File> => {
  const files = await extractArchiveFiles(sourceFile, options, onStage);
  onStage(options.writingStage);

  type ArchiveWriteInput = Omit<Parameters<typeof Archive.write>[0], "files"> & {
    files: ArchiveFile[];
  };
  // libarchive.js declares each input file recursively as ArchiveEntryFile, but its writer consumes File objects.
  const writeArchive = Archive.write.bind(Archive) as unknown as (input: ArchiveWriteInput) => Promise<File>;
  return writeArchive({
    files,
    outputFileName: options.outputFileName,
    compression: options.compression,
    format: options.outputFormat,
    passphrase: null,
  });
};
