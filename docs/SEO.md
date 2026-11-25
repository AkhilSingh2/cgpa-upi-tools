# SEO plan

Hundredmark is a static, crawlable site. The two tools match queries that already have demand in Google India, and the pages are built so a person can finish the task without an account, an ad, or a wrong formula.

The volumes below are the targeting brief for this project (Ahrefs, Google India):

| Query | Volume | Difficulty | Page |
| --- | --- | --- | --- |
| cgpa to percentage | >10K / month | Easy | `/cgpa-to-percentage/` |
| cgpa to percentage calculator | >10K / month | Easy | `/cgpa-to-percentage/` |
| convert cgpa to percentage | >1K / month | Easy | `/cgpa-to-percentage/` |
| upi qr code generator | >10K / month | Easy | `/upi-qr-code-generator/` |
| free upi qr code generator | >1K / month | Easy | `/upi-qr-code-generator/` |

Institution pages exist for the modifiers people add to the head term: CBSE, VTU, AKTU, Anna University, Mumbai University, GTU, KTU, and JNTUH. Examples: `/cgpa-to-percentage/vtu/`, `/cgpa-to-percentage/cbse/`.

Related tasks that are part of the same job — percentage back to CGPA, and SGPA averaged into CGPA — are sections on those pages (`#percentage-to-cgpa`, `#sgpa-to-cgpa`), not separate thin URLs.

## Information architecture

```
/                                   brand, both tools, links to every formula
/cgpa-to-percentage/                head term, all presets, custom formula
/cgpa-to-percentage/<slug>/         one institution, every scheme we can cite
/upi-qr-code-generator/             head term for the QR tool
/privacy/                           what stays on the device
```

Each URL is a real HTML file (`trailingSlash: true`), so it works on GitHub Pages. Parameterised result links (`?scheme=2018&cgpa=8.2`) are the same HTML file. The canonical tag points at the clean URL, so those variants are not separate indexable pages.

## On-page pattern

For a tool or institution page:

- Title is the query, then `· Hundredmark`. Example: `VTU CGPA to Percentage Calculator · Hundredmark`.
- The H1 matches the query in sentence case: `VTU CGPA to percentage calculator`.
- The meta description names the formula and says the source is cited. Descriptions are kept between 110 and 170 characters by the preset test.
- The first paragraph states the formula and a worked number. That text is in the HTML, not only in the calculator.
- A table shows sample CGPAs. Where two schemes exist, both columns are in the table.
- The source block quotes the document and links to it. The date the document was read is on the page (25 November 2026).
- FAQ questions are visible text, and the same questions are in `FAQPage` JSON-LD.
- `BreadcrumbList` and `WebApplication` JSON-LD are on the tool pages. The homepage also has `WebSite`.

Internal links:

- Header and footer link both tools.
- The footer and the homepage list every institution.
- Each institution page links to the others, back to the calculator, and to the UPI tool.
- The calculator on the main page links to the institution page for the preset in use, carrying the current value in the query.

## Technical

- `output: 'export'` in `next.config.ts`. No server is required at request time.
- `sitemap.xml` is generated from `src/lib/routes.ts`, which reads the preset list, so a new preset becomes a URL without a second edit.
- `robots.txt` allows all crawlers and points at the sitemap.
- Canonical URLs are absolute and include `NEXT_PUBLIC_BASE_PATH` once. On a project GitHub Pages site that is `https://<owner>.github.io/<repo>/...`. On Vercel the base path is empty and `NEXT_PUBLIC_SITE_URL` is the production origin. Both are set at build time. If the site URL is forgotten, canonicals fall back to localhost, which should not be deployed.
- Open Graph and Twitter cards use a 1200×630 PNG generated at build time. The post-build step writes `opengraph-image.png` next to the extensionless file Next emits, and rewrites the meta tags to that PNG so a static host serves `image/png`.
- `lang="en"` on the document. Copy is Indian English.
- No analytics and no third-party script. Fonts are self-hosted by `next/font`.

## Content rules

- One formula, one citation, in `src/data/presets.ts`. The UI and the tests read that file. A formula without a document we have read does not get a preset.
- Where two official documents disagree, both are selectable and named. Mumbai University’s 7.1 and 7.25 circulars are the example. The page says which one is later, and it does not average them.
- Where a file is marked draft (VTU’s 2022 B.E./B.Tech PDF) or is a college-hosted copy of a university ordinance (AKTU, KTU), the page says so.
- CBSE’s × 9.5 rule is described as the 2010 indicative equivalence, and the 30 November 2023 notice — the Board does not declare a percentage — is linked beside it.
- Institution pages are not copies of each other. The body explains that institution’s scheme split, class bands, and the worked example from its own document.
- Do not add a preset page for a formula we have not read. Use the custom multiplier on the main calculator instead.

## Adding a university

1. Read the regulation or circular. Record the URL, the date, and a short quote in `src/data/presets.ts`.
2. Express the formula as `multiply`, `offset`, or `linear`. If the document says to round up to the next whole number, set `rounding: 'ceil-integer'`.
3. Add the official illustration to `src/lib/cgpa.test.ts` so a typo fails CI.
4. Run `npm test` and `npm run build`. The institution page, sitemap entry, and Open Graph image are generated from the preset list.

## Measurement

Search Console is the right place to see queries, impressions, and indexing. The site does not ship an analytics tag, because the UPI page’s promise is that nothing is sent anywhere. If analytics are added later, they should stay off the UPI page or be clearly disclosed on the privacy page before the QR tool.

After launch, check:

- The Pages or Vercel deployment’s canonicals use the public origin, not localhost.
- Search Console shows the sitemap fetched.
- Institution URLs are indexed as themselves, and `?cgpa=` URLs are not reported as duplicates.
- The VTU page is the one that ranks for “vtu cgpa to percentage”, and the main calculator is the one that ranks for “cgpa to percentage”.

## Quality bar

Lighthouse, on a host that compresses responses: performance 97 or better, accessibility 100, best practices 100, SEO 100 on the homepage, a preset page, and the UPI page. axe (WCAG 2.1 AA) is clean in light and dark mode at desktop and phone widths. The meaningful checks are the formula tests and the UPI link test, which run in CI on every push.
