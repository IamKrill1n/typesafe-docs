# Assets

> Attach assets to System One requests and reference them from request content.

<a id="assets" />

> **Note:**
> **Note**
>
> The API detects each image's format from its bytes.

<h2 id="typesafe_sdk.Asset">
  typesafe_sdk.Asset
</h2>

`module-attribute`

```python
Asset: TypeAlias = Image
```

An asset referenced from request content; currently only images are supported.

<h2 id="typesafe_sdk.Image">
  typesafe_sdk.Image
</h2>

`dataclass`

```python
Image(data: Buffer | PathLike[str])
```

An image asset backed by image file bytes, or a path to an image file.

> **Tip:**
> **Reusing images**
>
> An `Image` is loaded once, on first use, and reused by every request that sends the same `Image` object.

> **Tip:**
> **Working with `Buffer` objects**
>
> `Image` also accepts `Buffer` objects: anything exposing its memory through the [buffer protocol](https://docs.python.org/3/c-api/buffer.html), such as `bytearray`, `memoryview`, `mmap`, or NumPy arrays. Buffers other than `bytes` are copied into memory once, on first use, so the original can change or be closed afterwards.

Examples:

From a file path:

```python
from pathlib import Path

image = Image(Path("photos/product.png"))
```

From bytes in memory:

```python
def from_bytes(data: bytes) -> Image:
    return Image(data)
```

From base64 text, such as an upload:

```python
def from_upload(data_base64: str) -> Image:
    return Image.from_base64(data_base64)
```

From a Pillow image (requires the `pil` extra):

```python
import PIL.Image

image = Image.from_pil(PIL.Image.new("RGB", (64, 64)), format="jpeg")
```

From a slice of a larger buffer, without copying it into `bytes` first:

```python
def embedded_photo(container: bytes, offset: int, length: int) -> Image:
    return Image(memoryview(container)[offset : offset + length])
```

From a memory-mapped file:

```python
import mmap

def map_photo(path: Path) -> Image:
    with path.open("rb") as file:
        return Image(mmap.mmap(file.fileno(), 0, access=mmap.ACCESS_READ))
```

<h3 id="typesafe_sdk.Image.data">
  data
</h3>

`instance-attribute`

```python
data: Buffer | PathLike[str]
```

Image contents, represented as one of:

* raw bytes (anything supporting the [`Buffer` protocol](https://docs.python.org/3/library/stdtypes.html#buffer-objects))
* [path-like](https://docs.python.org/3/library/os.html#os.PathLike) object pointing at the image on the filesystem

<h3 id="typesafe_sdk.Image.from_base64">
  from_base64
</h3>

`classmethod`

```python
from_base64(data: str | Buffer) -> Self
```

Create an `Image` instance from a base64-encoded image bytes.

Parameters:

* **`data`** (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a> | <a href="https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.Buffer">Buffer</a></code>) –

  The image file bytes, base64-encoded, as text or an ASCII buffer. Whitespace, such as the line breaks of wrapped base64, is ignored.

Raises:

* <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeError">TypeSafeError</a></code> –

  The data isn't valid base64 text.

<h3 id="typesafe_sdk.Image.from_pil">
  from_pil
</h3>

`classmethod`

```python
from_pil(
    image: PIL.Image.Image, format: str = "jpeg"
) -> Self
```

Create an `Image` instance from a [Pillow](https://pillow.readthedocs.io/) image.

> **Warning:**
> **Encoder settings**
>
> The image is saved with Pillow's default encoder settings, except that JPEG uses quality 95. JPEG can't store transparency or palettes, so pass `format="png"` for RGBA or P mode images. Encode it yourself if different settings are needed.

Parameters:

* **`image`** (<code><a href="https://pillow.readthedocs.io/en/stable/PIL.html#module-PIL">PIL</a>.<a href="https://pillow.readthedocs.io/en/stable/reference/Image.html#module-PIL.Image">Image</a>.<a href="https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image">Image</a></code>) –

  The Pillow image to encode.
* **`format`** (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a></code>, default: `'jpeg'` ) –

  The image format to save as, by its [Pillow name](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html).

Raises:

* <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeError">TypeSafeError</a></code> –

  Pillow can't encode the image in this format.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
