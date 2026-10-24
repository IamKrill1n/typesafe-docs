# Interface: SystemOneResult<Q>

Answers keyed by question name, with model and usage metadata.

## Type Parameters

### Q

`Q` *extends* [`Questions`](https://docs.typesafe.ai/sdk/javascript/api/interfaces/Questions)

## Properties

### answers

```ts
readonly answers: { readonly [K in string | number | symbol]: ResultFor<Q[K]> };
```

Answers with types inferred from the supplied questions.

***

### model

```ts
readonly model: string;
```

The model used to answer the request.

***

### usage

```ts
readonly usage: Usage;
```

Token usage for the request.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
