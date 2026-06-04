# One Year of Us 🤍

A little anniversary website for Elisha — one whole year of us, told through our photos.

## View it locally

It's a plain static site (no build step). Either:

- **Just open it:** double-click `index.html`, or
- **Run a tiny server** (nicer, avoids any browser file restrictions):
  ```bash
  python3 -m http.server 8000
  ```
  then visit <http://localhost:8000>.

## Put it online (so she can open it on her phone)

Any static host works. Two easy options:

### GitHub Pages
1. Push this repo to GitHub.
2. Repo **Settings → Pages → Build and deployment**.
3. Source: **Deploy from a branch**, branch: your branch, folder: **/(root)**.
4. Give it a minute — your link appears at the top of that page.

(The included `.nojekyll` file tells Pages to serve everything as-is.)

### Netlify / Vercel (drag-and-drop)
Drag this whole folder onto <https://app.netlify.com/drop> — instant link.

## Make it yours

Everything is editable plain text:

- **Words:** all the captions and the letter live in `index.html`. Swap in anything you'd rather say in your own voice — search for the section you want (e.g. "What I actually want to say").
- **The date:** in `index.html`, the hero shows `2025 — 2026`. Change it to your real one.
- **Photos:** they're in `images/` (`image1.jpg` … `image31.jpg`). Replace any file with one of the same name, or add more and reference them in `index.html`.
- **Colors & fonts:** the palette is at the top of `css/styles.css` under `:root`.

## What's inside

```
index.html      → the page + all the words
css/styles.css  → the look (colors, layout, animations)
js/script.js    → intro, scroll reveals, floating hearts
images/         → our photos
```

Made with love. Happy one year. 🤍
