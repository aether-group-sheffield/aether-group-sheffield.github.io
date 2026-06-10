# AETHER Group website

Static website for the AETHER Group (Advanced, Effective, Translational Health Engineering
Research) at the School of Electrical and Electronic Engineering, University of Sheffield.

No build step, no dependencies — plain HTML, CSS, and a small amount of vanilla JavaScript.

## Structure

```
index.html          Homepage (hero, themes, approach, audiences, CTA)
research.html       Research themes with anchor sections (#artificial-intelligence,
                    #medical-devices, #automatic-control)
people.html         Group lead + member grid (template included in comments)
publications.html   Publications list (template included in comments)
contact.html        Enquiry routes and contact details
404.html            Not-found page (used automatically by GitHub Pages)
assets/css/styles.css   All styling; brand palette defined as CSS variables at the top
assets/js/main.js       Nav toggle, OpenDyslexic toggle, scroll reveal
assets/img/             Logos (from the style guide) and favicons
```

## Deploying to GitHub Pages

Push this directory to the root of the `aether-group-sheffield.github.io` repository
(main branch, root folder — remove the old `docs/` Jekyll setup or switch the Pages
source to "main / root"). No Jekyll or Gemfile needed; everything is pre-built.

All internal links are root-relative (`/research.html`, `/assets/...`), which works on a
`*.github.io` user/organisation site. If the site is ever hosted under a subpath, the
links would need a base-path prefix.

## Editing content

- **Add a member:** in `people.html`, copy the commented "Member card template", fill in
  the name, role, bio, photo (`assets/img/people/`), and links.
- **Add a publication:** in `publications.html`, copy the commented structure, group items
  under a `<h2 class="pub-year">` heading, and tag with theme badges. Remove the "being
  compiled" notice once real entries exist.
- **Update copy:** all text lives directly in the HTML files.

## Brand and accessibility notes (from the AETHER Group Style Guide)

- The group is written **AETHER** (all caps), never "Aether"; "Æ" appears only in the
  condensed logo.
- Body text is `#090112` (20% primary shade) on `#F4F3F7` (5% primary tint). The full
  tint/shade palette is defined as CSS variables in `styles.css`.
- Accent colours (`#EF476F`, `#FFD166`, `#F9591F`) are reserved for charts/illustrations,
  used only after primary/secondary/tertiary.
- Fonts: Tahoma (body) and Tahoma Bold (headings), with an **OpenDyslexic toggle** in the
  navigation (persisted via localStorage), as the style guide requires.
- Per the style guide, written copy should not be AI-generated: the text currently in
  these pages was drafted as scaffolding from the group's own descriptions and **should be
  reviewed and rewritten by group members before launch** (contact
  jnschofield1@sheffield.ac.uk per the guide).
