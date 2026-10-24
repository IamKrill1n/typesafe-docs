# Interface: ChoiceResponse<T>

A selected label and its probabilities.

## Type Parameters

### T

`T` *extends* [`ChoiceCriteria`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/ChoiceCriteria) = [`ChoiceCriteria`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/ChoiceCriteria)

## Properties

### choice

```ts
readonly choice: keyof T & string;
```

The selected label.

***

### confidence

```ts
readonly confidence: number;
```

Reported confidence in the selected label.

***

### probabilities

```ts
readonly probabilities: { readonly [label in string | number | symbol]: number };
```

Probabilities keyed by label.

***

### type

```ts
readonly type: "choice";
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
