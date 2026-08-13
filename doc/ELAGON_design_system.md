# Elagon Website Design System

**Status:** Working source of truth  
**Version:** 2.0  
**Last updated:** 2026-08-12  
**Scope:** Marketing website, Homepage, Services, Work, Approach / Playbook, Company, Contact, and case-detail pages

---

## 1. Purpose

This document translates Elagon's strategic positioning and the approved visual direction into an executable website system.

Elagon is an AI systems specialist for complex operations. The website should therefore feel:

- intelligent without appearing academic;
- established without feeling corporate or generic;
- imaginative without becoming speculative or theatrical;
- technically credible without relying on diagrams, dashboards, or AI clichés;
- editorial, spacious, and image-led rather than UI-heavy.

The central visual idea is **a new renaissance for operational intelligence**: classical order, durability, and human judgment expressed through a contemporary computational image treatment.

---

## 2. Brand Experience Principles

### 2.1 Editorial, not software-interface driven

Pages should resemble a carefully art-directed publication or cultural institution more than a SaaS landing page. Use large typography, strong cropping, asymmetry, and deliberate empty space.

### 2.2 Image and type form one composition

Photography is not placed beside copy as an illustration. The headline, crop, subject, and negative space must be composed together. Large type may overlap an image or continue across its visual axis.

### 2.3 Fewer elements, stronger hierarchy

Every viewport should have one dominant idea. Prefer one headline, one short paragraph, one primary action, and one principal image. Small annotations are supporting elements, never the visual concept.

### 2.4 Classical restraint with computational texture

Classical architecture, landscape, human craft, and renaissance references communicate durability and judgment. Halftone, pixel dispersion, vertical data traces, subtle grids, and controlled transitions introduce the computational layer.

### 2.5 Motion carries the homepage

The homepage should remain concise. Depth comes from motion, cropping, sequencing, and transitions—not from adding more copy, cards, icons, or explanatory labels.

---

## 3. Visual Direction

### Approved keywords

- editorial
- cinematic
- classical-modern
- spacious
- intelligent
- tactile
- art-directed
- quiet confidence
- restrained retro-futurism
- image-led storytelling

### Avoid

- generic SaaS layouts;
- dense feature grids;
- excessive pills, badges, labels, or technical annotations;
- neon cyberpunk or gaming aesthetics;
- glassmorphism and decorative blur;
- gradients used as a substitute for composition;
- generic AI imagery, robots, brains, glowing circuits, or floating nodes;
- rounded-card systems throughout the page;
- continuous decorative animation;
- tiny low-contrast copy layered over busy photography.

---

## 4. Logo System

### Assets

- Light logo: `elagon-logo-white.svg`
- Dark logo: `elagon-logo-black.svg`

### Usage

- Use the light logo on photography, green, rust, and other dark surfaces.
- Use the dark logo on cream or light-blue surfaces.
- Preserve the original proportions. Never redraw, stretch, outline, shadow, or recolor the logo.
- Minimum digital width: `128px` desktop, `116px` mobile.
- Recommended header width: `150–180px` desktop, `128–150px` mobile.
- Minimum clear space: at least the height of the logo symbol on every side.
- Avoid placing the logo directly over the highest-detail area of an image. Use the image's negative space or a restrained scrim.

---

## 5. Color System

### 5.1 Core palette

| Token | Hex | Role |
|---|---:|---|
| `brand-green` | `#596B4A` | Primary brand surface, headings, buttons, grounded operational tone |
| `brand-rust` | `#683A22` | Warm accent, CTA climax, selected states, human/craft dimension |
| `brand-blue` | `#A5BDD7` | Computational contrast, secondary headline line, process surface |
| `brand-cream` | `#E9E2D0` | Main page background, light text on dark surfaces, editorial whitespace |
| `ink` | `#24291F` | Primary text on light surfaces |
| `green-deep` | `#263121` | Deep overlay, footer text/surface support, highest dark contrast |

### 5.2 Semantic tokens

```css
:root {
  --color-brand-primary: #596B4A;
  --color-brand-accent: #683A22;
  --color-brand-secondary: #A5BDD7;
  --color-canvas: #E9E2D0;
  --color-text: #24291F;
  --color-text-inverse: #E9E2D0;
  --color-surface-dark: #263121;

  --color-border-dark: rgb(36 41 31 / 42%);
  --color-border-light: rgb(233 226 208 / 42%);
  --color-overlay-image: rgb(38 49 33 / 22%);
  --color-focus: #A5BDD7;
}
```

### 5.3 Recommended pairings

| Background | Primary text | Accent |
|---|---|---|
| Cream | Ink or green | Rust |
| Green | Cream | Blue or rust |
| Rust | Cream | Blue or green |
| Blue | Green-deep | Cream |
| Photography | Cream | Blue; use a green-deep scrim when required |

### 5.4 Color rules

- Cream is the default canvas and main source of whitespace.
- Green is the primary brand field; do not turn every section green.
- Rust should be used as a climax or point of emphasis, not as a constant highlight.
- Blue is most effective when it changes one line or phrase inside a large serif headline.
- Use no more than three palette colors in one viewport, including the background.
- Normal body copy must meet WCAG AA contrast (`4.5:1`). Large display text must meet at least `3:1`.
- Never communicate status or meaning by color alone.

---

## 6. Typography

### 6.0 Hero type exception

The approved Figma Hero uses a modern grotesk rather than the site-wide editorial serif. This contrast is intentional: the Hero reads as a direct operational promise, while later sections read as an editorial argument.

```css
:root {
  --font-hero: Inter, "Helvetica Neue", Arial, sans-serif;
  --type-hero-primary: clamp(4rem, 9.5vw, 10.5rem);
  --type-hero-connector: clamp(1.375rem, 3.6vw, 3.75rem);
}
```

The four Hero segments are separate content fields—`AI`, `that works.`, `Value`, `that lasts.`—so their relationship can be art-directed at every breakpoint and read as one accessible heading.

### 6.1 Type roles

The system uses a **high-contrast editorial serif** for display language and a **neutral sans serif** for navigation, paragraphs, labels, and UI.

#### Display serif

Preferred production direction:

1. **Canela** or **Canela Deck** when licensed;
2. **Ivar Display** or **Editorial New** as compatible premium alternatives;
3. **Cormorant Garamond** or **Source Serif 4** as open-source alternatives;
4. `Georgia, "Times New Roman", serif` as the system fallback.

Characteristics: elegant contrast, open counters, refined curves, readable at large sizes, not ornamental.

#### Utility sans

Preferred:

1. **Inter**;
2. **Neue Montreal** or **Suisse Int'l** when licensed;
3. `Arial, Helvetica, sans-serif` as fallback.

Characteristics: neutral, compact, quiet, and highly readable.

### 6.2 Type tokens

```css
:root {
  --font-display: "Canela", "Cormorant Garamond", Georgia, serif;
  --font-sans: Inter, "Helvetica Neue", Arial, sans-serif;

  --type-display-xl: clamp(4.75rem, 10vw, 9.625rem);
  --type-display-lg: clamp(4rem, 8.4vw, 8rem);
  --type-display-md: clamp(3.25rem, 6.5vw, 6.5rem);
  --type-heading: clamp(2.5rem, 4.4vw, 4.25rem);
  --type-body-lg: clamp(1rem, 1.2vw, 1.125rem);
  --type-body: 1rem;
  --type-small: 0.8125rem;
  --type-label: 0.75rem;
}
```

### 6.3 Type specifications

| Style | Desktop | Mobile | Line height | Tracking | Use |
|---|---:|---:|---:|---:|---|
| Display XL | 112–154px | 58–76px | 0.78–0.86 | `-0.055em` to `-0.065em` | Hero statement |
| Display LG | 88–128px | 54–72px | 0.82–0.9 | `-0.05em` to `-0.06em` | Section statement |
| Display MD | 64–96px | 46–64px | 0.88–0.96 | `-0.04em` to `-0.055em` | Subpage hero, case title |
| Heading | 42–68px | 36–50px | 0.95–1.05 | `-0.035em` to `-0.045em` | Editorial intro, card title |
| Body large | 17–20px | 16–18px | 1.5–1.6 | normal | Intro paragraph |
| Body | 16px | 16px | 1.5–1.65 | normal | General copy |
| Label | 11–13px | 11–12px | 1.2 | `0.12em–0.16em` | Section number, metadata |

### 6.4 Typography rules

- Display typography uses weight `400`; do not use bold serif headlines.
- Headlines should normally contain 4–10 words.
- Use line breaks as part of the composition. Do not depend on automatic wrapping for art-directed hero text.
- One line or phrase may change to blue or rust to create cadence.
- Body copy should remain under `65–75` characters per line.
- Keep homepage paragraphs to approximately `18–35` words.
- Labels use uppercase sans serif and generous tracking, but should remain scarce.
- Do not place more than one label above a headline.
- Avoid italic display type unless used once as a specific editorial gesture.

---

## 7. Grid and Layout

### 7.1 Breakpoints

| Name | Width |
|---|---:|
| Small mobile | `320–479px` |
| Mobile | `480–767px` |
| Tablet | `768–1023px` |
| Desktop | `1024–1439px` |
| Large desktop | `1440px+` |

### 7.2 Columns

| Viewport | Columns | Gutter | Outer margin |
|---|---:|---:|---:|
| Large desktop | 12 | 24px | 64–76px |
| Desktop | 12 | 20–24px | 48–64px |
| Tablet | 8 | 20px | 32px |
| Mobile | 4 | 16px | 20–24px |

Maximum content width: `1440px`. Full-bleed image fields may exceed the content grid but should retain a cream frame when the composition calls for it.

### 7.3 Spacing scale

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 80px;
  --space-10: 96px;
  --space-11: 120px;
  --space-12: 160px;
}
```

### 7.4 Section rhythm

- Desktop section padding: `96–140px` vertically.
- Mobile section padding: `72–96px` vertically.
- Intro or manifesto sections may use `120–180px` of vertical breathing room.
- Do not fill empty regions with labels, icons, or decorative cards. Empty space is a primary design element.
- Alternate spatial behavior rather than merely alternating background colors:
  - image-dominant;
  - centered whitespace;
  - staggered cards;
  - split editorial layout;
  - diagrammatic process field;
  - final typographic climax.

---

## 8. Image System

### 8.1 Subject direction

Preferred imagery combines:

- classical or monumental architecture;
- renaissance-inspired human figures, craft, writing, study, and decision-making;
- landscapes or systems viewed at scale;
- contemporary objects only when integrated naturally into the scene;
- clear negative space suitable for headline placement.

### 8.2 Treatment

- Muted saturation and controlled contrast.
- Palette should naturally lean toward blue, cream, green, and rust.
- Use halftone, pixel dispersion, scanline, or data-trace texture as a surface treatment—not as a legibility obstacle.
- Preserve the image's tactile quality. Avoid glossy 3D or polished stock-photo lighting.
- Cropping should emphasize scale, silhouette, and negative space.
- One dominant image per section is preferred over galleries of similarly sized thumbnails.
- A small secondary crop may overlap the primary image in Company or case-detail compositions.

### 8.3 Image and text integration

- Compose the image with its exact headline before selecting a crop.
- Position type in existing sky, wall, ground, or architectural negative space.
- Large type may cross the image axis but should not cover a face or important architectural detail.
- Use a localized scrim only where the text sits; never darken the entire image unnecessarily.
- Recommended overlay range: `12–32%` green-deep. Maximum `45%` for complex imagery.
- Avoid standalone white text boxes placed on top of photography unless the page intentionally calls for an editorial cutout.

### 8.4 Asset delivery

- Hero: AVIF or WebP, target `1600–2400px` width, ideally under `500KB` per responsive source.
- Below-fold image: responsive AVIF/WebP and lazy-loaded.
- Always set intrinsic dimensions or `aspect-ratio` to prevent layout shift.
- Provide mobile-specific crops when the desktop subject would become illegible.
- Meaningful images require descriptive alt text. Decorative texture layers use empty alt text or CSS backgrounds.

---

## 9. Shape and Surface Language

### Corners

- Large editorial image fields: square corners.
- Service or metric blocks: square corners.
- Buttons: full pill radius.
- Do not mix multiple corner systems within the same component family.

### Borders

- Use `1px` hairlines at approximately `28–45%` opacity.
- Borders organize information; they should not make every element look like a card.

### Shadows

- Default: none.
- If a floating image requires separation, use a very soft, low-opacity shadow only.

### Decorative geometry

- Permitted: circles/orbits, restrained grids, fine lines, cropped architectural geometry.
- Geometry should imply systems, sequence, or continuity.
- Avoid arbitrary decorative blobs, excessive dots, or network diagrams.

---

## 10. Components

### 10.1 Global header

**Desktop**

- Transparent over the hero image.
- Logo left, primary navigation centered, CTA right.
- Horizontal padding follows page gutters.
- Minimum interactive height: `44px`.
- Navigation: Services, Work, Approach, Company.
- Primary header CTA: “Start a conversation”.

**Mobile**

- Logo left, menu button right.
- Menu button target: at least `44 × 44px`.
- Open menu becomes an opaque green-deep or cream surface; do not place menu text directly over the hero photograph.

### 10.2 Pill arrow button

Structure:

- short verb-led label;
- `1px` border or filled brand surface;
- circular arrow disc on the right;
- minimum height `46px` standard, `56px` final CTA;
- no shadow.

States:

- Default: cream/green or green/cream pairing.
- Hover: fill shifts to rust; arrow disc may shift to green.
- Focus: `2–3px` visible blue focus ring with offset.
- Pressed: subtle `scale(.98)` or opacity change; no layout movement.
- Disabled: reduced opacity and semantic disabled state.

### 10.3 Text link

- Sentence case.
- Minimum clickable height `44px` when used in navigation or actions.
- A fine underline or arrow may animate over `180–220ms`.
- Do not use tiny “Learn more” links beneath every paragraph.

### 10.4 Section label

Format: `01 / WHAT WE DO`

- Sans serif, uppercase, `11–12px`, tracking `0.12–0.16em`.
- Positioned above the section title.
- Use only once per section.
- Optional on Homepage; more useful on long-form and subpages.

### 10.5 Editorial service block

- Three blocks maximum in one row.
- Stagger vertically; avoid uniform dashboard alignment.
- Minimum desktop height: `320–360px`.
- Each contains index, short serif title, and one sentence.
- Backgrounds may use transparent green, blue, and rust.
- On mobile, stack vertically with a small horizontal inset rather than a carousel.

### 10.6 Case-study preview

- One dominant image and one large statement.
- Support with one outcome-focused paragraph and one CTA.
- Do not place three equal case cards on the Homepage.
- Full project lists belong on `/work`.

### 10.7 Process steps

- Four steps: Discover, Design, Build, Operate.
- Use a shared baseline, line, circle, or field to communicate continuity.
- Copy per step: title plus one short sentence.
- Desktop may use four columns. Mobile stacks steps in order.
- Animation reveals progress sequentially; content remains readable without motion.

### 10.8 Form fields

- Visible label above the input; never placeholder-only.
- Minimum field height: `52px`.
- Cream/light fields with ink text or transparent fields with visible hairline border.
- Focus ring uses brand blue.
- Error text appears immediately beneath the affected field and explains how to correct it.
- Submit button shows loading and prevents duplicate submission.

---

## 11. Motion System

### 11.1 Principles

- Motion should reveal structure, depth, and sequence.
- The page must be complete and understandable before animation begins.
- Animate one or two dominant elements per viewport.
- Use transform and opacity only for continuous movement.
- Never use forced scroll-jacking.

### 11.2 Motion tokens

```css
:root {
  --motion-fast: 180ms;
  --motion-standard: 240ms;
  --motion-section: 420ms;
  --ease-out: cubic-bezier(.22, .8, .2, 1);
  --ease-standard: cubic-bezier(.4, 0, .2, 1);
}
```

### 11.3 Homepage motion behaviors

- **Hero image:** subtle pointer or scroll parallax, maximum translation `8–12px`.
- **Hero headline:** masked line reveal or cross-image movement; complete within `420–500ms`.
- **Editorial intro:** simple fade-and-rise, `16–24px` travel.
- **Service blocks:** stagger by `40–60ms`; no looping movement.
- **Selected Work image:** slow crop or scale transition from approximately `1.08` to `1.03` while entering.
- **Playbook:** line/circle progression followed by sequential step reveal.
- **Company collage:** secondary crop moves at a slightly different scroll rate from the primary crop.
- **Final CTA:** concentric system field may expand once as the section enters; it must not pulse forever.

### 11.4 Reduced motion

When `prefers-reduced-motion: reduce` is active:

- disable parallax and scroll-linked transforms;
- show all text and images in their final states;
- retain only short color/opacity feedback for interactions;
- never remove content because an animation is disabled.

---

## 12. Homepage Structure

The Homepage should remain concise and animation-led. Use six principal sections; the editorial introduction is treated as the landing beat of the Hero rather than an additional navigation section.

### Section 1 — Hero + positioning beat

**Purpose:** Establish Elagon's promise immediately.

- Full-width framed image composition.
- Transparent global header.
- Primary headline: **“AI that works. Value that lasts.”**
- Headline is integrated with image; second line may use brand blue.
- Follow with a spacious cream positioning beat:
  - headline example: **“Built for the real world.”**
  - one paragraph, approximately 20–30 words;
  - one CTA.
- No eyebrow in the principal image composition unless later testing proves necessary.
- Do not add technical diagrams or small system labels to the Hero.

### Section 2 — Services

**Purpose:** Show the three connected roles without overexplaining.

- Large statement: **“From the right idea to a system that runs.”**
- Three staggered blocks:
  1. Find the value
  2. Build the system
  3. Run and improve
- Each block has one sentence only.
- Link to `/services` after or within the composition.

### Section 3 — Selected Work

**Purpose:** Provide concrete proof and route to case studies.

- Split composition: dominant image plus large typographic statement.
- Headline example: **“Proof in production.”**
- One brief paragraph describing outcome-led work.
- One CTA: “View selected work”.
- Feature one case or one case-family at a time; use motion to transition if multiple cases are shown.

### Section 4 — Approach / Playbook

**Purpose:** Make the delivery model feel clear and repeatable.

- Large statement: **“One clear path. Four deliberate moves.”**
- Four steps: Discover, Design, Build, Operate.
- Use blue as the primary section surface.
- Use a restrained orbit or connecting line as the animation field.
- Link to `/approach`.

### Section 5 — Company / Why Elagon

**Purpose:** Explain the integrated operating model and independent point of view.

- Large statement: **“One partner. Three roles.”**
- Roles: Advisor, Builder, Operating Partner.
- Editorial collage of one dominant image, one secondary crop, and one color block.
- Supporting phrase may use **“Independent by design.”**
- One short paragraph and one CTA to `/company`.

### Section 6 — Contact / Closing CTA

**Purpose:** Convert interest into a workflow conversation.

- Rust full-width climax surface.
- Large statement: **“Bring us the workflow. We’ll find the way.”**
- One primary CTA: “Start a conversation”.
- Footer is integrated at the bottom of this section.
- No newsletter, resource grid, or competing CTA on the Homepage unless required later.

---

## 13. Subpage Templates

### 13.1 Services `/services`

Recommended order:

1. Editorial hero: what Elagon does and for whom.
2. Three service chapters: Find the Value, Build the System, Run and Improve.
3. Each chapter combines a large statement, one image, concise capabilities, and a linked example.
4. Engagement model: Client-Operated, Co-Managed, Elagon-Operated.
5. Related case study.
6. Final CTA.

Avoid presenting services as a dense list of capabilities or technology categories.

### 13.2 Work `/work`

Recommended order:

1. Hero: outcome-led positioning.
2. Featured case in a large image/type composition.
3. Remaining case studies in an asymmetric editorial index.
4. Optional filters only if there are enough cases to justify them.
5. Final CTA.

Card metadata should be limited to client/type, business outcome, and one category.

### 13.3 Case detail

Recommended order:

1. Case hero: client, outcome headline, dominant image.
2. At-a-glance: challenge, system, result.
3. Context and operational challenge.
4. Workflow redesign.
5. System architecture explained in plain language.
6. Production rollout and operating model.
7. Measured outcomes.
8. Related case or contact CTA.

Use diagrams only when they clarify a real system relationship. Do not turn the page into a technical report.

### 13.4 Approach `/approach`

Recommended order:

1. Hero: Playbook promise.
2. Discover, Design, Build, Operate chapters.
3. Cross-cutting practices: value measurement, governance, adoption, operating readiness.
4. Post-launch operating modes.
5. Final CTA.

Each chapter gets one dominant visual rather than a grid of icons.

### 13.5 Company `/company`

Recommended order:

1. Hero: integrated partner positioning.
2. Point of view on production AI for complex operations.
3. Advisor / Builder / Operating Partner.
4. Independent, model- and platform-agnostic stance.
5. Leadership or team only when final content is available.
6. Final CTA.

### 13.6 Contact `/contact`

Recommended order:

1. Large conversational headline.
2. Short expectation-setting paragraph.
3. Focused form: name, work email, company, workflow or opportunity, optional context.
4. Alternative direct contact information if required.

The page should feel personal and low-friction—not like an enterprise lead-capture form.

---

## 14. Content Hierarchy and Tone

### Headline tone

- Plain, confident, and memorable.
- Prefer short parallel structures and natural rhythm.
- Use everyday business language rather than consulting abstractions.
- Describe what works, runs, changes, or lasts.

Examples:

- AI that works. Value that lasts.
- Built for the real world.
- From the right idea to a system that runs.
- Proof in production.
- One clear path. Four deliberate moves.
- One partner. Three roles.
- Bring us the workflow. We’ll find the way.

### Avoid

- “Transform your enterprise with AI.”
- “Turn critical workflows into measurable production capability.”
- “End-to-end AI transformation.”
- “Unlock the power of AI.”
- strings of technical nouns or unexplained acronyms.

### Paragraph tone

- One idea per paragraph.
- Active voice.
- Concrete nouns and verbs.
- Explain the work before naming the methodology.
- Homepage paragraphs: `18–35` words.
- Subpage paragraphs: generally under `70` words.

### CTA tone

Primary CTAs should be specific and conversational:

- Discuss a workflow
- Start a conversation
- View selected work
- Explore the Playbook
- Meet Elagon

Avoid generic “Submit”, “Learn More”, or multiple competing actions.

---

## 15. Accessibility Requirements

- Meet WCAG 2.2 AA for text contrast and interaction.
- All interactive controls must be keyboard accessible.
- Preserve visible browser focus or provide a stronger branded focus style.
- Minimum pointer target: `44 × 44px`.
- Use one `h1` per page and sequential heading levels.
- Navigation landmarks and forms require accessible names.
- Provide descriptive alt text for meaningful imagery.
- Do not embed essential text inside raster images.
- Color cannot be the only signal.
- Respect browser zoom and dynamic text sizing.
- Avoid auto-playing audio or motion that cannot be stopped.
- Forms require persistent labels, inline validation, clear recovery language, and accessible status messages.

---

## 16. Performance Requirements

- Prioritize the Hero image and logo; defer noncritical scripts.
- Use responsive AVIF/WebP image sets.
- Lazy-load below-fold images.
- Reserve image dimensions to keep cumulative layout shift below `0.1`.
- Use `font-display: swap` or `optional`.
- Preload only the critical display and body font files actually used above the fold.
- Keep per-frame animation work below approximately `16ms`.
- Batch scroll reads and writes; prefer `requestAnimationFrame` for pointer/scroll effects.
- Avoid large blur filters and animated box shadows.
- Disable or simplify intensive motion on small screens and low-power devices.

---

## 17. CSS Token Starter

```css
:root {
  /* Color */
  --color-brand-primary: #596B4A;
  --color-brand-accent: #683A22;
  --color-brand-secondary: #A5BDD7;
  --color-canvas: #E9E2D0;
  --color-text: #24291F;
  --color-text-inverse: #E9E2D0;
  --color-surface-dark: #263121;
  --color-focus: #A5BDD7;

  /* Typography */
  --font-display: "Canela", "Cormorant Garamond", Georgia, serif;
  --font-sans: Inter, "Helvetica Neue", Arial, sans-serif;
  --type-display-xl: clamp(4.75rem, 10vw, 9.625rem);
  --type-display-lg: clamp(4rem, 8.4vw, 8rem);
  --type-display-md: clamp(3.25rem, 6.5vw, 6.5rem);
  --type-heading: clamp(2.5rem, 4.4vw, 4.25rem);
  --type-body-lg: clamp(1rem, 1.2vw, 1.125rem);
  --type-body: 1rem;
  --type-label: .75rem;

  /* Layout */
  --page-gutter: clamp(1.25rem, 5vw, 4.75rem);
  --section-space: clamp(4.5rem, 8vw, 8.75rem);
  --content-max: 90rem;

  /* Motion */
  --motion-fast: 180ms;
  --motion-standard: 240ms;
  --motion-section: 420ms;
  --ease-out: cubic-bezier(.22, .8, .2, 1);
  --ease-standard: cubic-bezier(.4, 0, .2, 1);

  /* Shape */
  --radius-action: 999px;
  --border-hairline: 1px;
}
```

---

## 18. Release Checklist

Before approving any page:

### Brand and composition

- [ ] The viewport has one obvious dominant idea.
- [ ] The image and headline feel composed together.
- [ ] Empty space is intentional and sufficient.
- [ ] No generic AI or SaaS visual clichés appear.
- [ ] Logo proportions and clear space are correct.

### Content

- [ ] Headline is short, plain, and outcome-oriented.
- [ ] Paragraphs stay within the intended length.
- [ ] Each section has one primary CTA at most.
- [ ] Technical details are moved to the appropriate subpage.

### Visual system

- [ ] Only approved colors and semantic tokens are used.
- [ ] Serif and sans roles are consistent.
- [ ] Display type is not bold.
- [ ] Corner, border, and button treatments follow this system.

### Responsive

- [ ] Tested at `375`, `768`, `1024`, and `1440px`.
- [ ] Custom mobile image crop is provided where needed.
- [ ] No horizontal overflow or clipped text.
- [ ] Body text is at least `16px` on mobile.

### Accessibility and motion

- [ ] Contrast meets WCAG AA.
- [ ] Touch targets are at least `44 × 44px`.
- [ ] Keyboard focus is visible.
- [ ] Reduced-motion mode shows complete content.
- [ ] Motion uses transform/opacity and never blocks interaction.

### Performance

- [ ] Responsive images and intrinsic dimensions are present.
- [ ] Below-fold media is lazy-loaded.
- [ ] Fonts use `font-display` and only critical files are preloaded.
- [ ] No continuous decorative animation or unnecessary heavy effects.

---

## 19. Governance

- This file is the master design-system source of truth.
- Page-specific exceptions should be documented in `design-system/pages/<page-name>.md` and must explain why the master rule is insufficient.
- New colors, type styles, card patterns, and motion behaviors require a documented system-level need—not a one-page preference.
- When a page feels repetitive, first change composition, cropping, scale, or spacing. Do not immediately introduce a new component or visual style.
- Review this document whenever positioning, primary copy, photography direction, or core navigation changes.
