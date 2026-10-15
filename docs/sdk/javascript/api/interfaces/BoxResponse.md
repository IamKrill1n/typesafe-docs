# Interface: BoxResponse

The answer to a `box` question.

## Properties

<a id="sdk-box" />

### box

```ts
readonly box: BoxCoordinates;
```

Where the instructions' subject is in the image.

***

<a id="sdk-confidence" />

### confidence

```ts
readonly confidence: number | null;
```

Confidence in the box, from zero to one, or `null` when the API didn't report it.

***

<a id="sdk-type" />

### type

```ts
readonly type: "box";
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
