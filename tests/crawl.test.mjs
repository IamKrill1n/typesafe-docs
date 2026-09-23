import assert from "node:assert/strict";
import { test } from "node:test";

import {
  extractSitemapPaths,
  parseArgs,
  parseIndex,
  renderToc,
  serializeManifest,
  toPageKey,
} from "../scripts/crawl.mjs";
import { backoffDelay, fetchText, mapLimit, parseRetryAfter } from "../scripts/lib/fetch.mjs";

const LIVE_BASE = "https://docs.typesafe.ai";

function response(status, body = "", headers = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: "",
    headers: new Headers(headers),
    text: async () => body,
  };
}

test("parseArgs returns defaults", () => {
  assert.deepEqual(parseArgs([]), {
    base: LIVE_BASE,
    out: ".",
    concurrency: 6,
    check: false,
    prune: false,
    only: [],
    help: false,
  });
});

test("parseArgs normalizes flags", () => {
  const options = parseArgs(["--check", "--prune", "--concurrency=4", "--only=/concepts/state.md", "--out=tmp"]);
  assert.equal(options.check, true);
  assert.equal(options.prune, true);
  assert.equal(options.concurrency, 4);
  assert.deepEqual(options.only, ["concepts/state"]);
  assert.equal(options.out, "tmp");
});

test("parseArgs rejects bad input", () => {
  assert.throws(() => parseArgs(["--concurrency=99"]), /invalid --concurrency/);
  assert.throws(() => parseArgs(["--nope"]), /unknown argument/);
});

test("parseIndex reads title, url, and description", () => {
  const markdown = [
    "# TypeSafe AI",
    "",
    "- [Introduction](https://docs.typesafe.ai/introduction.md): Jev is the flagship model.",
    "- [State](https://docs.typesafe.ai/concepts/state.md)",
    "- [External](https://example.com/other.md): ignore me",
    "- [Not markdown](https://docs.typesafe.ai/models)",
    "- [Duplicate](https://docs.typesafe.ai/introduction.md)",
  ].join("\n");
  assert.deepEqual(parseIndex(markdown), [
    {
      title: "Introduction",
      url: "https://docs.typesafe.ai/introduction.md",
      description: "Jev is the flagship model.",
      pagePath: "introduction.md",
    },
    {
      title: "State",
      url: "https://docs.typesafe.ai/concepts/state.md",
      description: "",
      pagePath: "concepts/state.md",
    },
  ]);
});

test("extractSitemapPaths filters and normalizes locations", () => {
  const xml = [
    '<?xml version="1.0"?>',
    "<urlset>",
    "<url><loc>https://docs.typesafe.ai/</loc></url>",
    "<url><loc>https://docs.typesafe.ai/concepts/state</loc></url>",
    "<url><loc>https://docs.typesafe.ai/introduction/quickstart</loc></url>",
    "<url><loc>https://example.com/nope</loc></url>",
    "</urlset>",
  ].join("\n");
  assert.deepEqual(extractSitemapPaths(xml), ["concepts/state", "introduction/quickstart"]);
});

test("renderToc links to local mirrored pages", () => {
  const toc = renderToc([
    { title: "State", description: "What state is.", pagePath: "concepts/state.md" },
    { title: "A | B", description: "", pagePath: "a.md" },
  ]);
  assert.match(toc, /\[State\]\(\.\.\/docs\/concepts\/state\.md\)/);
  assert.match(toc, /A \\\| B/);
});

test("serializeManifest sorts page keys and counts pages", () => {
  const entries = new Map([
    ["b.md", { raw_sha256: "2" }],
    ["a.md", { raw_sha256: "1" }],
  ]);
  const manifest = JSON.parse(serializeManifest(LIVE_BASE, entries));
  assert.equal(manifest.source, LIVE_BASE);
  assert.equal(manifest.page_count, 2);
  assert.deepEqual(Object.keys(manifest.pages), ["a.md", "b.md"]);
});

test("toPageKey strips markdown extension and leading slash", () => {
  assert.equal(toPageKey("/concepts/state.md"), "concepts/state");
  assert.equal(toPageKey("concepts/state.md"), "concepts/state");
});

test("parseRetryAfter handles seconds, dates, and garbage", () => {
  assert.equal(parseRetryAfter("5"), 5000);
  assert.equal(parseRetryAfter(null), null);
  assert.equal(parseRetryAfter("not-a-date"), null);
  assert.ok(parseRetryAfter(new Date(Date.now() + 10_000).toUTCString()) > 0);
});

test("backoffDelay grows exponentially with jitter", () => {
  assert.ok(backoffDelay(1, 100, 10_000) >= 100);
  assert.ok(backoffDelay(1, 100, 10_000) < 200);
  assert.ok(backoffDelay(6, 100, 1000) >= 1000);
});

test("fetchText retries retryable responses and honors retry-after", async () => {
  const delays = [];
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    if (calls < 3) return response(429, "", { "retry-after": "1" });
    return response(200, "payload");
  };
  const text = await fetchText("https://example.com/page", {
    fetchImpl,
    sleep: async (ms) => delays.push(ms),
  });
  assert.equal(text, "payload");
  assert.equal(calls, 3);
  assert.deepEqual(delays, [1000, 1000]);
});

test("fetchText retries network errors", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    if (calls === 1) throw new Error("socket closed");
    return response(200, "ok");
  };
  const text = await fetchText("https://example.com/page", { fetchImpl, sleep: async () => {} });
  assert.equal(text, "ok");
  assert.equal(calls, 2);
});

test("fetchText does not retry client errors", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return response(404, "missing");
  };
  await assert.rejects(
    () => fetchText("https://example.com/page", { fetchImpl, sleep: async () => {} }),
    /HTTP 404/,
  );
  assert.equal(calls, 1);
});

test("fetchText gives up after the configured retries", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return response(529, "overloaded");
  };
  await assert.rejects(
    () => fetchText("https://example.com/page", { fetchImpl, retries: 2, sleep: async () => {} }),
    /failed after 3 attempt/,
  );
  assert.equal(calls, 3);
});

test("mapLimit preserves input order", async () => {
  const items = [0, 1, 2, 3, 4, 5, 6];
  const results = await mapLimit(items, 3, async (item) => {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return item * 2;
  });
  assert.deepEqual(results, items.map((item) => item * 2));
});

test("mapLimit respects the concurrency limit", async () => {
  let active = 0;
  let peak = 0;
  await mapLimit(Array.from({ length: 12 }, (unused, index) => index), 3, async () => {
    active += 1;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 2));
    active -= 1;
  });
  assert.ok(peak <= 3, `peak concurrency was ${peak}`);
});

test("mapLimit propagates worker failures", async () => {
  await assert.rejects(
    () =>
      mapLimit([1, 2, 3], 2, async (item) => {
        if (item === 2) throw new Error("boom");
        return item;
      }),
    /boom/,
  );
});
