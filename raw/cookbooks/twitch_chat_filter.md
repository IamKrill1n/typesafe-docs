> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Twitch chat filter

> Hides insults, spam, and unasked-for gameplay tips in Twitch chat, blurs spoilers, and highlights questions. Each message gets one TypeSafe request with three questions, requests run concurrently, and plain rules in code turn the answers into what the viewer sees.

You are watching a Twitch stream, and the chat moves faster than you can read it. We sort
each message as it arrives: questions are highlighted, spam, insults and unrequested
gameplay tips are hidden, and spoilers are blurred. A keyword list could catch spam
links, but "go left, there's a site of grace behind the tree" has no bad words in it, and
neither does a plot twist.

Send each message to Jev in its own request, with the stream title and game. Ask
three questions about it: what kind of message it is, whether it is toxic (insulting,
hateful, or harassing), and whether it spoils the game. A few plain rules then turn those
answers into what the viewer sees. [Guardrails for LLMs](https://docs.typesafe.ai/cookbooks/llm_guardrails.md) uses
the same pattern to screen messages going into and out of an LLM.

This demo shows a Jev-powered Chrome extension filtering a real, live Twitch chat:

[Twitch chat filtering Chrome extension demo](https://player.vimeo.com/video/1230896366)

Here we run 29 chat messages, written for an Elden Ring stream, through the filter. It
hides seven, blurs two, and highlights six as questions.

![Five chat messages go to Jev at once, each in its own request with the stream's game. The category, toxic, and spoiler answers come back, and decide() shows, highlights, hides, or blurs each message in the viewer's chat](https://mintcdn.com/ts-docs/TYTnI8jOLDlVpJfa/cookbooks/twitch_chat_filter/twitch-chat-filter-hero-light.gif?s=b2b03e7fd60ef3d43c74bb21cc7404f4)

We build two functions: `classify()` asks the three questions about one message, and
`decide()` turns the answers into show, highlight, dim, hide, or blur. When you change a
rule, such as hiding spam, you rerun only `decide()`, with no new request to Jev.

## Setup

```bash theme={null}
pip install 'typesafe-sdk>=0.7.1,<0.8.0' ipython 'cooksafe>=0.2.0,<0.3.0'
```

Create a new file named `twitch_chat_filter.py`. As you work through this cookbook,
copy each Python code block into that file, in order. For a live run, set
`TYPESAFE_API_KEY` in your environment. Once you have added all the blocks, run this
command from the file's directory:

```bash theme={null}
python twitch_chat_filter.py
```

Every API response is saved in
[`json_cache.json`](https://github.com/typesafe-ai/typesafe-public-examples/blob/main/cookbooks/twitch_chat_filter/json_cache.json)
beside the script. Download it there to replay the published numbers instead of calling
the API. In a notebook, put the cache in the notebook's working directory instead. To run
everything live again, move the cache aside and set your key. Do the same when changing
`TYPESAFE_MODEL`, because the cache key below includes the state and questions, not the
model.

Numbers below came from `jev-1.14.0` on 2026-10-29.

```python theme={null}
from concurrent.futures import ThreadPoolExecutor
import os
from pathlib import Path
from time import perf_counter

from cooksafe import JsonCache, make_playground_link
from IPython.display import Markdown, display
from typesafe_sdk import Choice, Noul, NoulCriteria, TypeSafeClient

TYPESAFE_MODEL = "jev-1.14.0"

client = TypeSafeClient(
    api_key=os.environ.get("TYPESAFE_API_KEY", "cache-only"),  # cached re-renders need no key
    base_url=os.environ.get("TYPESAFE_ENDPOINT"),
    timeout=60.0,
)
CACHE_DIR = Path(__file__).resolve().parent if "__file__" in globals() else Path.cwd()
json_cache = JsonCache(CACHE_DIR / "json_cache.json")
```

## Load a stretch of chat

We wrote the messages ourselves so that every kind of message turns up at least twice.
Two of them are emote-only lines (emotes are small chat images on Twitch, typed as words
like `PogChamp`).

Whether a message is a spoiler or backseat advice (gameplay tips the streamer did not ask
for) depends on which game is being played, so the stream title and game go into every
request.

```python expandable theme={null}
STREAM = {"title": "Elden Ring first playthrough! No spoilers please", "game": "Elden Ring"}

CHAT = [
    ("night-owl-22", "hi chat, first time catching a stream live"),
    ("ggwp-andy", "PogChamp PogChamp PogChamp"),
    ("mira-plays", "how many hours have you played so far?"),
    ("tarnished-tom", "this area looks so good at night"),
    ("backseat-bert", "go left, there's a site of grace behind the tree"),
    ("follow4follow-bot", "Want more viewers? Buy 1000 followers for $5 at cheapviewz dot example"),
    ("lore-hound", "wait till you find out Ranni planned the Night of Black Knives"),
    ("kappa-kev", "LUL LUL LUL"),
    ("sunny-skies", "are you going to do a no-hit run after this?"),
    ("rage-ryan", "you're genuinely the worst player i've ever seen, uninstall trash"),
    ("cozy-cat", "the music in this area is so good"),
    ("backseat-bert", "use your flask NOW, why are you not healing"),
    ("mira-plays", "W streamer"),
    ("ggwp-andy", "GG that was insane"),
    ("quiet-quinn", "anyone else watching from Brazil?"),
    ("tarnished-tom", "what build are you going for?"),
    ("lore-hound", "the ending where you become Elden Lord with Ranni is the best one"),
    ("kappa-kev", "chat is wild today lol"),
    ("backseat-bert", "the boss is weak to fire, equip the torch before you go in"),
    ("rage-ryan", "nobody cares about your opinion, go back to your basement"),
    ("cozy-cat", "you're so bad at this boss lmao, love you tho"),
    ("sunny-skies", "who is the final boss?"),
    ("ggwp-andy", "LETS GOOOO"),
    ("night-owl-22", "i just got this game too, it's so hard"),
    ("promo-pete", "check out my channel, I stream every day, follow me!"),
    ("quiet-quinn", "dodge rolling through that was clean"),
    ("mira-plays", "is the DLC worth it?"),
    ("cozy-cat", "your character looks so cool"),
    ("night-owl-22", "this boss took me 40 tries lol"),
]

print(f"{len(CHAT)} messages. What one request sends as its state:")
print({"stream": STREAM, "message": {"user": CHAT[4][0], "text": CHAT[4][1]}})
```

```
29 messages. What one request sends as its state:
{'stream': {'title': 'Elden Ring first playthrough! No spoilers please', 'game': 'Elden Ring'}, 'message': {'user': 'backseat-bert', 'text': "go left, there's a site of grace behind the tree"}}
```

## Write the questions

One request asks three questions about the same state: the stream plus one message.

* The `category` question is a `Choice` over five kinds of message. The label it picks
  decides what happens to the message: show, highlight, dim, or hide.
* The `toxic` question is a `Noul`. If its probability reaches the threshold `TOXIC_AT`,
  the message is hidden, whatever its category.
* The `spoiler` question is a `Noul`. If its probability reaches the threshold
  `SPOILER_AT`, the message is blurred, unless it is already hidden.

The category describes the message's main purpose. Repeated emotes and cheering count
as `hype`; unsolicited promotion counts as `spam`. A link alone is not spam.
`conversation` is the fallback when none of the other categories fits.

```python theme={null}
QUESTIONS = {
    "category": Choice(
        instructions="Which category best describes the main purpose of `message.text`?",
        criteria={
            "question": "A genuine request for information from the streamer or chat, "
            "not gameplay instructions phrased as a question or a promotional pitch",
            "hype": "Cheering, reactions, or repeated emotes (PogChamp, LUL, GG, W, "
            "lets gooo); repetition alone does not make cheering spam",
            "conversation": "Ordinary chatter, opinions, replies, useful shared links, "
            "or any message whose main purpose does not fit the other categories",
            "backseat": "Unrequested gameplay advice telling the streamer what to do, "
            "including instructions phrased as a question; not a request for information",
            "spam": "Unsolicited advertising, self-promotion, follower selling, or "
            "promotional links; not ordinary cheering, repeated emotes, or a useful link",
        },
    ),
    "toxic": Noul(
        instructions="Is this message insulting, hateful or harassing towards someone?",
        criteria=NoulCriteria(
            true="Insults, slurs, threats or personal attacks on the streamer or another viewer",
            false="Friendly, neutral, or light banter with no target",
        ),
    ),
    "spoiler": Noul(
        instructions="Does this message reveal a plot point or ending of the game being played?"
    ),
}
```

## Classify one message

Each message becomes one request: we build the state from the message and send it with
the three questions. The cache key is the state and the questions written out as JSON,
and each answer is saved under that key. Editing a question changes that key, so the next
run sends a new request instead of replaying the old answer.

```python expandable theme={null}
def classify(user: str, text: str, stream: dict | None = None) -> dict:
    state = {
        "stream": STREAM if stream is None else stream,
        "message": {"user": user, "text": text},
    }
    questions = {key: q.model_dump(mode="json", exclude_none=True) for key, q in QUESTIONS.items()}
    return _ask(state, questions)


@json_cache
def _ask(state: dict, questions: dict) -> dict:
    if not os.environ.get("TYPESAFE_API_KEY"):
        raise RuntimeError(
            "Set TYPESAFE_API_KEY for a live request, or put the cookbook's "
            "json_cache.json beside your script (in the working directory for a notebook)."
        )
    started = perf_counter()
    response = client.system_one(state=state, questions=questions, model=TYPESAFE_MODEL)
    category = response.answers["category"]
    return {
        "category": category.choice,
        "probabilities": dict(category.probabilities),
        "toxic": response.answers["toxic"].noul,
        "spoiler": response.answers["spoiler"].noul,
        "model": response.model,
        "seconds": round(perf_counter() - started, 2),
    }


def show(user: str, text: str) -> None:
    result = classify(user, text)
    print(f"{user}: {text}")
    for label, p in sorted(result["probabilities"].items(), key=lambda kv: -kv[1]):
        print(f"  {label:<13}{p:5.2f}  {'#' * round(p * 30)}".rstrip())
    print(f"  {'toxic':<13}{result['toxic']:5.2f}")
    print(f"  {'spoiler':<13}{result['spoiler']:5.2f}\n")


show("backseat-bert", "go left, there's a site of grace behind the tree")
show("lore-hound", "wait till you find out Ranni planned the Night of Black Knives")
show("cozy-cat", "you're so bad at this boss lmao, love you tho")
```

```
backseat-bert: go left, there's a site of grace behind the tree
  backseat      1.00  ##############################
  question      0.00
  hype          0.00
  conversation  0.00
  spam          0.00
  toxic         0.03
  spoiler       0.07

lore-hound: wait till you find out Ranni planned the Night of Black Knives
  conversation  0.67  ####################
  backseat      0.32  ##########
  hype          0.01
  question      0.00
  spam          0.00
  toxic         0.04
  spoiler       0.95

cozy-cat: you're so bad at this boss lmao, love you tho
  conversation  0.79  ########################
  hype          0.21  ######
  question      0.00
  backseat      0.00
  spam          0.00
  toxic         0.28
  spoiler       0.02
```

The backseat advice comes back as `backseat` at 1.00, with low `toxic` and `spoiler`. The
Night of Black Knives message favors `conversation` over `backseat`, 0.67 to 0.32, and
the `spoiler` question catches it. The last message reads like an insult, but `toxic` stays
low. With "love you tho" on the end, it fits the "light banter" description in the
question.

## Decide what the viewer sees

Deciding what the viewer sees needs no new request. We read only the answers and apply
three checks in order:

1. A message at or above `TOXIC_AT` is hidden.
2. A message whose category has the rule `hide` is hidden.
3. A message at or above `SPOILER_AT` is blurred.

Any message left gets the rule for its category.

On the sample messages, every toxic probability is either at least 0.97 or at most 0.38,
and every spoiler probability either at least 0.95 or at most 0.38. Any threshold above
0.38 and up to 0.95 gives the same result here. Your own channel's chat is likely to have
probabilities inside that range, so check both thresholds against it before using them
live.

```python theme={null}
RULES = {
    "question": "highlight",
    "hype": "show",
    "conversation": "show",
    "backseat": "hide",
    "spam": "hide",
}
TOXIC_AT = 0.7  # hide at or above this chance of toxic
SPOILER_AT = 0.7  # blur at or above this chance of a spoiler


def decide(result: dict, rules: dict = RULES) -> str:
    if result["toxic"] >= TOXIC_AT:
        return "hide (toxic)"
    action = rules[result["category"]]
    if action == "hide":
        return f"hide ({result['category']})"
    if result["spoiler"] >= SPOILER_AT:
        return "blur (spoiler)"
    return action
```

## Filter the whole chat

The three messages above get cached, leaving 26 new requests on a first live run.
No message depends on another, so the requests run in parallel, and `pool.map` returns
the answers in chat order.

The chat prints below as the viewer sees it. A hidden message shows only the reason it was
hidden, a blurred one shows only its author, and highlighted questions are marked with
`>>`. The label on the right of each line is the `category` answer.

```python theme={null}
with ThreadPoolExecutor(max_workers=8) as pool:  # 29 requests, one per message, 8 at once
    results = list(pool.map(lambda message: classify(*message), CHAT))

counts: dict[str, int] = {}
for (user, text), result in zip(CHAT, results):
    action = decide(result)
    counts[action] = counts.get(action, 0) + 1
    if action.startswith("hide"):
        line = f"   · hidden, {action[6:-1]}"
    elif action == "blur (spoiler)":
        line = f"   {user}: ░░░░░░░░ spoiler"
    else:
        mark = {"highlight": ">>", "dim": "..", "show": "  "}[action]
        line = f"{mark} {user}: {text}"
    print(f"{line[:78]:<80}{result['category']}")

print()
for action, n in sorted(counts.items(), key=lambda kv: -kv[1]):
    print(f"{action:<20}{n:>3}")
```

```text expandable theme={null}
   night-owl-22: hi chat, first time catching a stream live                     conversation
   ggwp-andy: PogChamp PogChamp PogChamp                                        hype
>> mira-plays: how many hours have you played so far?                           question
   tarnished-tom: this area looks so good at night                              conversation
   · hidden, backseat                                                           backseat
   · hidden, spam                                                               spam
   lore-hound: ░░░░░░░░ spoiler                                                 conversation
   kappa-kev: LUL LUL LUL                                                       hype
>> sunny-skies: are you going to do a no-hit run after this?                    question
   · hidden, toxic                                                              conversation
   cozy-cat: the music in this area is so good                                  conversation
   · hidden, backseat                                                           backseat
   mira-plays: W streamer                                                       hype
   ggwp-andy: GG that was insane                                                hype
>> quiet-quinn: anyone else watching from Brazil?                               question
>> tarnished-tom: what build are you going for?                                 question
   lore-hound: ░░░░░░░░ spoiler                                                 conversation
   kappa-kev: chat is wild today lol                                            conversation
   · hidden, backseat                                                           backseat
   · hidden, toxic                                                              conversation
   cozy-cat: you're so bad at this boss lmao, love you tho                      conversation
>> sunny-skies: who is the final boss?                                          question
   ggwp-andy: LETS GOOOO                                                        hype
   night-owl-22: i just got this game too, it's so hard                         conversation
   · hidden, spam                                                               spam
   quiet-quinn: dodge rolling through that was clean                            hype
>> mira-plays: is the DLC worth it?                                             question
   cozy-cat: your character looks so cool                                       conversation
   night-owl-22: this boss took me 40 tries lol                                 conversation

show                 14
highlight             6
hide (backseat)       3
hide (spam)           2
blur (spoiler)        2
hide (toxic)          2
```

To run the filter on your own chat, replace `STREAM` and `CHAT`. For several channels, pass
each channel's `stream` to `classify()`.

If you hit a rate limit, lower `max_workers` and run again; completed answers are already
cached. In a live integration, store the platform's message ID, or a reference to the
message's page element, with each request. Use it to update the right message when its
answers arrive.

## Change a rule without a new request

Because the answers only describe the message, we can change the rules and reuse the 29
results from the step above. Here we hide hype (cheering and emote-only lines) and dim
conversation.

```python theme={null}
QUIET = RULES | {"hype": "hide", "conversation": "dim"}

changed = 0
for (user, text), result in zip(CHAT, results):
    before, after = decide(result), decide(result, QUIET)
    if before != after:
        changed += 1
        print(f"{user + ': ' + text:<62.62}  {before:<10} -> {after}")
print(f"\n{changed} messages changed, 0 new requests")
```

```
night-owl-22: hi chat, first time catching a stream live        show       -> dim
ggwp-andy: PogChamp PogChamp PogChamp                           show       -> hide (hype)
tarnished-tom: this area looks so good at night                 show       -> dim
kappa-kev: LUL LUL LUL                                          show       -> hide (hype)
cozy-cat: the music in this area is so good                     show       -> dim
mira-plays: W streamer                                          show       -> hide (hype)
ggwp-andy: GG that was insane                                   show       -> hide (hype)
kappa-kev: chat is wild today lol                               show       -> dim
cozy-cat: you're so bad at this boss lmao, love you tho         show       -> dim
ggwp-andy: LETS GOOOO                                           show       -> hide (hype)
night-owl-22: i just got this game too, it's so hard            show       -> dim
quiet-quinn: dodge rolling through that was clean               show       -> hide (hype)
cozy-cat: your character looks so cool                          show       -> dim
night-owl-22: this boss took me 40 tries lol                    show       -> dim

14 messages changed, 0 new requests
```

## Before you use it on a live channel

* **Each message waits for its answer.** Requests in this cookbook took a median of about
  0.1 seconds, so a new line appears in chat before its answer comes back. Either hide
  each new line until its answer arrives, or accept that a toxic message is on screen
  for that long.
* **One request at a time can't keep up with a busy chat.** Run several requests at once,
  as in *Filter the whole chat*.
* **At the time this cookbook was published, Jev was trained mainly on English.** It
  accepted other languages but answered them less accurately, so expect more misses on a
  non-English channel.
* **A winning category can still be uncertain.** Here we always apply the winning label's
  rule. Before using it live, choose how to handle messages whose top two category
  probabilities are close to each other, and Noul values near 0.5. You could flag those
  messages for review or leave them visible rather than hide them automatically. Test that
  policy on your own channel's chat.
* **The spoiler check has no record of the streamer's progress.** It uses the game title
  and the model's knowledge of the game to flag likely plot revelations. It cannot tell
  whether this viewer or the streamer already knows them. To filter only unseen plot
  points, supply the current progress and relevant plot information, then adapt the
  question to use that context.

## Open it in the playground

The link below opens the playground with the state for the backseat message and the three
questions filled in. Run the call live there, or edit the questions and run it again.

```python theme={null}
playground_link = make_playground_link(
    {"stream": STREAM, "message": {"user": CHAT[4][0], "text": CHAT[4][1]}},
    QUESTIONS,
    models=[TYPESAFE_MODEL],
)
# Print a usable URL in a script; render a clickable link in a notebook.
if __name__ == "__main__" and "__file__" in globals():
    print(f"Open in the TypeSafe playground:\n{playground_link}")
else:
    display(Markdown(f"🔗 [Open in the TypeSafe playground]({playground_link})"))
```

[Open in the TypeSafe playground →](https://console.typesafe.ai/playground#share/N4IgJg9gxgrgtgUwHYBcAqCAeKQC4AEIwAOiAM4oBOCAhnKQSSCgJYoA2CD+pAou2GT4ASiyQBzfADMWlCvgAO7GgE8UAC0oQY49QEJ8AOQj4yCiC05zFnGmS4gANDxDi6DgnwFDRE0gF9nUkQyMhpxD3wmGHtKblIAIxooAGt7GhQAWgSEShRSIOYsfLwXcRNOKRRnDVyEAHIyfBpTNgR8CCl8cUpk9pz1MTB8WpHqB39-J0IFLTgFFDIMbFKiUigMhHLKFW4mFBUFSPX1CygHQrEKShgoVggkMniQAHVBqHV8DZQtiB38HLyQRkKCUFiAkbqdpwGhiRQwSjmewdLoAAxCYQiADofthUQB+AouUFtME0PakACOMAQFBYD2eAEFusgYGJ2tRqbSUNI-vgxFI-jD7khpHNIe1rrREJQOrKPhlnEgIDy3IglKp+Y8qLcRU0FJo7AhhnZmvguXSHnKzbMIHAVfSkDR2Io2B8iaR1IdjiAAMJQ3JicTOajJPXOPnUI6bYYIe0-JoACgAChBxP66ApnAAZACq2ecAHFC84Xs5OItuhBqwBKADc+CjCFYIua7Ae7UgtPwyp5MJS7Q+CEDElMCjoHpAUAeADdcmERc8APKUMBiGj-BUoH6UCMKMSOsghhBKFi05wxBBSGAusjqDfG-DsMRpCOymhIFT4DHhdoAd1OZEYThBQESRTsIG7XtpDYCUOlqeVNm2M8nmmRJkjSWgSk8EBcyQTkaQoR81RPZQvxoMAZxYc4RgQdhn1HUYpXcWUAIyEYTEgZwxCgdgYDXUcrh1O5D0UQ17BNJoWgtEUG2gloCO5XlZQFIUMkdSczAnUpSDwsgIGfKA2hNSjclYMgg2cex2CkTJbXjR1nEFeiID-XJTDohjg2teyHQeZ0nxfMg5JVOUBI3L8hxHbymxjfA4xVc9rRaS9rxdBiUgCQIXBQCBMGoilmG9Z5lRvSchJuESHlQnCAEkmg0Fgmh-CItTIG9WAkZx7x+NLrXvXpQiDDi-w3MAmn0xAO0JNCpzBHcWHJUp9huH1aseDqj1MPi5BqTQsKaPkjjkfyXQyFAMMO0UmKoaV3L5D8VShWUqIQNy4lmqRnXsZ4ADEwWQMB2BUJUEBgKhnTfQLdB5JJUHcv82E+ZURg3CISkmQozAsKxCoOI4Su0dhyu1Sq9WeAARSCGsGZraUxDkEDnAKWiUULzDEHk+UB4bOjgkiAQQYaNRUY0ZsmaYQBofcADV50dVYZwARkl6yEDuY0AFkIEEdgyFKABtEAACsmcyJWsSVgAWLEAAYQAAXX8IA)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.