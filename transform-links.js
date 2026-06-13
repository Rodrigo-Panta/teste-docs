#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";

const DOCS_ROOT = path.resolve("./starlight/src/content/docs");
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

function normalizeLink(link, markdownFile) {
  const [pathname, suffix = ""] = link.split(/(?=[?#])/);

  let absolute;

  if (pathname.startsWith("/")) {
    absolute = path.posix.normalize(pathname);
  } else {
    absolute = path.resolve(
      path.dirname(markdownFile),
      pathname
    );
  }
  if (absolute.includes("README")) {
    console.log("absolute:", absolute);
  }

  const relativeToDocs = path.relative(
    DOCS_ROOT,
    absolute
  );

  const slug =
    "/" +
    path.posix
      .join(BASE_PATH, relativeToDocs)
      .replace(/\.md$/, "")
      .replace(/\\/g, "/");

  return slug + suffix;
}

async function processFile(file) {
  const original = await fs.readFile(file, "utf8");

  // Replace markdown links from [text](link) to [text](normalized-link)
  const updated = original.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (match, text, link) => {
      if (!shouldTransform(link)) {
        return match;
      }

      return `[${text}](${normalizeLink(link, file)})`;
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