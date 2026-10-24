> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Type Alias: ResultFor<T>

```ts theme={null}
type ResultFor<T> = T extends NoulQuestion ? NoulResponse : T extends ScoreQuestion<infer S> ? ScoreResponse<S> : T extends ChoiceQuestion<infer E> ? ChoiceResponse<E> : T extends BoxQuestion ? BoxResponse : never;
```

The answer type for a question, preserving its criteria keys.

## Type Parameters

### T

`T` *extends* [`Question`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/Question)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.