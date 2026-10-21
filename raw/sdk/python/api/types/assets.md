> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Assets

> Attach assets to System One requests and reference them from request content.

> [!NOTE]
>
> **Note**
>
> The API detects each image's format from its bytes.

## typesafe\_sdk.Asset

`module-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`Asset

  :

  &#x20;

  [TypeAlias](https://docs.python.org/3/library/typing.html#typing.TypeAlias)

  &#x20;

  \=

  &#x20;

  [Image](/sdk/python/api/types/assets#typesafe_sdk.Image)\`
</pre>

An asset referenced from request content; currently only images are supported.

## typesafe\_sdk.Image

`dataclass`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`Image

  (

  data

  :

  &#x20;

  [Buffer](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.Buffer)

  &#x20;

  |

  &#x20;

  [PathLike](https://docs.python.org/3/library/os.html#os.PathLike)

  \[

  [str](https://docs.python.org/3/builtins/stdtypes.html#str)

  ])\`
</pre>

An image asset backed by image file bytes, or a path to an image file.

> [!TIP]
>
> **Reusing images**
>
> An `Image` is loaded once, on first use, and reused by every request that sends the same `Image` object.

> [!TIP]
>
> **Working with `Buffer` objects**
>
> `Image` also accepts `Buffer` objects: anything exposing its memory through the [buffer protocol](https://docs.python.org/3/c-api/buffer.html), such as `bytearray`, `memoryview`, `mmap`, or NumPy arrays. Buffers other than `bytes` are copied into memory once, on first use, so the original can change or be closed afterwards.

Examples:

From a file path:

```python theme={null}
from pathlib import Path

image = Image(Path("photos/product.png"))
```

From bytes in memory:

```python theme={null}
def from_bytes(data: bytes) -> Image:
    return Image(data)
```

From base64 text, such as an upload:

```python theme={null}
def from_upload(data_base64: str) -> Image:
    return Image.from_base64(data_base64)
```

From a Pillow image (requires the `pil` extra):

```python theme={null}
import PIL.Image

image = Image.from_pil(PIL.Image.new("RGB", (64, 64)), format="jpeg")
```

From a slice of a larger buffer, without copying it into `bytes` first:

```python theme={null}
def embedded_photo(container: bytes, offset: int, length: int) -> Image:
    return Image(memoryview(container)[offset : offset + length])
```

From a memory-mapped file:

```python theme={null}
import mmap


def map_photo(path: Path) -> Image:
    with path.open("rb") as file:
        return Image(mmap.mmap(file.fileno(), 0, access=mmap.ACCESS_READ))
```

### data

`instance-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`data

  :

  &#x20;

  [Buffer](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.Buffer)

  &#x20;

  |

  &#x20;

  [PathLike](https://docs.python.org/3/library/os.html#os.PathLike)

  \[

  [str](https://docs.python.org/3/builtins/stdtypes.html#str)

  ]\`
</pre>

Image contents, represented as one of:

* raw bytes (anything supporting the [`Buffer` protocol](https://docs.python.org/3/library/stdtypes.html#buffer-objects))
* [path-like](https://docs.python.org/3/library/os.html#os.PathLike) object pointing at the image on the filesystem

### from\_base64

`classmethod`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`from\_base64

  (

  data

  :

  &#x20;

  [str](https://docs.python.org/3/builtins/stdtypes.html#str)

  &#x20;

  |

  &#x20;

  [Buffer](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.Buffer)

  )

  &#x20;

  ->

  &#x20;

  [Self](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.Self)\`
</pre>

Create an `Image` instance from a base64-encoded image bytes.

Parameters:

* **`data`** (`str | Buffer`) –

  The image file bytes, base64-encoded, as text or an ASCII buffer. Whitespace, such as the line breaks of wrapped base64, is ignored.

Raises:

* `TypeSafeError` –

  The data isn't valid base64 text.

### from\_pil

`classmethod`

Copy signature
<pre tabIndex={0} aria-label="SDK signature">`from\_pil(
&#x20;   image: [PIL](https://pillow.readthedocs.io/en/stable/PIL.html#module-PIL).[Image](https://pillow.readthedocs.io/en/stable/reference/Image.html#module-PIL.Image).[Image](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image), format: [str](https://docs.python.org/3/builtins/stdtypes.html#str) = "jpeg"
) -> [Self](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.Self)`</pre>

Create an `Image` instance from a [Pillow](https://pillow.readthedocs.io/) image.

> [!WARNING]
>
> **Encoder settings**
>
> The image is saved with Pillow's default encoder settings, except that JPEG uses quality 95. JPEG can't store transparency or palettes, so pass `format="png"` for RGBA or P mode images. Encode it yourself if different settings are needed.

Parameters:

* **`image`** (`PIL.Image.Image`) –

  The Pillow image to encode.
* **`format`** (`str`, default: `'jpeg'` ) –

  The image format to save as, by its [Pillow name](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html).

Raises:

* `TypeSafeError` –

  Pillow can't encode the image in this format.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.