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
- **The date:** two spots — the hero text `2025 — 2026` in `index.html`, and the **live counter's** start date in `js/script.js` (`var ANNIVERSARY = new Date(2025, 5, 8)` → note months are 0-based, so `5` = June). Set it to your real first day.
- **Photos:** they're in `images/` (`image1.jpg` … `image31.jpg`). Replace any file with one of the same name, or add more and reference them in `index.html`.
- **Colors & fonts:** the palette is at the top of `css/styles.css` under `:root`.

## Things she can tap

- **Tap any photo** → opens it big, with ‹ › arrows (and keyboard ←/→/Esc) to flip through them all.
- **"give me a reason 💗"** → reveals a new little reason you love her each press.
- **A live counter** ticking up every second since your first day.
- **Floating buttons** (bottom-right, appear as you scroll):
  - 🤍 showers hearts down the screen
  - 🎨 changes the whole mood — **Blush · Sunset · Lavender · Starlight** (remembers her choice)
  - 🔈 toggles a soft chime on the heart taps
  - ↑ jumps back to the top
- **At the end:** *tap for a little love*, *send me a kiss*, and *relive our year*.

## What's inside

```
index.html      → the page + all the words
css/styles.css  → the look (colors, layout, animations)
js/script.js    → intro, scroll reveals, floating hearts
images/         → our photos
```

Made with love. Happy one year. 🤍
