import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const packageDist = path.join(projectRoot, "node_modules", "libarchive.js", "dist");
const outputDirectory = path.join(projectRoot, "public", "archive-runtime");

await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  ["worker-bundle.js", "libarchive.wasm"].map(fileName =>
    copyFile(path.join(packageDist, fileName), path.join(outputDirectory, fileName)),
  ),
);