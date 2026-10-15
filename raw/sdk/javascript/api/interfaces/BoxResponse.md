> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Interface: BoxResponse

The answer to a `box` question.

## Properties

<a id="sdk-box" />

### box

```ts theme={null}
readonly box: BoxCoordinates;
```

Where the instructions' subject is in the image.

***

<a id="sdk-confidence" />

### confidence

```ts theme={null}
readonly confidence: number | null;
```

Confidence in the box, from zero to one, or `null` when the API didn't report it.

***

<a id="sdk-type" />

### type

```ts theme={null}
readonly type: "box";
```


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.