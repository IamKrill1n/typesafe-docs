# Interface: SystemOneRequest<Q>

State and named questions for `systemOne`.

Additional properties on a request variable are forwarded, including `null` values.

## Extended by

* [`SystemOneRequestPayload`](./SystemOneRequestPayload.md)

## Type Parameters

### Q

`Q` *extends* [`Questions`](./Questions.md) = [`Questions`](./Questions.md)

## Properties

<a id="sdk-model" />

### model?

```ts
optional model?: string;
```

Model override; omitted values inherit `defaultModel`.

***

<a id="sdk-questions" />

### questions

```ts
questions: Q;
```

Nonempty questions keyed by the names used to identify their answers.

***

<a id="sdk-state" />

### state

```ts
state: EntryType;
```

Text, a JSON object or array, or `null` to evaluate.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
