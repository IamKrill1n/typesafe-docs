import { posix } from "node:path";

const LINK_RE = /(!?\[[^\]]*\]\()(\/[^)\s]*)(\))/g;

export function splitAnchor(target) {
  const index = target.indexOf("#");
  if (index === -1) return { path: target, anchor: "" };
  return { path: target.slice(0, index), anchor: target.slice(index) };
}

export function toPageKey(linkPath) {
  const trimmed = linkPath.replace(/^\/+/, "");
  if (trimmed === "") return null;
  const key = trimmed.endsWith(".md") ? trimmed.slice(0, -3) : trimmed;
  if (key.endsWith("/")) return null;
  return key;
}

export function relativeDocLink(fromPath, targetPageKey) {
  const relative = posix.relative(posix.dirname(fromPath), `${targetPageKey}.md`);
  return relative.startsWith(".") ? relative : `./${relative}`;
}

export function rewriteLinksInLine(line, { fromPath, pageSet, liveBase }) {
  return line.replace(LINK_RE, (match, open, target, close) => {
    if (target.startsWith("//")) return `${open}https:${target}${close}`;
    const { path: linkPath, anchor } = splitAnchor(target);
    const key = toPageKey(linkPath);
    if (key === null || !pageSet.has(key)) {
      return `${open}${liveBase}${target}${close}`;
    }
    return `${open}${relativeDocLink(fromPath, key)}${anchor}${close}`;
  });
}
