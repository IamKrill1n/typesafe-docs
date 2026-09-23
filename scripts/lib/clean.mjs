import { rewriteLinksInLine } from "./links.mjs";

const ALERT_COMPONENTS = new Map([
  ["Note", "Note"],
  ["Info", "Info"],
  ["Tip", "Tip"],
  ["Warning", "Warning"],
  ["Check", "Check"],
]);
const FIELD_COMPONENTS = new Set(["ParamField", "ResponseField"]);
const HEADING_COMPONENTS = new Set(["Accordion", "Expandable", "Tab"]);
const PLAIN_WRAPPERS = new Set(["Frame", "CodeGroup", "AccordionGroup", "Tabs", "Columns"]);
const PLACEHOLDER_COMPONENTS = new Map([
  ["TypesafeExample", "Interactive example"],
  ["ScoreExplorer", "Interactive score explorer"],
  ["ConfidenceExplorer", "Interactive confidence explorer"],
]);
const KNOWN_COMPONENTS = new Set([
  ...ALERT_COMPONENTS.keys(),
  ...FIELD_COMPONENTS,
  ...HEADING_COMPONENTS,
  ...PLAIN_WRAPPERS,
  ...PLACEHOLDER_COMPONENTS.keys(),
  "Steps",
  "Step",
  "Card",
]);

const COMPONENT_PROBE =
  /<\/?(?:Note|Info|Tip|Warning|Check|ParamField|ResponseField|Tab|Tabs|Accordion|Expandable|Steps|Step|Card|Columns|Frame|CodeGroup|AccordionGroup|TypesafeExample|ScoreExplorer|ConfidenceExplorer)\b/;

export function cleanMarkdown(raw, { pagePath, pageSet, pageUrl, liveBase }) {
  const warnings = [];
  const warn = (message) => {
    if (!warnings.includes(message)) warnings.push(message);
  };

  const text = stripIndexBanner(raw.replace(/\r\n?/g, "\n"));

  const lines = text.split("\n");
  const out = [];
  const stack = [];
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = /^((?:[ \t]*>)*[ \t]*)(`{3,}|~{3,})(.*)$/.exec(line);

    if (fence) {
      if (fenceMatch && fenceMatch[2][0] === fence.char && fenceMatch[2].length >= fence.length) {
        fence = null;
      }
      out.push(present(stack, line));
      continue;
    }

    if (fenceMatch) {
      fence = { char: fenceMatch[2][0], length: fenceMatch[2].length };
      out.push(present(stack, cleanFenceInfo(line)));
      continue;
    }

    if (/^export\s+(?:async\s+)?(?:function|class|const|let|var)\b/.test(line)) {
      index = skipExportBlock(lines, index, warn, pagePath);
      continue;
    }

    if (/^\s*<TypesafeExample\s*$/.test(line)) {
      const block = collectBlock(lines, index, /^\s*\/>\s*$/);
      if (block) {
        index = block.end;
        out.push(...renderExampleBlock(block.text, { stack, pageUrl }));
      } else {
        warn(`unterminated <TypesafeExample> block in ${pagePath}`);
        out.push(present(stack, line));
      }
      continue;
    }

    if (/^\s*<SdkSignature>\s*$/.test(line)) {
      const block = collectBlock(lines, index, /^\s*<\/SdkSignature>\s*$/);
      if (block) {
        index = block.end;
        out.push(...renderSignatureBlock(block.text, { stack, pagePath, warn }));
      } else {
        warn(`unterminated <SdkSignature> block in ${pagePath}`);
        out.push(present(stack, line));
      }
      continue;
    }

    const tag = parseWholeLineTag(line);
    if (tag) {
      if (KNOWN_COMPONENTS.has(tag.name)) {
        handleTag(tag, { stack, out, pageUrl, warn, pagePath });
      } else {
        if (/^[A-Z]/.test(tag.name)) warn(`unhandled component <${tag.name}> in ${pagePath}`);
        out.push(present(stack, line));
      }
      continue;
    }

    const closing = /^(\s*)<\/([A-Za-z][A-Za-z0-9-]*)>\s*$/.exec(line);
    if (closing && KNOWN_COMPONENTS.has(closing[2])) {
      closeTag(closing[2], stack, warn, pagePath);
      continue;
    }

    const inlineAlert = /^(\s*)<(Note|Info|Tip|Warning|Check)>(.*)$/.exec(line);
    if (inlineAlert && !inlineAlert[3].includes(`</${inlineAlert[2]}>`)) {
      const [, indent, name, rest] = inlineAlert;
      out.push(present(stack, `> **${name}:**${rest.trim() === "" ? "" : ` ${rest.trim()}`}`));
      stack.push({ name, kind: "alert", strip: indent.length + 2, prefix: "> " });
      continue;
    }

    let content = line;
    let popAfter = null;
    const trailing = /^(.*?)<\/\s*([A-Za-z][A-Za-z0-9-]*)\s*>\s*$/.exec(line);
    if (trailing && KNOWN_COMPONENTS.has(trailing[2]) && stack.some((entry) => entry.name === trailing[2])) {
      content = trailing[1].replace(/\s+$/, "");
      popAfter = trailing[2];
    }

    if (content.trim() !== "" || popAfter === null) {
      content = replaceInlineComponents(content, { pageUrl });
      if (COMPONENT_PROBE.test(content)) warn(`inline component kept in ${pagePath}`);
      content = unescapeOutsideCode(content);
      content = rewriteLinksInLine(content, { fromPath: pagePath, pageSet, liveBase });
      out.push(present(stack, content));
    }

    if (popAfter) closeTag(popAfter, stack, warn, pagePath);
  }

  if (stack.length > 0) {
    warn(`unbalanced components in ${pagePath}: ${stack.map((entry) => `<${entry.name}>`).join(", ")}`);
  }

  let cleaned = out.join("\n");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "").replace(/\s+$/, "");
  cleaned = cleaned === "" ? "" : `${cleaned}\n`;

  validate(cleaned, pagePath, warn);
  return { text: cleaned, warnings };
}

function stripIndexBanner(text) {
  return text.replace(/^> ## Documentation Index\n(?:>[^\n]*\n)*\n?/, "");
}

function skipExportBlock(lines, start, warn, pagePath) {
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^\}[;,]?\s*$/.test(lines[index]) || /^\);\s*$/.test(lines[index])) return index;
  }
  warn(`unterminated export block in ${pagePath}`);
  return start;
}

function collectBlock(lines, start, endPattern) {
  for (let index = start + 1; index < lines.length && index - start <= 500; index += 1) {
    if (endPattern.test(lines[index])) {
      return { end: index, text: lines.slice(start, index + 1).join("\n") };
    }
  }
  return null;
}

function renderExampleBlock(text, { stack, pageUrl }) {
  const title = /title="([^"]*)"/.exec(text)?.[1];
  const label = title ? `: ${decodeEntities(title)}` : "";
  const out = [present(stack, `> Interactive example${label} — [view it on docs.typesafe.ai](${pageUrl})`)];
  const payloadStart = text.indexOf("example={{");
  const payloadEnd = text.lastIndexOf("}}");
  if (payloadStart === -1 || payloadEnd <= payloadStart) return out;

  const payload = dedentText(text.slice(payloadStart + "example={{".length, payloadEnd));
  if (payload === "") return out;

  out.push("");
  out.push(presentRaw(stack, "```js"));
  out.push(presentRaw(stack, "{"));
  for (const line of payload.split("\n")) out.push(presentRaw(stack, line));
  out.push(presentRaw(stack, "}"));
  out.push(presentRaw(stack, "```"));
  return out;
}

function dedentText(value) {
  const lines = value.replace(/^\n+/, "").replace(/\s+$/, "").split("\n");
  const indents = lines
    .filter((line) => line.trim() !== "")
    .map((line) => /^[ \t]*/.exec(line)[0].length);
  const min = indents.length > 0 ? Math.min(...indents) : 0;
  return lines
    .map((line) => line.slice(Math.min(min, /^[ \t]*/.exec(line)[0].length)))
    .join("\n");
}

function renderSignatureBlock(text, { stack, pagePath, warn }) {
  const body = decodeJsxText(text)
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/^\n+/, "")
    .replace(/\n+$/, "");
  if (body === "") {
    warn(`empty <SdkSignature> block in ${pagePath}`);
    return [];
  }

  const language = pagePath.includes("sdk/python") ? "python" : "text";
  const out = [presentRaw(stack, `\`\`\`${language}`)];
  for (const line of body.split("\n")) out.push(presentRaw(stack, line));
  out.push(presentRaw(stack, "```"));
  return out;
}

function decodeJsxText(text) {
  const token = /<[^>]*>|\{"((?:[^"\\]|\\.)*)"\}/g;
  let result = "";
  let last = 0;
  let match;

  while ((match = token.exec(text)) !== null) {
    const plain = text.slice(last, match.index);
    if (plain.trim() !== "") result += plain;
    if (match[1] !== undefined) {
      try {
        result += JSON.parse(`"${match[1]}"`);
      } catch {
        result += match[1];
      }
    }
    last = token.lastIndex;
  }

  const tail = text.slice(last);
  if (tail.trim() !== "") result += tail;
  return result;
}

function cleanFenceInfo(line) {
  return line.replace(/\s+(?:theme|focus)=\{[^}]*\}/g, "");
}

function parseWholeLineTag(line) {
  const opening = /^(\s*)<([A-Za-z][A-Za-z0-9-]*)\b/.exec(line);
  if (!opening) return null;
  const afterName = opening[1].length + 1 + opening[2].length;
  const end = findTagEnd(line, afterName);
  if (end === -1) return null;
  if (line.slice(end + 1).trim() !== "") return null;
  const rawAttrs = line.slice(afterName, end);
  return {
    indent: opening[1].length,
    name: opening[2],
    attrs: parseAttrs(rawAttrs),
    selfClosing: rawAttrs.trimEnd().endsWith("/"),
  };
}

function findTagEnd(line, from) {
  let quote = null;
  for (let index = from; index < line.length; index += 1) {
    const char = line[index];
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === ">") return index;
  }
  return -1;
}

function parseAttrs(rawAttrs) {
  const attrs = {};
  const pattern = /([A-Za-z_][\w:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
  let match;
  while ((match = pattern.exec(rawAttrs)) !== null) {
    attrs[match[1]] = match[2] ?? match[3] ?? true;
  }
  return attrs;
}

function handleTag(tag, { stack, out, pageUrl, warn, pagePath }) {
  const { name, indent, attrs, selfClosing } = tag;

  if (PLACEHOLDER_COMPONENTS.has(name)) {
    out.push(present(stack, placeholderText(name, attrs, pageUrl)));
    if (!selfClosing) stack.push({ name, kind: "plain", strip: indent + 2, prefix: "" });
    return;
  }

  if (ALERT_COMPONENTS.has(name)) {
    out.push(present(stack, `> **${ALERT_COMPONENTS.get(name)}:**`));
    stack.push({ name, kind: "alert", strip: indent + 2, prefix: "> " });
    return;
  }

  if (FIELD_COMPONENTS.has(name)) {
    out.push(present(stack, fieldBullet(name, attrs)));
    if (!selfClosing) stack.push({ name, kind: "field", strip: indent + 2, prefix: "  " });
    return;
  }

  if (selfClosing) {
    if (name !== "Card") warn(`dropped self-closing <${name} /> in ${pagePath}`);
    return;
  }

  if (HEADING_COMPONENTS.has(name)) {
    out.push(present(stack, `#### ${decodeEntities(String(attrs.title ?? name))}`), "");
    stack.push({ name, kind: "heading", strip: indent + 2, prefix: "" });
    return;
  }

  if (name === "Step") {
    const steps = [...stack].reverse().find((entry) => entry.kind === "steps");
    const number = steps ? (steps.counter += 1) : 1;
    const title = attrs.title ? `: ${decodeEntities(String(attrs.title))}` : "";
    out.push(present(stack, `#### Step ${number}${title}`), "");
    stack.push({ name, kind: "step", strip: indent + 2, prefix: "" });
    return;
  }

  if (name === "Steps") {
    stack.push({ name, kind: "steps", strip: indent + 2, prefix: "", counter: 0 });
    return;
  }

  if (name === "Card" && attrs.title) {
    out.push(present(stack, `- **${decodeEntities(String(attrs.title))}** —`));
    stack.push({ name, kind: "card", strip: indent + 2, prefix: "  " });
    return;
  }

  stack.push({ name, kind: "plain", strip: indent + 2, prefix: "" });
}

function closeTag(name, stack, warn, pagePath) {
  const index = stack.map((entry) => entry.name).lastIndexOf(name);
  if (index === -1) {
    warn(`unmatched closing tag </${name}> in ${pagePath}`);
    return;
  }
  if (index !== stack.length - 1) warn(`interleaved tags before </${name}> in ${pagePath}`);
  stack.length = index;
}

function fieldBullet(name, attrs) {
  const label = decodeEntities(String(attrs.body ?? attrs.name ?? name));
  const type = attrs.type ? `\`${decodeEntities(String(attrs.type))}\`` : null;
  const details = [type, attrs.required === true ? "required" : null].filter(Boolean);
  const suffix = details.length > 0 ? ` (${details.join(", ")})` : "";
  return `- **${label}**${suffix}`;
}

function placeholderText(name, attrs, pageUrl) {
  const label = PLACEHOLDER_COMPONENTS.get(name);
  const title = attrs.title ? `: ${decodeEntities(String(attrs.title))}` : "";
  return `> ${label}${title} — [view it on docs.typesafe.ai](${pageUrl})`;
}

function replaceInlineComponents(line, { pageUrl }) {
  return line
    .replace(
      /<(Note|Info|Tip|Warning|Check)>([^<>]*)<\/\1>/g,
      (match, name, body) => `> **${name}:** ${body.trim()}`,
    )
    .replace(/<(TypesafeExample|ScoreExplorer|ConfidenceExplorer)\b[^<>]*?\/>/g, (match, name) =>
      placeholderText(name, parseAttrs(match.slice(1 + name.length, -2)), pageUrl),
    );
}

function unescapeOutsideCode(line) {
  const parts = line.split("`");
  for (let index = 0; index < parts.length; index += 2) {
    parts[index] = parts[index].replace(/\\_/g, "_");
  }
  return parts.join("`");
}

function present(stack, line) {
  if (line.trim() === "") {
    return stack
      .filter((entry) => entry.prefix.startsWith(">"))
      .map(() => ">")
      .join("");
  }
  return stack.map((entry) => entry.prefix).join("") + dedent(stack, line);
}

function presentRaw(stack, line) {
  if (line === "") return present(stack, line);
  return stack.map((entry) => entry.prefix).join("") + line;
}

function dedent(stack, line) {
  let result = line;
  for (const entry of stack) {
    let removed = 0;
    while (removed < entry.strip && (result[removed] === " " || result[removed] === "\t")) {
      removed += 1;
    }
    result = result.slice(removed);
  }
  return result;
}

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (match, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function validate(cleaned, pagePath, warn) {
  if (/^export\s+(?:async\s+)?(?:function|class|const|let|var)\b/m.test(cleaned)) {
    warn(`leftover export statement in ${pagePath}`);
  }
  if (/\b_compress\(/.test(cleaned)) warn(`leftover bundled script in ${pagePath}`);
  if (COMPONENT_PROBE.test(cleaned)) warn(`leftover component tag in ${pagePath}`);
  if (cleaned.trim() === "") warn(`cleaned output is empty for ${pagePath}`);
}
