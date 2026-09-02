# Fall Donor Visits

A one-page site where donors look at the upcoming visits and tell us which one
they'd like to attend. Responses land in a Google Sheet.

Live at: _(add your Vercel URL here once it's deployed)_

Responses spreadsheet: _(add the link here)_

**New here?** Read [`SETUP-FOR-REBECCA.md`](SETUP-FOR-REBECCA.md) first. It's a
fifteen-minute one-time setup, then everything below applies.

---

## Editing it

You don't need to know how to code. Open this folder in Claude and ask for what
you want in plain English:

> Change the October 8th tour to October 15th and update the description to
> mention the new building.

> Add a seventh option: a walking tour of the east campus on November 5th,
> 2–4pm, 15 people, hosted by Maria Chen.

> The photo for the first tour should be the one I just added,
> `images/greenhouse.jpg`.

> Make the accent color a warmer orange.

Claude edits `content.json`, checks that it's still valid, and pushes. Vercel
picks up the change and the live site updates in about thirty seconds.

## Adding photos

Put image files in the `images/` folder, then tell Claude which tour each one
belongs to. Aim for about 1200 pixels wide — anything bigger just makes the
page slow to load on phones.

## Collecting responses

The form only works once it's pointed at a Google Sheet. That's a one-time
setup, written out step by step in [`apps-script/SETUP.md`](apps-script/SETUP.md).
Until it's connected, the site still looks and works fine — the form just tells
visitors it isn't open yet rather than losing their answer silently.

## Seeing it before it's live

Ask Claude to preview it, or from a terminal in this folder:

```
npx serve .
```

Then open the address it prints.

---

## For reference

| File | What it is |
|---|---|
| `content.json` | **All the text, dates, and photos.** This is the file you change |
| `index.html` | Page structure |
| `app.js` | Builds the page from `content.json` |
| `styles.css` | Design |
| `images/` | Photos |
| `apps-script/` | The Google Sheet connection |
| `CLAUDE.md` | Instructions Claude reads automatically when working here |
