# Type Alias: ScoreOf<T>

```ts
type ScoreOf<T> = number extends T["length"] ? number : Extract<keyof T, `${number}`>;
```

Score keys inferred from the rubric; a fixed-length tuple yields its indices, otherwise `number`.

## Type Parameters

### T

`T` *extends* [`ScoreCriteria`](./ScoreCriteria.md)

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
