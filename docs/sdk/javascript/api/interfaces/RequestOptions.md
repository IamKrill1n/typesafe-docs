# Interface: RequestOptions

Per-call options that override client settings.

## Properties

### headers?

```ts
optional headers?: Record<string, string>;
```

Additional headers, merged over `defaultHeaders`.

***

### retry?

```ts
optional retry?: Partial<RetryPolicy>;
```

Retry overrides for this call; omitted fields inherit client settings.

***

### signal?

```ts
optional signal?: AbortSignal;
```

Cancellation signal for the request and pending retries.

***

### timeout?

```ts
optional timeout?: number;
```

Timeout per attempt in milliseconds; there is no total retry budget.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
