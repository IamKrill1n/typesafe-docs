# Variable: score

```ts
const score: {
<T>  (instructions, criteria): ScoreQuestion<T>;
<T>  (instructions, criteria): ScoreQuestion<readonly [T[number], T[number], T[number]]>;
};
```

Create a score question using an ordered rubric.

## Call Signature

```ts
<T>(instructions, criteria): ScoreQuestion<T>;
```

### Type Parameters

#### T

`T` *extends* [`ScoreCriteria`](../type-aliases/ScoreCriteria.md)

### Parameters

#### instructions

[`EntryType`](../type-aliases/EntryType.md)

#### criteria

`T`

### Returns

[`ScoreQuestion`](../interfaces/ScoreQuestion.md)\<`T`>

## Call Signature

```ts
<T>(instructions, criteria): ScoreQuestion<readonly [T[number], T[number], T[number]]>;
```

### Type Parameters

#### T

`T` *extends* readonly [`EntryType`](../type-aliases/EntryType.md)\[]

### Parameters

#### instructions

[`EntryType`](../type-aliases/EntryType.md)

#### criteria

`T` & `number` *extends* `T`\[`"length"`] ? `unknown` : `never`

### Returns

[`ScoreQuestion`](../interfaces/ScoreQuestion.md)\<readonly \[`T`\[`number`], `T`\[`number`], `T`\[`number`]]>

## Param

**instructions**

The question as text, a JSON object or array, or `null`.

## Param

**criteria**

At least two descriptions indexed by score from zero; entries may be `null`.
A list built at runtime, such as a `string[]`, is accepted, and `systemOne` rejects it when
it has fewer than two entries.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
