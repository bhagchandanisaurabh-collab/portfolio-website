---
version: alpha
name: "Portfolio Site Skeleton"
description: "A simple editorial portfolio identity for a personal multi-page website."
colors:
  primary: "#245B52"
  background: "#FFFFFF"
  surface: "#FFFFFF"
  text: "#171B1A"
  muted: "#626861"
  line: "#D9DED6"
  accent: "#245B52"
  accentStrong: "#174039"
  warm: "#B86B3C"
  focus: "#0D6EFD"
  pageBanner: "#F3F6F3"
  footerSocial: "#FAFBFA"
  footerCopyright: "#ECEFED"
typography:
  display:
    fontFamily: "Georgia, 'Times New Roman', serif"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  brand:
    fontFamily: "Libre Baskerville, Georgia, 'Times New Roman', serif"
  navigation:
    fontFamily: "Manrope, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  handwritten:
    fontFamily: "Caveat, 'Segoe Print', 'Bradley Hand', cursive"
rounded:
  sm: "4px"
  md: "8px"
spacing:
  section: "80px"
  container: "1120px"
components:
  button: {}
  card: {}
  nav: {}
  form: {}
---

# Portfolio Site Skeleton Design System

## Overview

### Creative North Star

The site should feel like a quiet personal notebook refined into a public portfolio: text-led, calm, and direct, with enough warmth to feel human. The first version is intentionally simple because the owner will replace the placeholder content manually.

### Product context and register

- **Audience and primary job:** Recruiters, collaborators, clients, or classmates should quickly understand who the owner is, what they make, and how to contact them.
- **Target market(s) and evidence:** General web audience; no region-specific behavior is required in this skeleton.
- **Locale(s) and language policy:** English content, with plain labels and editable placeholders.
- **Usage scene:** Desktop and mobile browsing, usually short visits.
- **Register:** Brand/content site.
- **Memorable signature:** A friendly handwritten home greeting paired with a polished profile portrait and a focused geospatial introduction.
- **Restraint:** Navigation, project cards, forms, and footer stay familiar and easy to edit.
- **Anti-references:** Avoid heavy animations, dense dashboards, one-note neon palettes, and generic template hero sections.
- **Token ownership/runtime mapping:** This file documents the visual intent. Runtime values live as CSS custom properties in `css/styles.css`.

## Colors

The palette uses a pure white background and content surfaces, dark ink text, muted green for primary actions, and a warm copper accent for small labels. Focus blue remains intentionally distinct so keyboard focus is easy to see.

## Typography

Georgia remains the display face for section and page headings. The homepage greeting alone uses Caveat at weight `600`, giving the introduction a friendly handwritten character while remaining readable and professional. The greeting stays on one line when the desktop text column has sufficient room. The body stack uses system sans fonts so the site renders quickly and remains easy to maintain. The navbar name uses Libre Baskerville Bold at `1.7rem` and weight `700`, giving it a distinct editorial identity above the Manrope ExtraBold navigation links at weight `800`. On narrow screens it reduces to `1.15rem` so the full name and menu button continue to fit.

## Layout

The site uses a centered `1120px` container, generous page spacing, and simple responsive grids that collapse to one column on narrow screens. The first viewport on the home page uses a two-column portrait-and-biography composition with a natural-ratio profile photo capped at `440px` on the left and a handwritten greeting followed by three readable introduction paragraphs on the right. Tablet and mobile layouts place the portrait before the introduction. The About page opens with a white editorial text panel overlapping a right-aligned portrait on larger screens, then stacks the text before the image on mobile. The next section presents four informational work-area rows with icons, titles, and concise descriptions on flat white surfaces. The homepage project section uses two equal-height, media-ready project cards and one matching Projects CTA card in three columns, with a two-column tablet layout and a single-column mobile stack.

## Elevation & Depth

Most surfaces use borders rather than shadows. The sticky navigation uses one restrained shadow beneath its thin separator to remain visually distinct while scrolling; content surfaces stay flat.

## Shapes

Cards and buttons use a maximum `8px` radius. Smaller controls use `4px` radius. The homepage portrait uses a restrained `14px` radius as a media-specific exception. This keeps the site approachable but still crisp.

## Components

### Foundational visual states

Links, buttons, inputs, and textareas include hover and visible focus states. Reduced-motion preferences are respected in the global stylesheet.

### Buttons and actions

Primary buttons use the green accent. Secondary buttons use white surfaces with borders. The homepage hero uses a green outline "Know more" link with a simple arrow to lead visitors to the About page. Labels are written as direct actions such as "View my work" and "Contact me."

### Work areas

The homepage "What I Do" section uses four non-interactive informational rows for GIS and spatial analysis, Earth Observation and remote sensing, WebGIS applications, and digital twins. Each row has a pale circular Lucide line icon and a restrained hover lift for pointer users. The rows do not use arrows, pointer cursors, or click behavior.

### Navigation and data display

The navigation appears on every page with `aria-current` on the active page. Its sticky white header uses a `1px` `#D5DBD6` bottom border and a restrained `0 3px 14px rgba(23, 27, 26, 0.08)` shadow. Desktop and mobile navigation links use Manrope ExtraBold at weight `800`; the name uses Libre Baskerville Bold at `1.7rem` and weight `700`, reducing to `1.15rem` on narrow screens. About, Projects, and Contact use a shared `#F3F6F3` page banner with a page label and semantic `Home > Current page` breadcrumb, without imagery. The banner is `224px` tall on desktop and `184px` on narrow screens, with intentionally greater space above the text so its content sits slightly below center. Shared navbar markup, active-page detection, mobile menu behavior, footer markup, page banners, and inner-page heading structure are owned by native Web Components in `js/site-components.js`; page files declare the relevant component tags and page-specific content. Project cards use consistent spacing, type hierarchy, and link placement.

### Footer and social links

The shared footer uses the manually refined centered `#FAFBFA` connection band and a slightly deeper `#ECEFED` copyright band. LinkedIn, GitHub, email, and Instagram appear as accessible circular icon links with solid identifying colors, visible keyboard focus, and no decorative animation. The shortened copyright line remains centered and the year updates automatically. Future unrelated work must preserve this footer treatment.

### Forms and overlays

The contact form is static and uses `mailto:` in this first skeleton. Its open, unframed layout spans up to `1040px`, using two columns on desktop and one column on narrow screens. Name, email, phone, and message fields use restrained underline styling, while pale contour-line details stay behind the lower outer edges of the section. Field names appear as placeholders while associated labels remain available to assistive technology; the message field is not resizable to preserve layout.

### Iconography

The homepage work-area rows use inline Lucide line icons in the site accent color. Navigation remains text-led, and the hero uses a responsive profile portrait.

### Motion

Motion is limited to the small work-area hover lift requested for pointer users. It is removed under reduced-motion preferences. Future motion should clarify state or page transitions.

### Content and data visualization

Copy is plain and editable. Placeholder content names exactly what the owner should replace: introduction, background, skills, project descriptions, links, and email address.

## Do's and Don'ts

- **Do:** Keep edits in the shared CSS variables when changing the visual identity.
- **Do:** Replace placeholder page copy with specific personal details and real project outcomes.
- **Don't:** Add unrelated sections before the home page introduction.
- **Don't:** Hide focus states, reduce contrast, or make clickable items look like plain text.
