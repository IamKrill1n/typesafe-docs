# Interface: BoxResponse

The answer to a `box` question.

## Properties

### box

```ts
readonly box: BoxCoordinates;
```

Where the instructions' subject is in the image.

***

### confidence

```ts
readonly confidence: number | null;
```

Confidence in the box, from zero to one, or `null` when the API didn't report it.

***

### type

```ts
readonly type: "box";
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
