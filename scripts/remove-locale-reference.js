#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";

const DOCS_ROOT = path.resolve("./docs-src/src/content/docs");
const BASE_PATH = 'teste-docs';

const localeBasePaths = {
  "en": "",
  "pt": "pt-br",
}


async function processFile(file) {
  const original = await fs.readFile(file, "utf8");

  // Removes the line containing the locale reference (e.g., "🌐 English" or "🌐 Português")
  const updated = original.replace(
    /^.*🌐.*/g,
    ""
  );

  if (updated !== original) {
    await fs.writeFile(file, updated);
    console.log("updated:", file);
  }
}

async function main() {

  const files = Object.values(localeBasePaths).map((loc) => path.join(DOCS_ROOT, loc, 'index.md'));

  for (const file of files) {
    await processFile(file);
  }

  console.log(`processed ${files.length} files`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});