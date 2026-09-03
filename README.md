# Portfolio Website Skeleton

This is a simple multi-page portfolio website. It is built to be easy to edit manually.

## Languages Used

- HTML for the page structure and content.
- CSS for layout, colors, typography, spacing, and responsive design.
- JavaScript for reusable site components and the responsive mobile navigation menu.

The JavaScript stays framework-free and is organized around the shared site components. More behavior can be added later without duplicating page markup.

## Pages

- `index.html` - Home page
- `about.html` - About page
- `work.html` - My Work page
- `contact.html` - Contact page
- `js/site-components.js` - Shared navbar, footer, page-heading markup, active-page state, and mobile menu behavior

## Where To Edit

- Change shared navbar links, the navbar name, footer text, or social destinations in `js/site-components.js`.
- Change each inner page heading through the `eyebrow`, `heading`, and `description` attributes in its `.html` file.
- Change page-specific introductions, project text, and contact links inside the `.html` files.
- Change colors, fonts, spacing, and button styles in `css/styles.css`.
- Replace `assets/profile-placeholder.svg` with your own photo or image when ready.

## Shared Components

The four pages use native Web Components to avoid repeating the same HTML:

- `<site-header>` renders the shared sticky navbar and automatically marks the current page.
- `<site-footer>` renders the shared footer.
- `<page-banner>` renders the image-free page label and breadcrumb used by About, Projects, and Contact.
- `<page-heading>` renders the repeated heading structure used by About, Projects, and Contact.

These components work when the pages are opened directly from the file system, so no framework, package installation, or build command is required.

## How To Preview

Open `index.html` in your browser. The existing page links in the navigation move between the four current pages.
