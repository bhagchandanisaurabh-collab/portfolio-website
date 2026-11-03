# Portfolio Website Skeleton

This is a simple multi-page portfolio website. It is built to be easy to edit manually.

## Languages Used

- HTML for the page structure and content.
- CSS for layout, colors, typography, spacing, and responsive design.
- JavaScript for reusable site components and the responsive mobile navigation menu.

The JavaScript stays framework-free and is organized around the shared site components. More behavior can be added later without duplicating page markup.

## Pages

- `index.html` - Home page
- `about.html` - About page, including the Tools & Technologies section (`css/about-tools.css`, `js/about-tools.js`)
- `work.html` - Projects overview
- `contact.html` - Contact form (Netlify Forms)
- `privacy.html` - Privacy policy
- `404.html` - Not-found page (uses `<base href="/">` so it works on any URL depth)
- `project-*.html` - Project detail pages (styled by `css/project-detail.css`)
- `js/site-components.js` - Shared navbar, footer, page banner, page-heading markup, active-page state, and mobile menu behavior
- `_headers` - Netlify security headers (Content-Security-Policy and related headers)

## Where To Edit

- Change shared navbar links, the navbar name, footer text, or social destinations in `js/site-components.js`.
- Change each inner page heading through the `eyebrow`, `heading`, and `description` attributes in its `.html` file.
- Change page-specific introductions, project text, and contact links inside the `.html` files.
- Change colors, fonts, spacing, and button styles in `css/styles.css`.
- Name new images in lowercase with hyphens and a project prefix (for example `kampala-current-risk.webp`), and keep them under about 2000 px on the long side.
- If a new page loads anything from another website (scripts, fonts, embeds), add that domain to the Content-Security-Policy in `_headers`, or the browser will block it.

## Shared Components

The pages use native Web Components to avoid repeating the same HTML:

- `<site-header>` renders the shared sticky navbar and automatically marks the current page.
- `<site-footer>` renders the shared footer.
- `<page-banner>` renders the page label and breadcrumb. Project pages pass `parent` and `parent-href` to add a "Projects" step.
- `<page-heading>` renders the repeated heading structure used by About, Projects, and Contact.

These components work when the pages are opened directly from the file system, so no framework, package installation, or build command is required.

## How To Preview

Open `index.html` in your browser, or run a local server (for example `python -m http.server`) from this folder. Changes go live when they are pushed to the `main` branch on GitHub, which Netlify deploys automatically.
