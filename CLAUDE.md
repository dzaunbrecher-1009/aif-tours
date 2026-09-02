# Notes for Claude working in this repo

This is a small static website. Donors read it, pick which upcoming visit they
want to attend, and submit a short form. Responses go to a Google Sheet.

Two people edit this repo, usually by asking Claude. Assume the person you're
talking to is not a developer and does not want to read code.

## How the site works

- `content.json` holds **all** of the copy, dates, photos, and settings.
- `app.js` fetches that file at page load and builds the page from it.
- `styles.css` holds the design.
- There is no build step and no framework. Vercel serves the files as-is.

## The rule that matters

**Almost every request should be a change to `content.json` and nothing else.**

Adding a visit, removing one, fixing a date, rewriting a description, changing
a photo, changing the accent color, connecting the form — all of it lives in
`content.json`. Reach for `index.html`, `app.js`, or `styles.css` only when the
person is asking for something the content file genuinely can't express, like a
new field on every card or a change to the layout.

## Before you commit

`content.json` breaks the whole page if it isn't valid JSON — a stray comma is
enough. Always validate after editing:

```bash
node -e "JSON.parse(require('fs').readFileSync('content.json','utf8'))" && echo OK
```

Then commit and push to `main`. Vercel deploys automatically; it takes about
thirty seconds.

```bash
git add -A && git commit -m "Update tour dates" && git push
```

## Field reference for content.json

`site`
| field | what it does |
|---|---|
| `organization` | Used in the browser tab title |
| `eyebrow` | Small uppercase line above the headline |
| `headline` | The big headline |
| `intro` | Paragraph under the headline |
| `closingNote` | Line in the footer |
| `contactEmail` | Footer mailto link, and the fallback if the form is unconnected |
| `accentColor` | Hex color used for buttons, links, selected cards |
| `heroImage` | Optional. A URL or `images/filename.jpg`. Adds a full-bleed photo behind the headline with a dark overlay |

`form`
| field | what it does |
|---|---|
| `endpoint` | Google Apps Script Web App URL. See `apps-script/SETUP.md`. While empty, the form tells visitors it isn't open yet instead of erroring |
| `askForGuestCount` | `true` / `false` |
| `askForNotes` | `true` / `false` |
| `notesLabel` | Label above the notes box |
| `successHeadline`, `successBody` | Shown after a successful submit |

`tours` — an array. Add or remove entries freely; the grid reflows.
| field | what it does |
|---|---|
| `id` | Short unique slug. Gets written to the spreadsheet, so **don't change it once responses exist** |
| `title` | Card heading |
| `date` | Free text. Shows as a chip on the photo |
| `time`, `location`, `capacity` | Small grey line under the title. Any of these can be `""` to hide |
| `image` | `images/filename.jpg` or a full URL. Empty shows a placeholder |
| `imageAlt` | Alt text. Please fill this in |
| `summary` | One or two sentences |
| `highlights` | Array of short bullet strings. Use `[]` for none |
| `hostedBy` | Name and title, or `""` |

## Photos

Drop image files into `images/` and reference them as `images/whatever.jpg`.
Resize to roughly 1200px wide before committing — donors often open this on a
phone and full-size camera files make the page slow.

## Things to avoid

- Don't add a build step, a framework, or npm dependencies. The simplicity is
  the point; it's what lets two non-developers keep this alive.
- Don't put secrets in this repo. The Apps Script URL is fine — it can only
  append rows — but nothing else.
- Don't rename `content.json` or move it out of the repo root.
