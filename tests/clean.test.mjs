import assert from "node:assert/strict";
import { test } from "node:test";

import { cleanMarkdown } from "../scripts/lib/clean.mjs";

const LIVE_BASE = "https://docs.typesafe.ai";
const PAGE_PATH = "primitives/noul.md";
const PAGE_URL = `${LIVE_BASE}/primitives/noul`;
const PAGE_SET = new Set(["primitives/choice", "primitives/noul", "api", "introduction/quickstart"]);

const RAW = [
  "> ## Documentation Index",
  `> Fetch the complete documentation index at: ${LIVE_BASE}/llms.txt`,
  "> Use this file to discover all available pages before exploring further.",
  "",
  "# Noul",
  "",
  "> A Noul question asks for a probability.",
  "",
  "export function TypesafeExample({example, display, title}) {",
  '  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";',
  "  function compressToEncodedURIComponent(input) {",
  '    if (input == null) return "";',
  "    return input;",
  "  }",
  "}",
  "",
  "Ask whether the message needs action. See [Choice](/primitives/choice) and [the API](/api#errors).",
  "",
  "Match potential\\_duplicate records.",
  "",
  "<Note>",
  "  Keep the question narrow.",
  "",
  "  ```python theme={null}",
  '  state = "potential_duplicate"',
  "  ```",
  "</Note>",
  "",
  '<ParamField body="type" type="&#x22;noul&#x22;" required>',
  "  The yes/no question to evaluate.",
  "</ParamField>",
  "",
  '<Expandable title="map entries">',
  '  <ParamField body="‹question id›" type="Question">',
  "    A key you choose.",
  "  </ParamField>",
  "</Expandable>",
  "",
  "<Tabs>",
  '  <Tab title="Claude Code">',
  "    Run the plugin command.",
  "  </Tab>",
  '  <Tab title="Other agents">',
  "    Run the skills command.",
  "  </Tab>",
  "</Tabs>",
  "",
  "<Steps>",
  '  <Step title="Use code">',
  "    Keep rules in code.",
  "  </Step>",
  '  <Step title="Ask questions">',
  "    Ask narrow questions.",
  "  </Step>",
  "</Steps>",
  "",
  "<Columns>",
  '  <Card title="Structured" icon="braces">',
  "    Typed decisions.",
  "  </Card>",
  "</Columns>",
  "",
  '<TypesafeExample title="request" />',
  "",
  "![diagram](/images/diagram.png)",
].join("\n");

const OPTIONS = { pagePath: PAGE_PATH, pageSet: PAGE_SET, pageUrl: PAGE_URL, liveBase: LIVE_BASE };

test("cleanMarkdown removes the index banner and bundled scripts", () => {
  const { text, warnings } = cleanMarkdown(RAW, OPTIONS);
  assert.doesNotMatch(text, /Documentation Index/);
  assert.doesNotMatch(text, /export function/);
  assert.doesNotMatch(text, /compressToEncodedURIComponent/);
  assert.equal(warnings.length, 0);
});

test("cleanMarkdown converts alert components to labelled blockquotes", () => {
  const { text } = cleanMarkdown(RAW, OPTIONS);
  assert.match(text, /^> \*\*Note:\*\*$/m);
  assert.match(text, /^> Keep the question narrow\.$/m);
  assert.match(text, /^> ```python$/m);
  assert.match(text, /^> state = "potential_duplicate"$/m);
});

test("cleanMarkdown converts parameter fields to bullets and expands nesting", () => {
  const { text } = cleanMarkdown(RAW, OPTIONS);
  assert.match(text, /^- \*\*type\*\* \(`"noul"`, required\)$/m);
  assert.match(text, /^#### map entries$/m);
  assert.match(text, /^- \*\*‹question id›\*\* \(`Question`\)$/m);
  assert.match(text, /^  A key you choose\.$/m);
});

test("cleanMarkdown converts tabs, steps, and cards into markdown structure", () => {
  const { text } = cleanMarkdown(RAW, OPTIONS);
  assert.match(text, /^#### Claude Code$/m);
  assert.match(text, /^#### Other agents$/m);
  assert.match(text, /^#### Step 1: Use code$/m);
  assert.match(text, /^#### Step 2: Ask questions$/m);
  assert.match(text, /^- \*\*Structured\*\* —$/m);
});

test("cleanMarkdown replaces interactive placeholders with links", () => {
  const { text } = cleanMarkdown(RAW, OPTIONS);
  assert.match(
    text,
    /^> Interactive example: request — \[view it on docs\.typesafe\.ai\]\(https:\/\/docs\.typesafe\.ai\/primitives\/noul\)$/m,
  );
});

test("cleanMarkdown unescapes markdown escapes outside code", () => {
  const { text } = cleanMarkdown(RAW, OPTIONS);
  assert.match(text, /^Match potential_duplicate records\.$/m);
});

test("cleanMarkdown strips fence meta attributes", () => {
  const { text } = cleanMarkdown(RAW, OPTIONS);
  assert.doesNotMatch(text, /theme=\{null\}/);
  assert.match(text, /```python$/m);
});

test("cleanMarkdown rewrites root-relative links to local pages", () => {
  const { text } = cleanMarkdown(RAW, OPTIONS);
  assert.match(text, /\[Choice\]\(\.\/choice\.md\)/);
  assert.match(text, /\[the API\]\(\.\.\/api\.md#errors\)/);
  assert.match(text, /!\[diagram\]\(https:\/\/docs\.typesafe\.ai\/images\/diagram\.png\)/);
});

test("cleanMarkdown rewrites root-relative links from nested pages", () => {
  const raw = "See [the API](/api) and [home](/).\n";
  const { text } = cleanMarkdown(raw, {
    ...OPTIONS,
    pagePath: "introduction/quickstart.md",
    pageUrl: `${LIVE_BASE}/introduction/quickstart`,
  });
  assert.match(text, /\[the API\]\(\.\.\/api\.md\)/);
  assert.match(text, /\[home\]\(https:\/\/docs\.typesafe\.ai\/\)/);
});

test("cleanMarkdown leaves absolute links and bare urls untouched", () => {
  const raw = "Read [Jev](https://example.com/a?b=1) or https://docs.typesafe.ai/concepts/state.\n";
  const { text } = cleanMarkdown(raw, OPTIONS);
  assert.equal(text, raw);
});

test("cleanMarkdown is idempotent", () => {
  const first = cleanMarkdown(RAW, OPTIONS);
  const second = cleanMarkdown(first.text, OPTIONS);
  assert.equal(second.text, first.text);
  assert.deepEqual(second.warnings, []);
});

test("cleanMarkdown extracts multi-line interactive examples", () => {
  const raw = [
    "Before.",
    "",
    "  <TypesafeExample",
    '    title="request"',
    "    example={{",
    "  state:",
    '    "Payouts fail",',
    "  questions: {",
    "    is_urgent: { type: 'noul' },",
    "  },",
    "  }}",
    "  />",
    "",
    "After.",
  ].join("\n");
  const { text, warnings } = cleanMarkdown(raw, OPTIONS);
  assert.match(text, /^> Interactive example: request — \[view it on docs\.typesafe\.ai\]/m);
  assert.match(text, /^```js$/m);
  assert.match(text, /^state:$/m);
  assert.match(text, /^  "Payouts fail",$/m);
  assert.match(text, /^}$/m);
  assert.deepEqual(warnings, []);
});

test("cleanMarkdown decodes SdkSignature blocks into fenced code", () => {
  const raw = [
    "<SdkSignature>",
    '  <span className="nf">{"system_one"}</span><span className="p">{"("}</span>{"\\n"}{"    "}',
    '  <span className="n">{"state"}</span><span className="p">{":"}</span>{" "}<span className="n">{"JSONContent"}</span>',
    '  {"\\n"}<span className="p">{")"}</span>{"\\n"}',
    "</SdkSignature>",
  ].join("\n");
  const { text, warnings } = cleanMarkdown(raw, {
    ...OPTIONS,
    pagePath: "sdk/python/api/clients/async.md",
    pageUrl: `${LIVE_BASE}/sdk/python/api/clients/async`,
  });
  assert.match(text, /^```python$/m);
  assert.match(text, /^system_one\($/m);
  assert.match(text, /^    state: JSONContent$/m);
  assert.match(text, /^\)$/m);
  assert.deepEqual(warnings, []);
});

test("cleanMarkdown converts multi-line alerts that start with content", () => {
  const raw = [
    "<Info> A Choice question accepts up to 255 options, so this",
    "recipe searches documents of a bounded size.",
    "</Info>",
    "",
    "After.",
  ].join("\n");
  const { text, warnings } = cleanMarkdown(raw, OPTIONS);
  assert.match(text, /^> \*\*Info:\*\* A Choice question accepts up to 255 options, so this$/m);
  assert.match(text, /^> recipe searches documents of a bounded size\.$/m);
  assert.deepEqual(warnings, []);
});

test("cleanMarkdown warns about unknown and unbalanced components", () => {
  const raw = ['<Mystery title="x">', "  body", "</Mystery>", "", "<Note>", "  unclosed"].join("\n");
  const { warnings } = cleanMarkdown(raw, OPTIONS);
  assert.ok(warnings.some((warning) => warning.includes("unhandled component <Mystery>")));
  assert.ok(warnings.some((warning) => warning.includes("unbalanced components")));
});

test("cleanMarkdown keeps export statements inside code fences", () => {
  const raw = ["```js", "export function helper() {", "  return 1;", "}", "```", ""].join("\n");
  const { text } = cleanMarkdown(raw, OPTIONS);
  assert.match(text, /export function helper/);
});
