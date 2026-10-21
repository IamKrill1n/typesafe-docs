# Interface: SystemOneRequest<Q>

State and named questions for `systemOne`.

Additional properties on a request variable are forwarded, including `null` values.

## Type Parameters

### Q

`Q` *extends* [`Questions`](./Questions.md) = [`Questions`](./Questions.md)

## Properties

### assets?

```ts
optional assets?: Record<string, Image>;
```

References mapped to assets, for referencing assets by name.

References are matched literally in string values within `state`, question instructions,
or criteria. Use distinct delimiters (such as `<photo>`) to avoid matching ordinary text.
Assets placed directly in `state` or question content, or in `withAssets` text, are sent
without being listed here. Every name must appear in the request; otherwise the call
rejects before sending.

***

### model?

```ts
optional model?: string;
```

Model override; omitted values inherit `defaultModel`.

***

### questions

```ts
questions: Q;
```

Nonempty questions keyed by the names used to identify their answers.

***

### state

```ts
state: NonNullable<EntryType>;
```

Text, an asset, a JSON object, or an array to evaluate.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
