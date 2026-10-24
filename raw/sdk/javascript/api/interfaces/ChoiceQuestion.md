> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Interface: ChoiceQuestion<T>

A question that selects between named alternatives.

## Type Parameters

### T

`T` *extends* [`ChoiceCriteria`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/ChoiceCriteria) = [`ChoiceCriteria`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/ChoiceCriteria)

## Properties

### criteria

```ts theme={null}
criteria: T;
```

Descriptions of the available outcomes; at least one label is required.

***

### instructions?

```ts theme={null}
optional instructions?: EntryType;
```

The question as text, a JSON object, or an array; optional or `null`.

***

### type

```ts theme={null}
type: "choice";
```


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.