#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";

const DOCS_ROOT = path.resolve("./docs-src/src/content/docs");
const BASE_PATH = 'teste-docs';

async function findMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return findMarkdownFiles(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        return [fullPath];
      }

      return [];
    })
  );

  return files.flat();
}


async function processFile(file) {
  const original = await fs.readFile(file, "utf8");

  // Replace markdown links from [text](link) to [text](normalized-link)
  const updated = original.replace(
    /^# (.*)/g,
    (match, text) => {
      return `---\ntitle: "${text}"\n---`;
    });


  if (updated !== original) {
    await fs.writeFile(file, updated);
    console.log("updated:", file);
  }
}

async function main() {
  const files = await findMarkdownFiles(DOCS_ROOT);

  for (const file of files) {
    await processFile(file);
  }

  console.log(`processed ${files.length} files`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});