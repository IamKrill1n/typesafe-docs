# typesafe-docs

Incremental mirror of the [TypeSafe](https://typesafe.ai) documentation
(<https://docs.typesafe.ai>) plus the zero-dependency crawler that maintains it.

The mirror is refreshed daily by a GitHub Actions workflow. Every page is stored
twice: verbatim upstream Markdown in `raw/`, and a cleaned plain-Markdown
rendering in `docs/` with Mintlify components converted to standard Markdown.

> **Unofficial.** This repository is not affiliated with TypeSafe. The mirrored
> content under `raw/`, `docs/`, and `index/` is TypeSafe's documentation and
> remains their property. TypeSafe publishes `llms.txt` for AI consumption and
> their `robots.txt` allows `ai-input` and `ai-train`; this mirror exists to make
> those docs greppable offline and reviewable as diffs.

## Layout

| Path | Contents |
| --- | --- |
| `raw/` | Verbatim Markdown served by `docs.typesafe.ai/<path>.md`, byte-for-byte |
| `docs/` | Cleaned plain Markdown, same tree as `raw/` (see cleaning rules below) |
| `index/llms.txt` | Upstream documentation index (the crawl's source of truth) |
| `index/llms-full.txt` | Upstream single-file aggregate |
| `index/sitemap.xml` | Upstream sitemap, cross-checked against the index |
| `index/README.md` | Generated table of contents with local links |
| `manifest.json` | Per-page `sha256` hashes, byte sizes, and last-changed timestamps |
| `scripts/crawl.mjs` | Crawler entry point |
| `scripts/lib/` | Fetch/retry, Mintlify cleaning, and link-rewriting helpers |
| `tests/` | `node:test` suites for the cleaner, parser, and fetch logic |

## Usage

Requires Node 24 (`nvm use`).

```bash
node scripts/crawl.mjs              # sync everything
node scripts/crawl.mjs --check      # report drift, write nothing (exit 1 on drift)
node scripts/crawl.mjs --only=concepts/state
node scripts/crawl.mjs --prune      # also delete pages removed upstream
node scripts/crawl.mjs --concurrency=12
```

| Flag | Meaning |
| --- | --- |
| `--check` | Fetch and compare against `manifest.json` without writing; exit 1 on drift |
| `--prune` | Remove mirrored files that are no longer listed in `llms.txt` |
| `--only=<page>` | Process one page (repeatable), e.g. `--only=sdk/python/usage` |
| `--concurrency=<n>` | Parallel downloads, 1-32 (default 6) |
| `--out=<dir>` | Repository root to write into (default `.`) |
| `--base=<url>` | Documentation origin (default `https://docs.typesafe.ai`) |

Other commands: `pnpm test` (unit tests), `pnpm lint` (syntax checks).

## How syncing works

1. Fetch `llms.txt`, `llms-full.txt`, and `sitemap.xml`; parse the 111 page links.
2. Fetch every page in parallel with retries and exponential backoff for
   `429`/`5xx` responses, honoring `Retry-After`.
3. Hash each page's bytes and compare with `manifest.json`. Unchanged pages are
   not rewritten, so commits stay small. A failed fetch never overwrites or
   deletes an existing file, and the run exits non-zero so CI surfaces it.
4. Write `raw/`, `docs/`, `index/`, and an updated `manifest.json` (sorted keys,
   `changed_at` preserved for untouched pages).

Running the crawler twice in a row reports `0 changed`.

## Cleaning rules

`docs/` is derived from `raw/` with a conservative transformer. Unknown tags are
left in place and reported as warnings rather than guessed at.

| Upstream (Mintlify MDX) | Cleaned Markdown |
| --- | --- |
| Embedded `export function ... { ... }` bundles (interactive examples) | Removed |
| `<Note>`, `<Info>`, `<Tip>`, `<Warning>`, `<Check>` | `> **Note:** ...` blockquotes |
| `<ParamField>` / `<ResponseField>` | `- **name** (`type`, required)` bullets |
| `<Tabs>` / `<Tab title>` | Headings |
| `<Accordion>` / `<Expandable title>` | `#### title` headings |
| `<Steps>` / `<Step title>` | `#### Step N: title` headings |
| `<Columns>` / `<Card title>` | Bullets |
| `<Frame>`, `<CodeGroup>`, `<AccordionGroup>` | Unwrapped |
| `<TypesafeExample>` (incl. multi-line `example={{...}}`) | Link to the live page plus the example payload in a `js` fence |
| `<SdkSignature>` (Python SDK pages) | Fenced `python` code block |
| ` ```lang theme={null}` fence metadata | Removed |
| Root-relative links like `/primitives` | Relative links when the target is mirrored, absolute URLs otherwise |

## Automation

`.github/workflows/update-docs.yml` runs the crawler daily at 06:17 UTC and on
manual dispatch, committing any changes as
`docs: sync TypeSafe documentation (YYYY-MM-DD)`. Failed crawls fail the job
instead of committing a partial mirror.

## License

The crawler code is MIT licensed (see `LICENSE`). Mirrored documentation content
is © TypeSafe.
