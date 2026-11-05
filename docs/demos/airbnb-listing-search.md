# Airbnb listing search in Google Sheets

> Describe a stay in plain English and get the 10 best of 1,000 Cape Town Airbnb listings, scored out of 10, in about a second, from a formula in Google Sheets.

## The problem

Finding the right place to stay means reading listings. Filters cover price, bedrooms, and guests, but not "allows dogs", "walk to the beach", or "has backup power for load-shedding". Those details sit in the description, written differently by every host, so the only way to check them is to read each one. With 1,000 listings in a spreadsheet, that's an afternoon of scrolling.

## Why Jev fits

Whether a listing matches a request is a quick reading judgment. Jev makes it in a fraction of a second and returns a probability or a score rather than free text, so a spreadsheet formula can sort on it.

## One request per listing is too slow

The obvious approach is one request per listing, with a Score question: "How well does this listing match the request?" Each request is fast, but 1,000 of them one after another take more than 30 seconds, and Google Sheets stops a custom formula at 30 seconds.

## Shortlist, then score

One request can hold many listings. A Choice question can have 100 listing IDs as its options, and its answer gives a probability for each, so a whole group is ranked at once. We split the search into two steps:

| Step | Requests | Question | What happens with the answer |
| - | - | - | - |
| Shortlist | 10, in parallel | Which listing best matches the request? A Choice question over 100 listing IDs, each with the start of its description. | The 5 listings with the highest probability in each group go through, 50 in all. |
| Score | 1 | How well does this listing match the request? One Score question per shortlisted listing, with the full description. | Each score becomes a mark out of 10, and the 10 best are returned. |

The Score question has five levels, from "Not a match at all" to "Matches everything asked for", so each mark says how much of the request a listing covers. For "6 people and a dog on the beach", the top result scores 8.8: its description says it sleeps 10, is minutes from the beach, and is pet-friendly.

## 1,000 requests become 11

The two steps take 11 requests instead of 1,000, and the search finishes in about a second instead of running past the 30-second limit.

## Any request, same sheet

The formula is `=JEV_TOP10(B1, Listings!A2:H1001)`, so a new request in `B1` is a new search. The sheet caches each request's results, so editing other cells doesn't run the search again.

## Build it

> [card] [Copy the Google Sheet](https://docs.google.com/spreadsheets/d/1E1UOTwk2QIA9ZxIieXPvvQaGPOCZn7991bT49S07bRA/copy)
>
> The 1,000 listings and the `JEV_TOP10` formula. Add your TypeSafe API key under Extensions > Apps Script > Project Settings > Script properties, as `TYPESAFE_API_KEY`.

> [card] [Get an API key](https://console.typesafe.ai/keys)
>
> Create a key in the TypeSafe console.

> [accordion] The Apps Script behind JEV_TOP10
>
> ```javascript Code.gs
> /**
>  * JEV_TOP10: find the 10 listings that best match a plain-language request, using TypeSafe Jev.
>  *
>  * Setup: Extensions > Apps Script, paste this file, save. Then Project Settings >
>  * Script properties: add TYPESAFE_API_KEY with your TypeSafe key. No permission prompt.
>  *
>  * Usage: =JEV_TOP10(B1, Listings!A2:H1001)
>  *   The listing columns must be: Name, Type, Price per night (R), Bedrooms, Guests, Rating,
>  *   Description, Link.
>  *
>  * How it works, in 11 requests instead of one per listing:
>  *   1. Shortlist: the listings are split into groups of 100. One request per group, all in
>  *      parallel, asks a Choice question over the group's listing IDs. Jev returns a
>  *      probability for every listing, and the 5 most likely go through.
>  *   2. Score: one request holds the shortlisted listings in full, with one Score question
>  *      per listing. The 10 best scores are returned, from 0 to 10.
>  * Results are cached for six hours per request.
>  */
>
> const GROUP_SIZE = 100;
> const SHORTLIST_PER_GROUP = 5;
> const TOP = 10;
> const SHORT_DESCRIPTION = 300;
> const FULL_DESCRIPTION = 1500;
> const LEVELS = [
>   'Not a match at all',
>   'Matches little of what was asked for',
>   'Matches some of what was asked for',
>   'Matches most of what was asked for',
>   'Matches everything asked for',
> ];
>
> /**
>  * Returns the 10 listings that best match a request, with a 0-10 match score.
>  *
>  * @param {string} request What you're looking for, in plain language.
>  * @param {Listings!A2:H1001} listings Name, Type, Price, Bedrooms, Guests, Rating, Description, Link.
>  * @return Match, Name, Type, Price, Bedrooms, Guests, Rating, Link for the top 10.
>  * @customfunction
>  */
> function JEV_TOP10(request, listings) {
>   const key = PropertiesService.getScriptProperties().getProperty('TYPESAFE_API_KEY');
>   if (!key) throw new Error('Add TYPESAFE_API_KEY under Project Settings > Script properties.');
>   request = String(request || '').trim();
>   if (!request) return [['Type what you are looking for in B1.']];
>
>   const rows = listings.filter((r) => r[0] !== '');
>   const cache = CacheService.getScriptCache();
>   const cacheKey = digest(`${request}\n${rows.length}\n${rows.map((r) => r[7]).join('|')}`);
>   const hit = cache.get(cacheKey);
>   if (hit) return JSON.parse(hit);
>
>   // Stage 1: one Choice over each group of 100 listing IDs, all groups in parallel.
>   const groups = [];
>   for (let start = 0; start < rows.length; start += GROUP_SIZE) {
>     groups.push(rows.slice(start, start + GROUP_SIZE).map((_, j) => start + j));
>   }
>   const shortlistResponses = UrlFetchApp.fetchAll(groups.map((ids) => jevRequest(key, {
>     state: ids.map((i) => line(i, rows[i], SHORT_DESCRIPTION)).join('\n'),
>     questions: {
>       best: {
>         type: 'choice',
>         instructions: `Which listing best matches what the guest is looking for: ${request}`,
>         criteria: Object.fromEntries(ids.map((i) => [`L${i}`, null])),
>       },
>     },
>   })));
>   const shortlist = shortlistResponses.flatMap((res) => {
>     const p = parse(res).answers.best.probabilities;
>     return Object.keys(p).sort((a, b) => p[b] - p[a]).slice(0, SHORTLIST_PER_GROUP).map((id) => Number(id.slice(1)));
>   });
>
>   // Stage 2: score every shortlisted listing in one request.
>   const scored = parse(UrlFetchApp.fetchAll([jevRequest(key, {
>     state: shortlist.map((i) => line(i, rows[i], FULL_DESCRIPTION)).join('\n\n'),
>     questions: Object.fromEntries(shortlist.map((i) => [`L${i}`, {
>       type: 'score',
>       instructions: `How well does listing [L${i}] match what the guest is looking for: ${request}`,
>       criteria: LEVELS,
>     }])),
>   })])[0]).answers;
>
>   const top = shortlist
>     .map((i) => ({i, score: Math.round((scored[`L${i}`].score / (LEVELS.length - 1)) * 100) / 10}))
>     .sort((a, b) => b.score - a.score)
>     .slice(0, TOP)
>     .map(({i, score}) => {
>       const [name, type, price, beds, guests, rating, , link] = rows[i];
>       return [score, name, type, price, beds, guests, rating, link];
>     });
>   cache.put(cacheKey, JSON.stringify(top), 6 * 60 * 60);
>   return top;
> }
>
> function line(i, r, descriptionChars) {
>   const [name, type, price, beds, guests, , description] = r;
>   return `[L${i}] ${name} | ${type} | R${price}/night | ${beds || '?'} bedrooms | sleeps ${guests} | ${String(description).slice(0, descriptionChars)}`;
> }
>
> function jevRequest(key, body) {
>   return {
>     url: 'https://api.typesafe.ai/v1/systemone',
>     method: 'post',
>     contentType: 'application/json',
>     headers: {Authorization: `Bearer ${key}`},
>     muteHttpExceptions: true,
>     payload: JSON.stringify(Object.assign({model: 'jev-latest'}, body)),
>   };
> }
>
> function parse(res) {
>   if (res.getResponseCode() !== 200) {
>     throw new Error(`Jev returned HTTP ${res.getResponseCode()}: ${res.getContentText().slice(0, 200)}`);
>   }
>   return JSON.parse(res.getContentText());
> }
>
> function digest(text) {
>   return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text));
> }
> ```

The listings come from [Inside Airbnb](https://insideairbnb.com/get-the-data/)'s 23 September 2026 scrape of Cape Town, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). We took a random sample of 1,000 listings with a price and a description of at least 200 characters, removed HTML line breaks and repeated whitespace, and flattened the amenities to a comma-separated list.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
