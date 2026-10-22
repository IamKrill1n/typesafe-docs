> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Questions

> Provide state and ask yes/no, choice, and score questions using objects or dictionaries.

## State

`state` is the text or JSON object you want to ask questions about. It cannot be `None`, but values inside an object may be `None`.

## Question objects

Use `Noul`, `Choice`, `Score`, and `Box` to define questions with named arguments.

## typesafe\_sdk.NoulCriteria

Bases: `TypedDict`

Optional descriptions of the yes and no outcomes.

See the [noul primitive](https://docs.typesafe.ai/go/noul) for details.

### true

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`true

  :

  &#x20;

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None\`
</pre>

Description of the yes outcome as text, an asset, a JSON object, or an array; `None` leaves it undescribed.

### false

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`false

  :

  &#x20;

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None\`
</pre>

Description of the no outcome as text, an asset, a JSON object, or an array; `None` leaves it undescribed.

## typesafe\_sdk.Noul

`pydantic-model`

**Implementation**

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`Noul

  (

  \*\*

  data

  :

  &#x20;

  [Any](https://docs.python.org/3/library/typing.html#typing.Any)

  )\`
</pre>

**Overload 1**

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`Noul(
&#x20;   \*,
&#x20;   type: [Literal](https://docs.python.org/3/library/typing.html#typing.Literal)\["noul"] = ...,
&#x20;   instructions: [Content](/sdk/python/api/types/common#typesafe_sdk.Content),
&#x20;   criteria: [NoulCriteria](/sdk/python/api/types/questions#typesafe_sdk.NoulCriteria) | None = ...,
)`</pre>

**Overload 2**

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`Noul(
&#x20;   \*,
&#x20;   type: [Literal](https://docs.python.org/3/library/typing.html#typing.Literal)\["noul"] = ...,
&#x20;   instructions: None = ...,
&#x20;   criteria: \_DescribedTrue | \_DescribedFalse,
)`</pre>

Bases: `_Question`, `wire.NoulQuestion`

A yes/no question with optional descriptions for either outcome.

See the [noul primitive](https://docs.typesafe.ai/go/noul) for details.

> [!NOTE]
>
> **Show JSON schema:**
>
> > **Details**
> >
> > ```json theme={null}
> > {
> >   "$defs": {
> >     "Content": {
> >       "anyOf": [
> >         {
> >           "type": "string"
> >         },
> >         {
> >           "additionalProperties": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "object"
> >         },
> >         {
> >           "items": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "array"
> >         }
> >       ]
> >     },
> >     "ContentValue": {
> >       "anyOf": [
> >         {
> >           "type": "string"
> >         },
> >         {
> >           "type": "integer"
> >         },
> >         {
> >           "type": "number"
> >         },
> >         {
> >           "type": "boolean"
> >         },
> >         {
> >           "items": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "array"
> >         },
> >         {
> >           "additionalProperties": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "object"
> >         }
> >       ]
> >     },
> >     "NoulCriteria": {
> >       "additionalProperties": false,
> >       "description": "Optional descriptions of the yes and no outcomes.\n\nSee the [noul primitive](https://docs.typesafe.ai/go/noul) for details.",
> >       "properties": {
> >         "true": {
> >           "anyOf": [
> >             {
> >               "$ref": "#/$defs/Content"
> >             },
> >             {
> >               "type": "null"
> >             }
> >           ]
> >         },
> >         "false": {
> >           "anyOf": [
> >             {
> >               "$ref": "#/$defs/Content"
> >             },
> >             {
> >               "type": "null"
> >             }
> >           ]
> >         }
> >       },
> >       "title": "NoulCriteria",
> >       "type": "object"
> >     }
> >   },
> >   "additionalProperties": false,
> >   "description": "A yes/no question with optional descriptions for either outcome.\n\nSee the [noul primitive](https://docs.typesafe.ai/go/noul) for details.",
> >   "properties": {
> >     "type": {
> >       "const": "noul",
> >       "default": "noul",
> >       "title": "Type",
> >       "type": "string"
> >     },
> >     "instructions": {
> >       "anyOf": [
> >         {
> >           "$ref": "#/$defs/Content"
> >         },
> >         {
> >           "type": "null"
> >         }
> >       ],
> >       "default": null
> >     },
> >     "criteria": {
> >       "anyOf": [
> >         {
> >           "$ref": "#/$defs/NoulCriteria"
> >         },
> >         {
> >           "type": "null"
> >         }
> >       ],
> >       "default": null
> >     }
> >   },
> >   "title": "Noul",
> >   "type": "object"
> > }
> > ```

Fields:

* `type` (`Literal['noul']`)
* `instructions` (`Content | None`)
* `criteria` (`NoulCriteria | None`)

### instructions

`pydantic-field`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`instructions

  :

  &#x20;

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  &#x20;

  \=

  &#x20;

  None\`
</pre>

The question to ask, expressed as text, an asset, a JSON object, or an array; optional when `criteria` describes an outcome.

### criteria

`pydantic-field`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`criteria

  :

  &#x20;

  [NoulCriteria](/sdk/python/api/types/questions#typesafe_sdk.NoulCriteria)

  &#x20;

  |

  &#x20;

  None

  &#x20;

  \=

  &#x20;

  None\`
</pre>

Optional descriptions of the yes and no outcomes; required when `instructions` is `None`.

## typesafe\_sdk.Choice

`pydantic-model`

Bases: `_Question`, `wire.ChoiceQuestion`

A question that selects between named alternatives.

See the [choice primitive](https://docs.typesafe.ai/go/choice) for details.

> [!NOTE]
>
> **Show JSON schema:**
>
> > **Details**
> >
> > ```json theme={null}
> > {
> >   "$defs": {
> >     "Content": {
> >       "anyOf": [
> >         {
> >           "type": "string"
> >         },
> >         {
> >           "additionalProperties": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "object"
> >         },
> >         {
> >           "items": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "array"
> >         }
> >       ]
> >     },
> >     "ContentValue": {
> >       "anyOf": [
> >         {
> >           "type": "string"
> >         },
> >         {
> >           "type": "integer"
> >         },
> >         {
> >           "type": "number"
> >         },
> >         {
> >           "type": "boolean"
> >         },
> >         {
> >           "items": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "array"
> >         },
> >         {
> >           "additionalProperties": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "object"
> >         }
> >       ]
> >     }
> >   },
> >   "additionalProperties": false,
> >   "description": "A question that selects between named alternatives.\n\nSee the [choice primitive](https://docs.typesafe.ai/go/choice) for details.",
> >   "properties": {
> >     "type": {
> >       "const": "choice",
> >       "default": "choice",
> >       "title": "Type",
> >       "type": "string"
> >     },
> >     "instructions": {
> >       "anyOf": [
> >         {
> >           "$ref": "#/$defs/Content"
> >         },
> >         {
> >           "type": "null"
> >         }
> >       ],
> >       "default": null
> >     },
> >     "criteria": {
> >       "additionalProperties": {
> >         "anyOf": [
> >           {
> >             "$ref": "#/$defs/Content"
> >           },
> >           {
> >             "type": "null"
> >           }
> >         ]
> >       },
> >       "title": "Criteria",
> >       "type": "object"
> >     }
> >   },
> >   "required": [
> >     "criteria"
> >   ],
> >   "title": "Choice",
> >   "type": "object"
> > }
> > ```

Fields:

* `type` (`Literal['choice']`)
* `criteria` (`Mapping[str, Content | None]`)
* `instructions` (`Content | None`)

### criteria

`pydantic-field`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`criteria

  :

  &#x20;

  [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)

  \[

  [str](https://docs.python.org/3/builtins/stdtypes.html#str)

  ,

  &#x20;

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  ]\`
</pre>

A nonempty mapping of labels to text, asset, object, or array descriptions, or `None` for undescribed labels.

### instructions

`pydantic-field`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`instructions

  :

  &#x20;

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  &#x20;

  \=

  &#x20;

  None\`
</pre>

The question to ask, expressed as text, an asset, a JSON object, or an array; optional.

## typesafe\_sdk.Score

`pydantic-model`

Bases: `_Question`, `wire.ScoreQuestion`

A question that assigns a score using an ordered rubric.

See the [score primitive](https://docs.typesafe.ai/go/score) for details.

> [!NOTE]
>
> **Show JSON schema:**
>
> > **Details**
> >
> > ```json theme={null}
> > {
> >   "$defs": {
> >     "Content": {
> >       "anyOf": [
> >         {
> >           "type": "string"
> >         },
> >         {
> >           "additionalProperties": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "object"
> >         },
> >         {
> >           "items": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "array"
> >         }
> >       ]
> >     },
> >     "ContentValue": {
> >       "anyOf": [
> >         {
> >           "type": "string"
> >         },
> >         {
> >           "type": "integer"
> >         },
> >         {
> >           "type": "number"
> >         },
> >         {
> >           "type": "boolean"
> >         },
> >         {
> >           "items": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "array"
> >         },
> >         {
> >           "additionalProperties": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "object"
> >         }
> >       ]
> >     }
> >   },
> >   "additionalProperties": false,
> >   "description": "A question that assigns a score using an ordered rubric.\n\nSee the [score primitive](https://docs.typesafe.ai/go/score) for details.",
> >   "properties": {
> >     "type": {
> >       "const": "score",
> >       "default": "score",
> >       "title": "Type",
> >       "type": "string"
> >     },
> >     "instructions": {
> >       "anyOf": [
> >         {
> >           "$ref": "#/$defs/Content"
> >         },
> >         {
> >           "type": "null"
> >         }
> >       ],
> >       "default": null
> >     },
> >     "criteria": {
> >       "items": {
> >         "$ref": "#/$defs/Content"
> >       },
> >       "minItems": 1,
> >       "title": "Criteria",
> >       "type": "array"
> >     }
> >   },
> >   "required": [
> >     "criteria"
> >   ],
> >   "title": "Score",
> >   "type": "object"
> > }
> > ```

Fields:

* `type` (`Literal['score']`)
* `criteria` (`Sequence[Content]`)
* `instructions` (`Content | None`)

### criteria

`pydantic-field`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`criteria

  :

  &#x20;

  [Sequence](https://docs.python.org/3/library/collections.abc.html#collections.abc.Sequence)

  \[

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  ]\`
</pre>

A nonempty, ordered list of text, asset, object, or array descriptions, one per score from zero.

### instructions

`pydantic-field`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`instructions

  :

  &#x20;

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  &#x20;

  \=

  &#x20;

  None\`
</pre>

The question to ask, expressed as text, an asset, a JSON object, or an array; optional.

## typesafe\_sdk.Box

`pydantic-model`

Bases: `_Question`, `wire.BoxQuestion`

A question that locates what its instructions describe in the request's image.

Examples:

```python theme={null}
from pathlib import Path

from typesafe_sdk import Box, BoxAnswer, Image, TypeSafeClient


def locate_dog(client: TypeSafeClient, photo: Path) -> BoxAnswer:
    result = client.system_one(
        state=Image(photo),
        questions={"dog": Box(instructions="The dog")},
        model="jev-preview",
    )
    return result.boxes["dog"]
```

> [!NOTE]
>
> **Show JSON schema:**
>
> > **Details**
> >
> > ````json theme={null}
> > {
> >   "$defs": {
> >     "Content": {
> >       "anyOf": [
> >         {
> >           "type": "string"
> >         },
> >         {
> >           "additionalProperties": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "object"
> >         },
> >         {
> >           "items": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "array"
> >         }
> >       ]
> >     },
> >     "ContentValue": {
> >       "anyOf": [
> >         {
> >           "type": "string"
> >         },
> >         {
> >           "type": "integer"
> >         },
> >         {
> >           "type": "number"
> >         },
> >         {
> >           "type": "boolean"
> >         },
> >         {
> >           "items": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "array"
> >         },
> >         {
> >           "additionalProperties": {
> >             "anyOf": [
> >               {
> >                 "$ref": "#/$defs/ContentValue"
> >               },
> >               {
> >                 "type": "null"
> >               }
> >             ]
> >           },
> >           "type": "object"
> >         }
> >       ]
> >     }
> >   },
> >   "additionalProperties": false,
> >   "description": "A question that locates what its instructions describe in the request's image.\n\nExamples:\n    ```python\n    from pathlib import Path\n\n    from typesafe_sdk import Box, BoxAnswer, Image, TypeSafeClient\n\n\n    def locate_dog(client: TypeSafeClient, photo: Path) -> BoxAnswer:\n        result = client.system_one(\n            state=Image(photo),\n            questions={\"dog\": Box(instructions=\"The dog\")},\n            model=\"jev-preview\",\n        )\n        return result.boxes[\"dog\"]\n    ```",
> >   "properties": {
> >     "type": {
> >       "const": "box",
> >       "default": "box",
> >       "title": "Type",
> >       "type": "string"
> >     },
> >     "instructions": {
> >       "anyOf": [
> >         {
> >           "$ref": "#/$defs/Content"
> >         },
> >         {
> >           "type": "null"
> >         }
> >       ],
> >       "default": null
> >     }
> >   },
> >   "title": "Box",
> >   "type": "object"
> > }
> > ````

Fields:

* `type` (`Literal['box']`)
* `instructions` (`Content | None`)

### instructions

`pydantic-field`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`instructions

  :

  &#x20;

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  &#x20;

  \=

  &#x20;

  None\`
</pre>

What to locate in the request's image, expressed as text, an asset, a JSON object, or an array; optional.

## typesafe\_sdk.Question

`module-attribute`

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`Question: [TypeAlias](https://docs.python.org/3/library/typing.html#typing.TypeAlias) = (
&#x20;   [Noul](/sdk/python/api/types/questions#typesafe_sdk.Noul) | [Choice](/sdk/python/api/types/questions#typesafe_sdk.Choice) | [Score](/sdk/python/api/types/questions#typesafe_sdk.Score) | [Box](/sdk/python/api/types/questions#typesafe_sdk.Box) | [QuestionModel](/sdk/python/api/types/questions#typesafe_sdk.QuestionModel)
)`</pre>

A question object or question dictionary.

## typesafe\_sdk.Questions

`module-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`Questions

  :

  &#x20;

  [TypeAlias](https://docs.python.org/3/library/typing.html#typing.TypeAlias)

  &#x20;

  \=

  &#x20;

  [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)

  \[

  [str](https://docs.python.org/3/builtins/stdtypes.html#str)

  ,

  &#x20;

  [Question](/sdk/python/api/types/questions#typesafe_sdk.Question)

  ]\`
</pre>

Question inputs keyed by the names used to identify their answers.

## Question dictionaries

Question dictionaries include a `type` key: `"noul"`, `"choice"`, `"score"`, or `"box"`. You can mix dictionaries and question objects in the same request.

## typesafe\_sdk.NoulModel

Bases: `TypedDict`

A yes/no question dictionary with `type="noul"`.

See the [noul primitive](https://docs.typesafe.ai/go/noul) for details.

### type

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`type

  :

  &#x20;

  [Literal](https://docs.python.org/3/library/typing.html#typing.Literal)

  \[

  'noul'

  ]\`
</pre>

### instructions

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`instructions

  :

  &#x20;

  [NotRequired](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.NotRequired)

  \[

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  ]\`
</pre>

The question to ask, expressed as text, an asset, a JSON object, or an array; optional when `criteria` describes an outcome.

### criteria

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`criteria

  :

  &#x20;

  [NotRequired](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.NotRequired)

  \[

  [NoulCriteria](/sdk/python/api/types/questions#typesafe_sdk.NoulCriteria)

  &#x20;

  |

  &#x20;

  None

  ]\`
</pre>

Optional descriptions of the yes and no outcomes; required when `instructions` is `None`.

## typesafe\_sdk.ChoiceModel

Bases: `TypedDict`

A choice question dictionary with `type="choice"`.

See the [choice primitive](https://docs.typesafe.ai/go/choice) for details.

### type

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`type

  :

  &#x20;

  [Literal](https://docs.python.org/3/library/typing.html#typing.Literal)

  \[

  'choice'

  ]\`
</pre>

### instructions

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`instructions

  :

  &#x20;

  [NotRequired](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.NotRequired)

  \[

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  ]\`
</pre>

The question to ask, expressed as text, an asset, a JSON object, or an array; optional.

### criteria

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`criteria

  :

  &#x20;

  [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)

  \[

  [str](https://docs.python.org/3/builtins/stdtypes.html#str)

  ,

  &#x20;

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  ]\`
</pre>

A nonempty mapping of labels to text, asset, object, or array descriptions, or `None` for undescribed labels.

## typesafe\_sdk.ScoreModel

Bases: `TypedDict`

A score question dictionary with `type="score"`.

See the [score primitive](https://docs.typesafe.ai/go/score) for details.

### type

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`type

  :

  &#x20;

  [Literal](https://docs.python.org/3/library/typing.html#typing.Literal)

  \[

  'score'

  ]\`
</pre>

### instructions

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`instructions

  :

  &#x20;

  [NotRequired](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.NotRequired)

  \[

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  ]\`
</pre>

The question to ask, expressed as text, an asset, a JSON object, or an array; optional.

### criteria

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`criteria

  :

  &#x20;

  [Sequence](https://docs.python.org/3/library/collections.abc.html#collections.abc.Sequence)

  \[

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  ]\`
</pre>

A nonempty, ordered list of text, asset, object, or array descriptions, one per score from zero.

## typesafe\_sdk.BoxModel

Bases: `TypedDict`

A box question dictionary with `type="box"`.

### type

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`type

  :

  &#x20;

  [Literal](https://docs.python.org/3/library/typing.html#typing.Literal)

  \[

  'box'

  ]\`
</pre>

### instructions

`instance-attribute`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`instructions

  :

  &#x20;

  [NotRequired](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.NotRequired)

  \[

  [Content](/sdk/python/api/types/common#typesafe_sdk.Content)

  &#x20;

  |

  &#x20;

  None

  ]\`
</pre>

What to locate in the request's image, expressed as text, an asset, a JSON object, or an array; optional.

## typesafe\_sdk.QuestionModel

`module-attribute`

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`QuestionModel: [TypeAlias](https://docs.python.org/3/library/typing.html#typing.TypeAlias) = (
&#x20;   [NoulModel](/sdk/python/api/types/questions#typesafe_sdk.NoulModel)
&#x20;   | [ChoiceModel](/sdk/python/api/types/questions#typesafe_sdk.ChoiceModel)
&#x20;   | [ScoreModel](/sdk/python/api/types/questions#typesafe_sdk.ScoreModel)
&#x20;   | [BoxModel](/sdk/python/api/types/questions#typesafe_sdk.BoxModel)
)`</pre>

A question dictionary identified by its `type` key.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.