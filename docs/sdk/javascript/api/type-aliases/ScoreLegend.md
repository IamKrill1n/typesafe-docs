# Type Alias: ScoreLegend<T>

```ts
type ScoreLegend<T> = { readonly [score in ScoreOf<T>]: T[score] };
```

Rubric descriptions keyed by score.

## Type Parameters

### T

`T` *extends* [`ScoreCriteria`](./ScoreCriteria.md)

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
