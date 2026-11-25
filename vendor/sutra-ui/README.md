# Vendored Sutra UI

Built artifacts from [Sutra UI](https://github.com/AkhilSingh2/sutra-ui) `main` at commit `15ffa907a044f074abb6df4d331f179e8dda7a8b` (docs: https://akhilsingh2.github.io/sutra-ui/).

`@sutra-ui/tokens` and `@sutra-ui/react` are not published to npm. Upstream `dist/` is generated and is not in the git tree. A git dependency cannot satisfy `npm ci`: npm would fetch source that does not match the package `exports`, and the React package depends on the tokens package with the pnpm `workspace:*` protocol. These folders are the output of `pnpm build:libs` so CI can install them with `file:` dependencies and no extra toolchain.

| Folder | Package | What is here |
| --- | --- | --- |
| `tokens/` | `@sutra-ui/tokens` | `dist/sutra.css`, the Tailwind preset (`dist/tailwind-preset.js` and `.cjs`), theme JSON, and the DTCG source in `tokens/` |
| `react/` | `@sutra-ui/react` | ESM build, type declarations, `theme-script`, and `dist/styles.css` (token CSS plus component CSS) |

License: MIT, copied in `LICENSE`. Do not edit the generated CSS or JavaScript. To refresh, check out that commit (or a newer `main`), run `pnpm install` and `pnpm build:libs`, then replace `tokens/dist`, `tokens/tokens`, and `react/dist`.

Hundredmark loads `@sutra-ui/tokens/css` and `@sutra-ui/react/styles.css`. The Tailwind preset is part of this vendor drop for projects that use Tailwind; this site styles with the token variables directly.
