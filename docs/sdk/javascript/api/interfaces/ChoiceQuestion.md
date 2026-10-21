# Interface: ChoiceQuestion<T>

A question that selects between named alternatives.

## Type Parameters

### T

`T` *extends* [`ChoiceCriteria`](../type-aliases/ChoiceCriteria.md) = [`ChoiceCriteria`](../type-aliases/ChoiceCriteria.md)

## Properties

### criteria

```ts
criteria: T;
```

Descriptions of the available outcomes; at least one label is required.

***

### instructions?

```ts
optional instructions?: EntryType;
```

The question as text, a JSON object, or an array; optional or `null`.

***

### type

```ts
type: "choice";
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
