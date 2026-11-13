> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Content audits with Jev

> Audit all of the Django documentation in under 5 seconds for $0.10. Get an overview of what kind of content you have, what needs fixing, and where to spend effort.

## The problem

Most companies and projects gain content over time until no one person can understand all of it, or know where to spend effort improving it. The [Django documentation](https://docs.djangoproject.com/en/dev/) has 279 pages and 584,234 words, not counting release notes. Reading them once takes a person about 39 hours. There are different kinds of content and different kinds of errors, and some pages are much more important than others. But which?

## Why Jev fits

Jev turns large amounts of text into numbers. Instead of writing hundreds of manual rules, you can ask questions in natural language: Is this page out of date? Is it a tutorial or a reference page? Is it for beginners or experts? Jev answers dozens of these about a page in one request and returns a probability or a score for each, so you can sort, filter, and plot the results.

## One request per page

Each request holds one page and 45 questions:

| Questions | Type | What they measure |
| - | - | - |
| 8 | Score | Quality: overall, accuracy, freshness, clarity, completeness, structure, examples, spelling and grammar. |
| 5 | Score, Choice, Noul | Importance: how much the page matters, expected traffic, whether newcomers or AI assistants read it. |
| 7 | Choice | Classification: [Divio](https://docs.divio.com/documentation-system/) type, level, complexity, length, fix effort, who can fix it, and the best single fix. |
| 21 | Noul | Problems: out of date, incorrect facts, deprecated APIs, typos, broken markup, insecure examples, missing examples, and more. |
| 4 | Noul | Quick wins: would one small edit help, is there content to delete, does it need cross-links. |

Jev answers every question in a request in parallel, so more questions add little time: on one test page, the median request took 144 ms with 1 question and 151 ms with all 45. Questions do add cost, because their text counts as input tokens: here, the 45 questions are about 40% of the \$0.10. This audit asks every question that might be useful, including ones that flag only a handful of pages. There is no limit on the number of questions, only on [context length](https://docs.typesafe.ai/models.md#context-length).

## Visualizing the results

You can build any dashboard or visualization from Jev's answers. Here, we plotted each page on an importance and quality grid, so it's easy to see the pages that most deserve human attention: the low-quality, high-importance quadrant in the top left, labeled "Fix first". The dashboard also lists quick wins: important pages that Jev rates trivial or small to fix. Depending on what matters to you, the grid could instead show fix effort, page complexity, or anything else.

![The audit dashboard: importance plotted against quality for all 279 Django docs pages, with the fix-first list beside it.](https://mintcdn.com/ts-docs/tSHMUPy1QMGjBb5r/images/demos/content-audit/dashboard.webp?fit=max\&auto=format\&n=tSHMUPy1QMGjBb5r\&q=85\&s=ae55a8799b263f5521ba257c73aca191)

## What the questions found

Each problem and quick-win question is a yes-or-no flag. The left side of the chart counts how many of the 279 pages each one flagged. The right side shows how the pages split on four of the classification questions.

Most Django pages are reference or explanation pages for intermediate developers, and quick to fix. The common flags are small jobs, like adding cross-links or a diagram, or explaining jargon. The serious flags fire on far fewer pages: 28 show a deprecated API, 18 may contain an incorrect fact, and 13 have out-of-date content. Those are short lists to check by hand.

## Find the exact sentence

Each page in the audit has a deep scan button. It asks Jev which sentence holds each problem, and highlights that sentence. Here, it flags a sentence on the Django admin page with two typos: "it's" should be "its", and "as" should be "are".

![A deep scan of a paragraph on the Django admin page, with the sentence 'At it's simplest list\_filter takes a list or tuple of field names to activate filtering upon, but several more advanced options as available.' underlined and tagged as a typo with a trivial fix.](https://mintcdn.com/ts-docs/tSHMUPy1QMGjBb5r/images/demos/content-audit/deep-scan.webp?fit=max\&auto=format\&n=tSHMUPy1QMGjBb5r\&q=85\&s=c37c21b23f9c4def1021acab76035ccf)

Each finding links to its line on GitHub, so you can fix the typos in a pull request.

## Build it

> [card] [Get an API key](https://console.typesafe.ai/keys)
>
> Create a key in the TypeSafe console.

> [card] [Question types](https://docs.typesafe.ai/primitives)
>
> Score, Choice and Noul, and when to use each.

This script is a cut-down version of the demo's scoring pass. It asks 7 of the 45 questions, and the `# ...` comment marks where the other 38 go. It sends 12 pages at a time and lists the 20 pages with the highest priority. Its priority is simpler than the dashboard's: (1 − overall quality) × importance, so its list can differ from the dashboard's "Fix first" list.

> [accordion] The scoring pass in Python
>
> ```python audit.py theme={null}
> """Score every page of the Django docs with Jev, 12 requests at a time.
>
> git clone --depth 1 https://github.com/django/django.git
> TYPESAFE_API_KEY=... python audit.py
> """
> import json
> import os
> from concurrent.futures import ThreadPoolExecutor
> from pathlib import Path
>
> import requests
>
> API = "https://api.typesafe.ai/v1/systemone"
> KEY = os.environ["TYPESAFE_API_KEY"]
> LEVELS = ["0: Serious problems; urgent editorial attention.", "1: Significant problems; revise soon.",
>           "2: Mixed; targeted edits needed.", "3: Mostly sound; minor edits.", "4: Excellent; leave as is."]
> # The demo's site context also lists recent Django releases and features, and explains the docs layout.
> SITE = ("docs.djangoproject.com: the official documentation for Django, the Python web framework, development "
>         "version. These docs are the source of truth for APIs newer than your knowledge: never call an API, setting, "
>         "date or version scheme incorrect or outdated just because you do not recognize it. Sphinx reStructuredText "
>         "markup (roles, directives, underlined headings) is source markup, NOT an error.")
>
>
> def score(q, levels=LEVELS):
>     return {"type": "score", "instructions": q, "criteria": levels}
>
>
> def noul(q):
>     return {"type": "noul", "instructions": q + " Answer yes only when the page content gives concrete evidence."}
>
>
> def choice(q, options):
>     return {"type": "choice", "instructions": q, "criteria": options}
>
>
> QUESTIONS = {
>     "quality": score("Overall, how high quality is this page as official framework documentation?"),
>     "importance": score(
>         "How important is this page to Django developers? The tutorial, installation, models, views, URLs, "
>         "templates, forms, the ORM, settings, deployment and security are critical; niche contrib apps, "
>         "internals and rarely used backends are minor.",
>         ["0: Negligible; niche or archival.", "1: Minor.", "2: Moderate.",
>          "3: High; many developers rely on it.", "4: Critical; core page most developers read."]),
>     "divio": choice("Which Divio documentation type does this page mainly belong to?", {
>         "tutorial": "Tutorial: a lesson that takes a beginner by the hand through building something.",
>         "how_to": "How-to guide: steps to solve a specific real-world problem for someone who already knows the basics.",
>         "reference": "Reference: dry, complete technical description of APIs, settings, commands or fields.",
>         "explanation": "Explanation: discussion that clarifies concepts, background, design decisions and alternatives."}),
>     "level": choice("What level of Django experience does this page assume?", {
>         "beginner": "New to Django; may be new to web development.",
>         "intermediate": "Has built a Django app and knows models, views, templates and forms.",
>         "advanced": "Experienced; customizes internals, writes backends, tunes performance, or contributes to Django."}),
>     "effort": choice("An editor is going to bring this page to excellent quality, fixing its mistakes and problems. "
>                      "How much work is that?", {
>         "trivial": "Minutes: a few wording, typo or link fixes.", "small": "About an hour: a handful of targeted edits.",
>         "medium": "Half a day: rework sections, refresh examples.", "large": "Days: substantial rewrite or restructuring."}),
>     "outdated": noul("Is part of this page out of date for current Django (6.x) or current Python?"),
>     "typos": noul("Does the prose contain spelling, grammar or punctuation errors? Ignore code and markup."),
>     # ... The demo asks 38 more: 7 more quality scores, 4 more importance questions,
>     # 4 more classifications, 19 more problem flags and 4 quick-win flags.
> }
>
>
> def grade(path):
>     body = {"model": "jev-latest", "questions": QUESTIONS,
>             "state": {"site": SITE, "page": str(path), "content": path.read_text()[:105_000]}}
>     r = requests.post(API, headers={"Authorization": f"Bearer {KEY}"}, json=body, timeout=120)
>     r.raise_for_status()
>     return str(path), r.json()["answers"]
>
>
> docs = Path("django/docs")
> pages = sorted(p for p in docs.rglob("*.txt")
>                if p.relative_to(docs).parts[0] != "releases" and p.name != "requirements.txt")
> with ThreadPoolExecutor(12) as pool:
>     results = dict(pool.map(grade, pages))
>
> # Priority: how much a page needs work multiplied by how much it matters. The dashboard's version also
> # weighs the other quality scores, expected traffic, incoming links and the problem flags.
> rows = []
> for path, a in results.items():
>     quality, importance = a["quality"]["score"] / 4, a["importance"]["score"] / 4
>     rows.append((100 * (1 - quality) * importance, path, a["divio"]["choice"], a["effort"]["choice"]))
> for priority, path, divio, effort in sorted(rows, reverse=True)[:20]:
>     print(f"{priority:5.1f}  {path}  {divio}  {effort} effort")
> Path("audit.json").write_text(json.dumps(results, indent=1))
> ```

The pages come from the `docs/` folder of [django/django](https://github.com/django/django) at commit `ca3f31b` (4 November 2026), under Django's [BSD license](https://github.com/django/django/blob/main/LICENSE). Release notes are left out.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.