#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";

const DOCS_ROOT = path.resolve("./docs-src/src/content/docs");
const BASE_PATH = 'teste-docs';

const localeBasePaths = {
  "en": "",
  "pt": "pt-br",
}

async function findMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return [];
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        return [fullPath];
      }

      return [];
    })
  );

  return files.flat();
}

function shouldTransform(link) {
  if (
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("mailto:") ||
    link.startsWith("#")
  ) {
    return false;
  }

  const pathname = link.split("#")[0].split("?")[0];

  return (
    !path.extname(pathname) ||
    pathname.endsWith(".md")
  );
}

function normalizeLink(link, markdownFile, localeBasePath) {
  const [pathname, suffix = ""] = link.split(/(?=[?#])/);

  let name = path.basename(pathname, path.extname(pathname));

  if (name === "README") {
    name = "index.html";
  }

  const final = ("/" + BASE_PATH + "/" + localeBasePath + "/" + name).replace(/\/+/g, "/");
  return final;
}

async function processFile(file, localeBasePath) {
  const original = await fs.readFile(file, "utf8");

  // Replace markdown links from [text](link) to [text](normalized-link)
  const updated = original.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (match, text, link) => {
      if (!shouldTransform(link)) {
        return match;
      }

      return `[${text}](${normalizeLink(link, file, localeBasePath)})`;
    }
  );

  // Replaces README for index in the link body 
  const final = updated.replace(
    /\[([^\]]+)\]\((.*README.*)\)/g,
    (match, text, link) => {
      return `[${text}](${link.replace("README", "index.html")})`;
    }
  );

  if (final !== original) {
    await fs.writeFile(file, final);
    console.log("updated:", file);
  }
}

async function main() {

  for (const locale in localeBasePaths) {
    const basePath = localeBasePaths[locale];
    const files = await findMarkdownFiles(path.join(DOCS_ROOT, basePath));

    for (const file of files) {
      await processFile(file, basePath);
    }

    console.log(`processed ${files.length} files`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});