# Type Alias: ScoreLegend<T>

```ts
type ScoreLegend<T> = { readonly [score in ScoreOf<T>]: SentContent<T[score]> };
```

Rubric descriptions keyed by score.

## Type Parameters

### T

`T` *extends* [`ScoreCriteria`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/ScoreCriteria)

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
