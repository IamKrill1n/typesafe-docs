const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504, 529]);

export const USER_AGENT =
  "typesafe-docs-mirror/1.0 (+https://github.com/IamKrill1n/typesafe-docs)";

export const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class HttpError extends Error {
  constructor(status, statusText, retryAfter) {
    super(`HTTP ${status}${statusText ? ` ${statusText}` : ""}`);
    this.name = "HttpError";
    this.status = status;
    this.retryAfter = retryAfter;
    this.retryable = RETRYABLE_STATUS.has(status);
  }
}

export function parseRetryAfter(value) {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const at = Date.parse(value);
  if (Number.isNaN(at)) return null;
  return Math.max(0, at - Date.now());
}

export function backoffDelay(attempt, baseDelayMs = 500, maxDelayMs = 30_000) {
  const exponential = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
  return exponential + Math.random() * baseDelayMs;
}

export async function fetchText(url, options = {}) {
  const {
    fetchImpl = fetch,
    retries = 4,
    timeoutMs = 20_000,
    baseDelayMs = 500,
    maxDelayMs = 30_000,
    sleep = defaultSleep,
    headers = {},
    onRetry = () => {},
  } = options;
  const attempts = retries + 1;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: {
          accept: "text/markdown, text/plain;q=0.9, */*;q=0.1",
          "user-agent": USER_AGENT,
          ...headers,
        },
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new HttpError(
          response.status,
          response.statusText,
          response.headers.get("retry-after"),
        );
      }

      return await response.text();
    } catch (error) {
      const retryable = error instanceof HttpError ? error.retryable : true;
      if (!retryable || attempt === attempts) {
        throw new Error(`fetch ${url} failed after ${attempt} attempt(s): ${error.message}`, {
          cause: error,
        });
      }
      const delayMs =
        error instanceof HttpError
          ? (parseRetryAfter(error.retryAfter) ?? backoffDelay(attempt, baseDelayMs, maxDelayMs))
          : backoffDelay(attempt, baseDelayMs, maxDelayMs);
      onRetry({ url, attempt, attempts, reason: error.message, delayMs });
      await sleep(delayMs);
    }
  }

  throw new Error(`fetch ${url} failed: retries exhausted`);
}

export async function mapLimit(items, limit, worker) {
  const size = Math.max(1, Math.min(limit, items.length));
  const results = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: size }, async () => {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  });

  const settled = await Promise.allSettled(runners);
  const failure = settled.find((result) => result.status === "rejected");
  if (failure) throw failure.reason;
  return results;
}
