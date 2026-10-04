# AGENTS.md

Notes for AI agents working on Marco Sero's personal site, <https://marcosero.com>. It is a Jekyll site hosted on GitHub Pages (repo `MarcoSero/marcosero.github.io`). The theme is [Klisé](https://github.com/piharpi/jekyll-klise), with local edits.

## Working agreements

- **Pushing to `master` is the production deploy.** Pages builds only from `master`, so a branch push never goes live. Show the user a local preview and get an explicit go-ahead before pushing to `master`. For big changes, use a branch, then fast-forward `master` once approved. The theme switch used this approach.
- **Commit in logical pieces**, one concern per commit, with a short summary line and a body that says why. Commits end with the `Co-Authored-By` line from the session's attribution reminder.
- **Don't change git config.** `origin` is HTTPS with no saved credentials, so `git push` fails. Push with `gh`'s credentials for that one command, without changing the remote:
  ```bash
  git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push origin master
  ```
  Pushing to `git@github.com:MarcoSero/marcosero.github.io.git` also worked once.
- **Don't create public repos, change DNS or change Cloudflare settings unasked.** Ask first. Past examples: creating `MarcoSero/blog-redirect` and adding a site to Cloudflare Web Analytics were each approved first. The user edits DNS themselves in Hover, so give exact records to change.
- **Never put secrets in the repo.** The Cloudflare Web Analytics token in `_config.yml` is a public identifier, so it is fine.
- Preview servers and scratch work go in the session scratchpad, not in the repo. Stop any `jekyll serve` you start.

## Local build and preview

The system Ruby is too old. Use Homebrew Ruby (4.0.x):

```bash
export PATH=/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH
bundle install
bundle exec jekyll build                      # output goes to _site/
bundle exec jekyll serve --port 4003          # preview
```

- `Gemfile` is minimal and pins Jekyll `~> 4.4`. It carries `webrick`, `csv`, `base64`, `bigdecimal` and `logger` because those left the default gems on Ruby 3.4+/4.0. Don't remove them.
- `_site/` and `.jekyll-cache/` are git-ignored.
- Redirect pages point at the absolute `https://marcosero.com/...` URL, so clicking a `/blog/...` redirect on localhost jumps to the live site. Check redirect HTML in `_site/` instead of clicking through.

## GitHub Pages ≠ local Jekyll (important)

Pages uses its own older toolchain (Jekyll 3.10 via the `github-pages` stack), while local builds use Jekyll 4. **A green local build does not prove Pages will build it.**

- Plugins come from `plugins:` in `_config.yml`. Currently `jekyll-redirect-from`, `jekyll-sitemap`, `jemoji`. Use **only** `plugins:`. An old `gems:` key made Pages ignore `jekyll-redirect-from` (the `.html` redirects 404'd) while local builds looked fine.
- Only plugins on the GitHub Pages allow-list work. Check `https://pages.github.com/versions.json` before adding one. Klisé's original `jekyll-postfiles` plugin is not on the list, so it was removed. The theme's `{% feed_meta %}` tag was replaced with a hand-written `<link rel="alternate">` in `_includes/header.html`.
- To check the real Pages build, run GitHub's build image (needs Docker; the CLI is at `/Users/marco/.docker/bin`):
  ```bash
  docker run --rm --platform linux/amd64 \
    -e GITHUB_WORKSPACE=/github/workspace -e INPUT_SOURCE=src -e INPUT_DESTINATION=out \
    -v "$SCRATCH":/github/workspace ghcr.io/actions/jekyll-build-pages:v1.0.13
  ```
  Copy the repo into `$SCRATCH/src` first (exclude `.git`, `_site`, `.jekyll-cache`) and make an empty `$SCRATCH/out`. Without a GitHub token, the `github-metadata` plugin fails. This site doesn't use it, so build with `OFFLINE=true` or substitute the three plugins above. Then `diff -r` the result against the local `_site`. Past checks matched.
- After a push, inspect the deploy with `gh api repos/MarcoSero/marcosero.github.io/pages/builds/latest --jq '{status,commit,error:.error.message}'`. In earlier sessions the permission system sometimes blocked this call as a "production deploy" action. If it is blocked, tell the user and give them the Actions URL (`https://github.com/MarcoSero/marcosero.github.io/actions`) and the URLs to check by hand. Don't route around it.

## URL scheme (don't break old links)

This is the most sensitive part of the site. Old posts have been linked from Hacker News, other blogs and RSS readers for years.

- **Canonical post URL:** `/archive/:title/` (`permalink: /archive/:title/` in `_config.yml`).
- **History:** posts were `/blog/:title/` (Jekyll 2), `/blog/:title.html` after a Jekyll upgrade silently broke the slash form, then `/archive/:title/`.
- **Every post must carry `redirect_from` entries** for both old forms:
  ```yaml
  redirect_from:
    - /blog/<slug>.html
    - /blog/<slug>/
  ```
  `<slug>` is the post filename without the date prefix and extension. `newpost.rb` does **not** add these, so add them by hand to new posts if you want parity. They are only needed for posts that existed before the move, which is all current posts.
- `archive.html` has `redirect_from: /blog/`, so the old index goes to `/archive/`. The old paginated index URLs (`/blog/page2/` etc.) went away when the theme switch dropped `paginate`, and no redirects were added for them.
- Odd filename: `_posts/2015-09-1-working-on-a-legacy-app.md` has a one-digit day. Its slug is `working-on-a-legacy-app`. Keep the name and make sure its redirects use that slug.
- **`feed.xml` GUIDs must stay stable.** `<guid isPermaLink="false">http://www.marcosero.com/blog/{{ post.slug }}</guid>` keeps the old `/blog/` form on purpose. Changing it makes every subscriber see all posts as new. The `<link>` values use the current `/archive/` URLs.
- The RSS icon and footer link were deliberately removed from the UI. `feed.xml` and the `<link rel="alternate">` autodiscovery tag stay. Don't re-add visible RSS links unless asked.
- Don't try to verify redirects by clicking on localhost; see "Local build and preview" above. Verify live with `curl -sI` after deploy, using a cache-busting `?v=$RANDOM` query. Static redirect pages may stay cached in browsers and search engines for a while.

### `blog.marcosero.com` (separate repo)

Before 2014 the blog lived at `blog.marcosero.com/<title>`.

- Repo `MarcoSero/blog-redirect` is a tiny Pages site with a `CNAME` of `blog.marcosero.com`. Its `404.html` and `index.html` use JavaScript to send `blog.marcosero.com/<slug>` to `https://marcosero.com/blog/<slug>/`, which then redirects on to `/archive/<slug>/`.
- DNS (Hover): `blog` is a CNAME to `marcosero.github.io`. It is not `marcosero.github.com`, which GitHub 404s. Domain `marcosero.com` is verified on the user's GitHub account via a `_github-pages-challenge-MarcoSero` TXT record. This was needed to clear a stale claim on the subdomain. Don't delete that record.
- Limitations: it is a JS redirect that GitHub serves with HTTP 404, so it is not a true 301 for search engines. A Pages repo can serve only one custom domain.
- If the user can't load `blog.marcosero.com` right after a DNS change, suspect macOS negative DNS caching: `sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder`, and clear Chrome's cache at `chrome://net-internals/#dns`. The agent can't run `sudo`.
- Unrelated: the `photos` CNAME value in Hover is `https://www.marcosero.photos` (a protocol in a CNAME value). It was flagged to the user, who didn't ask for a fix.

## Site structure

| Path | Purpose |
|---|---|
| `_config.yml` | Title, `url`, permalink, `author:` block (bio, avatar, social URLs), `cloudflare_analytics`, plugins |
| `_posts/` | 36 posts (2012–2015), `.md` and `.markdown` |
| `_layouts/` | `default`, `home`, `page`, `post`, `404`, `compress` (HTML minifier wraps `default`) |
| `_includes/` | `header`, `navbar`, `author`, `socials`, `footer`, `theme-init`, plus theme extras (`pagination` is unused) |
| `_sass/klise/`, `assets/css/style.scss` | Theme styles (SCSS compiled by Jekyll) |
| `assets/js/` | Theme scripts, including `search.min.js` for the archive search box; index at `assets/search.json` |
| `about.md`, `archive.html`, `index.md`, `404.md` | Top-level pages |
| `_data/menus.yml`, `_data/info.yml` | Navbar items; `info.yml` is old and unused by the theme |
| `images/` | Images referenced from old posts (`/images/...`). Keep it |
| `newpost.rb` | `ruby newpost.rb "Title"` creates a dated post stub. Defaults to `categories: iOS` |
| `CNAME` | `marcosero.com`. Required by Pages and excluded from the build output via `exclude:` |

Home page shows the bio line from `author.bio` (just "Zurich, Switzerland") and social icon links from `author.*` in `_config.yml`. A blank URL hides that icon. `number_of_posts: 5` limits the home list.

## Theme and styling details

- **Dark/light mode:** follows `prefers-color-scheme` live. The sun/moon button is a stored override (`localStorage` key `theme`). The logic lives in one shared include, `_includes/theme-init.html`, used by every layout. The `compress` layout joins lines, so **never use `//` comments inside inline scripts**. Use block comments or Liquid `{% comment %}`.
- **Plain-page paragraph spacing:** the theme adds 15px above and below every paragraph. `_sass/klise/_post.scss` ends with a rule `main.page-content > p { padding: 5px 0 }` so that only pages using the `page` layout (About) get tighter paragraphs. Post bodies are unchanged. Don't broaden the selector without checking a post.
- **Cloudflare Web Analytics:** a conditional `<script>` at the end of `_includes/footer.html`, driven by `cloudflare_analytics` in `_config.yml`. Blank token means no script. The script tag uses `type="module"` instead of the Cloudflare default `defer`. This was changed deliberately in `49248e9`, so don't revert without testing a built page.
- Google Analytics is disabled: the old `UA-` ID has been dead since 2023. GoatCounter was tried and dropped in favour of Cloudflare.

## Content voice and preferences

- **English spelling:** "Zurich", not "Zürich".
- **No theme credit** anywhere. The footer and About page don't mention Jekyll or Klisé. The theme's `LICENSE` is in the git history.
- **No employer mention** on the site. "Working at Google" was removed from the About page and home bio on purpose.
- **About page tone:** short and low-key. Marco found a longer, adventurous bio "cringy". The current text says he is curious by nature and likes to build things to understand how they work, and points to Instagram and Strava for the outdoors side. Keep it short unless asked.
- **Footer:** just the copyright. The "ack." and "resume" links were removed.
- Marco used to write mostly about iOS development. The `iOS` category on old posts is historical, so don't reclassify it.
- Be careful editing old posts. Fix typos and links only, and keep their content and URLs.

## Verification checklist after a change to config, permalinks or layouts

1. `bundle exec jekyll build` has no errors.
2. `ls _site/archive | head`, and for a couple of posts check `_site/blog/<slug>/index.html` and `_site/blog/<slug>.html` are redirect stubs.
3. `/`, `/archive/`, `/about/`, one post, `/feed.xml` and a nonexistent URL (404 page) all return the right content on the local preview.
4. The feed GUIDs are unchanged: diff the `<guid>` lines against the live `https://marcosero.com/feed.xml`.
5. For anything touching plugins or Jekyll features, run the Pages build image described above.
6. After the user approves and you push, check the live URLs with `curl -sI` and report anything unverified. Don't claim a deploy succeeded unless you checked it.
