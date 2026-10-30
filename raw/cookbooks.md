> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Cookbooks

> End-to-end recipes that show TypeSafe in real problems, from a few questions to full pipelines.

Each cookbook is a worked example: a real dataset, the TypeSafe questions that decide something about it, and the code that turns those decisions into a working system. Read one when you want to see how the [primitives](https://docs.typesafe.ai/primitives) and [patterns](https://docs.typesafe.ai/patterns.md) come together on a concrete problem, or copy one as the starting point for your own.

This section assumes you know the [TypeSafe primitives](https://docs.typesafe.ai/primitives) and understand [how confidence works](https://docs.typesafe.ai/confidence.md). If not, read those first.

Each cookbook is listed once, under the problem it solves. Many also use techniques from other sections.

## LLMs and agents

Use Jev alongside an LLM or agent: pick tools and skills, screen what goes in and out, and check what comes back.

| Cookbook | What it does | Level |
| - | - | - |
| [Function calling](https://docs.typesafe.ai/cookbooks/function_calling.md) | Turns natural-language trading requests into calls to ordinary typed functions by mapping function names and closed-set arguments to confidence-aware TypeSafe questions. | Intermediate |
| [Skill suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion.md) | Picks at most one skill for an agent turn out of the 182 in Nous Research's Hermes catalog, using two TypeSafe requests to rank and re-check the top candidates. | Intermediate |
| [Guardrails for LLMs](https://docs.typesafe.ai/cookbooks/llm_guardrails.md) | Screen every message going into and out of an LLM app with one TypeSafe request, thresholding hazard probabilities and severity to pass, review, block, or route. | Intermediate |
| [Double-checking citations](https://docs.typesafe.ai/cookbooks/citation_check.md) | Catch wrong or hallucinated citations by checking against the source document. One Choice question decides whether the quote's context supports the claim. | Beginner |
| [Classifying RAG passages](https://docs.typesafe.ai/cookbooks/classifying_rag_passages.md) | Score each retrieved passage with one TypeSafe request, then decide in code which ones reach the answering model. | Intermediate |
| [Simple memory system](https://docs.typesafe.ai/cookbooks/basic_memory.md) | Let Jev decide which requests and answers are worth remembering, then wrap the Jev call in a small function that adds memories to later calls. | Beginner |

## Classification

Assign inputs to categories at any depth.

| Cookbook | What it does | Level |
| - | - | - |
| [Hierarchical classification](https://docs.typesafe.ai/cookbooks/hierarchical_classification.md) | Classifies documents through deep patent, retail product, biomedical, and source-code hierarchies using parallel beam search over TypeSafe Choice probabilities. | Intermediate |
| [Classification using confidence](https://docs.typesafe.ai/cookbooks/classification_using_confidence.md) | Classify SEC annual reports into 75 industry groups with one Choice each, then read the answer's own confidence to decide whether to report that group or the broader division above it. | Beginner |
| [Twitch chat filter](https://docs.typesafe.ai/cookbooks/twitch_chat_filter.md) | Hides insults, spam, and unasked-for gameplay tips in Twitch chat, blurs spoilers, and highlights questions. Each message gets one TypeSafe request with three questions, requests run concurrently, and plain rules in code turn the answers into what the viewer sees. | Beginner |

## Extraction

Pull typed values and structure out of messy text.

| Cookbook | What it does | Level |
| - | - | - |
| [SDE cascade](https://docs.typesafe.ai/cookbooks/sde_cascade.md) | Uses a 2-stage structured-data-extraction cascade (mini → verify → reasoning) to get most of the quality of a big reasoning model at a fraction of the cost. | Intermediate |
| [Date extraction](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook.md) | Extracts absolute and relative dates by asking TypeSafe for the parts named in a document, then resolving and validating them in code with confidence-based review. | Beginner |
| [Pre-parsed value extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook.md) | Finds candidate emails, phone numbers, and amounts with a regex, has TypeSafe pick the one you ask for, and normalizes that exact span in code. | Beginner |
| [Structure recovery](https://docs.typesafe.ai/cookbooks/autoformat.md) | Reconstructs Markdown from plain text that lost its formatting in two requests: one stitches hard-wrapped lines back together, one classifies every block (heading, list, code, callout). | Beginner |

## Search and matching

Find the lines, passages, or records that match a query or each other.

| Cookbook | What it does | Level |
| - | - | - |
| [Re-ranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe.md) | Builds 30-passage BM25 shortlists for 40 CLERC legal queries, then uses one TypeSafe question per query-candidate pair to raise top-1 accuracy from 5% to 18% and top-10 accuracy from 38% to 62%. | Beginner |
| [Line-by-line search](https://docs.typesafe.ai/cookbooks/semantic_find.md) | Build semantic search for GitHub's Terms of Service. In one request, score 218 line ids against a plain-language query with a Choice question, and use a Noul question to check whether the document contains an answer. | Beginner |
| [Knowledge graph entity alignment](https://docs.typesafe.ai/cookbooks/entity_alignment.md) | Decides which of 450 candidate pairs from two beer catalogues describe the same product using one Score question plus three companion Nouls that surface which fields disagree. | Beginner |
| [Intelliprompter](https://docs.typesafe.ai/cookbooks/intelliprompter.md) | Tick off a presenter's notes as they speak: TypeSafe scores the live transcript against each note not yet covered, and a note stays ticked once its score passes the threshold. | Beginner |

## Techniques

Get more out of any question: repeat it, batch it, or turn its answers into features.

| Cookbook | What it does | Level |
| - | - | - |
| [Self-consistency: choices](https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook.md) | Add an uncertain outcome to moderation decisions and compare label agreement with the share of automatic actions. | Beginner |
| [Self-consistency: nouls](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook.md) | Route uncertain probabilities to human review while keeping the underlying noul values visible. | Beginner |
| [Parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions.md) | Runs a 13-question regulatory briefing over the GDPR Wikipedia article, showing that batching every question into one TypeSafe call is 12.2x cheaper and 10.0x faster with no change in answers. | Beginner |
| [Autoresearch feature discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery.md) | Runs an autoresearch loop that proposes TypeSafe questions, converts free text into numeric features, and uses model errors to improve a supervised CatBoost regressor. | Advanced |

## Image processing

Find things in photos and scans, and check what was read from them.

| Cookbook | What it does | Level |
| - | - | - |
| [Reading a scanned vaccination record](https://docs.typesafe.ai/cookbooks/reading_scanned_documents.md) | Find each vaccine on a scanned travel record with a Noul and a Box, read the year of each dose with a Choice that can answer unreadable, and check each dose still covers the trip in a text-only request. | Intermediate |
| [OCR confidence and bounding boxes](https://docs.typesafe.ai/cookbooks/ocr_confidence_bounding_boxes.md) | Check the values an OCR extractor read from invoice photos: Jev boxes each value, scores it against the page and against a crop of its box, and flags low scores for review. | Intermediate |
| [Feeder-cam visit log](https://docs.typesafe.ai/cookbooks/feeder_watch.md) | Send frames from bird feeder camera footage to Jev with five questions, one of them a Box that finds the bird, then use plain code to turn the answers into a visit log per species. | Intermediate |

> [!TIP]
>
> We're always keen to learn how people are making use of our primitives. If you've built something worth a cookbook, drop us a note!


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.