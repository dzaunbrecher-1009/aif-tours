# Connecting the form to a Google Sheet

This takes about five minutes and only has to be done once. After this, every
response lands as a new row in a spreadsheet you and Davis can both watch.

## 1. Make the spreadsheet

Go to [sheets.new](https://sheets.new) and name it something like
**Fall Donor Visits — Responses**.

## 2. Open the script editor

In that spreadsheet: **Extensions → Apps Script**.

A code editor opens in a new tab with a file called `Code.gs` containing a
stub function. Delete everything in it.

## 3. Paste the script

Open `Code.gs` from this folder, copy the whole thing, paste it in, and click
the save icon.

## 4. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** `RSVP receiver`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` ← this matters. It does not make your
     spreadsheet public; it only lets the website hand data to this script.
4. Click **Deploy**.
5. Google will ask you to authorize. Click through **Review permissions →**
   pick your account → **Advanced → Go to (project name) → Allow**. The
   "unverified app" warning is expected; it's your own script.
6. Copy the **Web app URL**. It looks like:

   ```
   https://script.google.com/macros/s/AKfycb..................../exec
   ```

## 5. Put the URL in the site

Open `content.json` and paste it into the `endpoint` field:

```json
"form": {
  "endpoint": "https://script.google.com/macros/s/AKfycb..../exec",
```

Commit and push. Vercel redeploys in about thirty seconds and the form is live.

## Testing it

Open the site, fill in the form with your own name, and submit. A row should
show up in the **Responses** tab of the spreadsheet within a second or two.

## If you change the script later

Apps Script keeps serving the *deployed* version, not the version you're
looking at in the editor. After editing, go to **Deploy → Manage deployments →**
pencil icon → **Version: New version → Deploy**. The URL stays the same.
