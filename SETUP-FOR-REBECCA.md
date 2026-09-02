# Start here, Rebecca

One-time setup, about fifteen minutes. After this, changing the website is a
conversation with Claude.

---

## What you're setting up

The website lives on Vercel. Its files live in a GitHub repository. You'll keep
a copy of those files in a folder on your laptop. When you ask Claude to change
something, it edits your local copy and pushes it to GitHub, and Vercel puts the
new version live about thirty seconds later.

You don't need to understand git. You need it installed and signed in, and then
Claude handles it.

---

## 1. Get a GitHub account

If you don't have one, sign up at [github.com](https://github.com). Send Davis
your username so he can add you to the repository. You need write access, not
just read.

## 2. Install GitHub Desktop

Download it from [desktop.github.com](https://desktop.github.com) and install it.

Open it, choose **Sign in to GitHub.com**, and sign in with the account from
step 1.

## 3. Clone the repository

In GitHub Desktop: **File → Clone repository**. Pick the donor visits repo from
the list. Note the folder it saves to; the default is something like
`Documents/GitHub/aif-tours`. Click **Clone**.

You now have the website's files on your laptop.

## 4. Point Claude at the folder

Open the Claude desktop app. Add the folder you just cloned (the **Add folder**
button). Claude can now read and edit those files.

That's the setup done.

---

## Making a change

Ask for what you want, in plain words. Some real examples:

> Add a seventh visit: the east campus walking tour, November 5th, 2 to 4pm,
> 15 people, hosted by Maria Chen. Describe it as a chance to see the new
> greenhouse and meet the field team.

> Move the October 8th tour to October 15th.

> Rewrite the intro paragraph to be a bit warmer and shorter.

> I put four photos in the images folder. Match them to the right tours.

> Make the green a little darker.

Claude will edit the file, check that nothing's broken, and push the change.
Give it thirty seconds, then reload the live site.

## Adding photos

Put the image files in the `images` folder inside your cloned folder, then tell
Claude which tour each one belongs to. Resize them to around 1200 pixels wide
first if they're straight off a camera. If you're not sure how, ask Claude to
resize them for you after you've dropped them in.

## Seeing a change before it goes live

Ask Claude to preview it. It'll show you the page before anything is pushed.

---

## If something looks wrong

**The page is blank or shows an error box.** Something in `content.json` has a
typo. Ask Claude: "the site is showing an error, can you check content.json."
It's almost always a missing comma and it's a thirty-second fix.

**Your change isn't showing up.** Give it a full minute, then hard-refresh
(Cmd-Shift-R on a Mac, Ctrl-Shift-R on Windows). If it's still missing, ask
Claude whether the change was actually pushed.

**GitHub Desktop shows a conflict.** That means you and Davis edited the same
thing at the same time. Don't try to sort it out in GitHub Desktop. Ask Claude
to resolve the conflict, or message Davis.

---

## The one thing not to do

Don't rename or move `content.json`. Everything on the page is built from it.
