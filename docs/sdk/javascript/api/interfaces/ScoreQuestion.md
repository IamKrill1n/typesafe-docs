# Interface: ScoreQuestion<T>

A question that assigns a score using an ordered rubric.

## Type Parameters

### T

`T` *extends* [`ScoreCriteria`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/ScoreCriteria) = [`ScoreCriteria`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/ScoreCriteria)

## Properties

### criteria

```ts
criteria: T;
```

Descriptions of the available outcomes.

***

### instructions?

```ts
optional instructions?: EntryType;
```

The question as text, a JSON object, or an array; optional or `null`.

***

### type

```ts
type: "score";
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
