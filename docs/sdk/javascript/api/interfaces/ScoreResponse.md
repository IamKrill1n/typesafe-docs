# Interface: ScoreResponse<T>

An expected score with its rubric and probabilities.

## Type Parameters

### T

`T` *extends* [`ScoreCriteria`](../type-aliases/ScoreCriteria.md) = [`ScoreCriteria`](../type-aliases/ScoreCriteria.md)

## Properties

### confidence

```ts
readonly confidence: number;
```

Reported confidence in the score.

***

### legend

```ts
readonly legend: ScoreLegend<T>;
```

Rubric descriptions keyed by score.

***

### probabilities

```ts
readonly probabilities: { readonly [score in number | `${number}`]: number };
```

Probabilities keyed by score.

***

### score

```ts
readonly score: number;
```

Expected score, which may fall between integer rubric levels.

***

### type

```ts
readonly type: "score";
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
