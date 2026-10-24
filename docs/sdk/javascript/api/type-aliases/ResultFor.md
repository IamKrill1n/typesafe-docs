# Type Alias: ResultFor<T>

```ts
type ResultFor<T> = T extends NoulQuestion ? NoulResponse : T extends ScoreQuestion<infer S> ? ScoreResponse<S> : T extends ChoiceQuestion<infer E> ? ChoiceResponse<E> : T extends BoxQuestion ? BoxResponse : never;
```

The answer type for a question, preserving its criteria keys.

## Type Parameters

### T

`T` *extends* [`Question`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/Question)

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
