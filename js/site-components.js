(function () {
  "use strict";

  var pages = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "work.html", label: "Projects" },
    { href: "contact.html", label: "Contact" },
    {
      href: "assets/Saurabh_Bhagchandani_CV.pdf",
      label: "CV",
      external: true
    }
  ];

  // Replace these placeholder destinations with your real profile links.
  var socialLinks = [
    {
      href: "https://www.linkedin.com/in/saurabh-bhagchandani",
      icon: "linkedin",
      label: "LinkedIn",
      external: true
    },
    {
      href: "https://github.com/bhagchandanisaurabh-collab",
      icon: "github",
      label: "GitHub",
      external: true
    },
    {
      href: "mailto:bhagchandanisaurabh@gmail.com",
      icon: "mail",
      label: "Email",
      external: false
    },
    {
      href: "https://www.instagram.com/saurabh__bhagchandani?igsi=Y2d6dXd4YnZuMWxo",
      icon: "instagram",
      label: "Instagram",
      external: true
    }
  ];

  var socialIcons = {
    linkedin: {
      svg: { fill: "currentColor" },
      parts: [
        {
          tag: "path",
          attributes: {
            d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z"
          }
        }
      ]
    },
    github: {
      svg: { fill: "currentColor" },
      parts: [
        {
          tag: "path",
          attributes: {
            d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405 11.5 11.5 0 0 1 3 .405c2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57A12.01 12.01 0 0 0 24 12.297c0-6.627-5.373-12-12-12"
          }
        }
      ]
    },
    mail: {
      svg: {
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2"
      },
      parts: [
        {
          tag: "rect",
          attributes: { width: "20", height: "16", x: "2", y: "4", rx: "2" }
        },
        {
          tag: "path",
          attributes: { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }
        }
      ]
    },
    instagram: {
      svg: { fill: "currentColor" },
      parts: [
        {
          tag: "path",
          attributes: {
            d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948C23.729 2.696 21.309.273 16.948.073 15.668.014 15.259 0 12 0zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-10.405a1.44 1.44 0 1 1-2.881 0 1.44 1.44 0 0 1 2.881 0z"
          }
        }
      ]
    }
  };

  function getCurrentPage() {
    var fileName = window.location.pathname.split("/").pop().toLowerCase();
    return fileName || "index.html";
  }

  function createLink(page, currentPage) {
    var link = document.createElement("a");
    link.href = page.href;
    link.textContent = page.label;

    if (page.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    if (page.href === currentPage) {
      link.setAttribute("aria-current", "page");
    }

    return link;
  }

  function appendNavigationLinks(container, currentPage) {
    pages.forEach(function (page) {
      container.appendChild(createLink(page, currentPage));
    });
  }

  function createSocialIcon(iconName) {
    var namespace = "http://www.w3.org/2000/svg";
    var definition = socialIcons[iconName];
    var icon = document.createElementNS(namespace, "svg");

    icon.classList.add("social-icon");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");

    Object.keys(definition.svg).forEach(function (attribute) {
      icon.setAttribute(attribute, definition.svg[attribute]);
    });

    definition.parts.forEach(function (part) {
      var shape = document.createElementNS(namespace, part.tag);

      Object.keys(part.attributes).forEach(function (attribute) {
        shape.setAttribute(attribute, part.attributes[attribute]);
      });

      icon.appendChild(shape);
    });

    return icon;
  }

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      if (!this._rendered) {
        this.render();
        this._rendered = true;
      }

      if (!this._listening) {
        document.addEventListener("keydown", this._handleKeydown);
        window.addEventListener("resize", this._handleResize);
        this._listening = true;
      }
    }

    disconnectedCallback() {
      document.removeEventListener("keydown", this._handleKeydown);
      window.removeEventListener("resize", this._handleResize);
      this._listening = false;
    }

    render() {
      var currentPage = getCurrentPage();
      var skipLink = document.createElement("a");
      var header = document.createElement("header");
      var primaryNavigation = document.createElement("nav");
      var brand = document.createElement("a");
      var desktopLinks = document.createElement("div");
      var menuButton = document.createElement("button");
      var mobileMenu = document.createElement("div");
      var mobileNavigation = document.createElement("nav");

      skipLink.className = "skip-link";
      skipLink.href = "#main-content";
      skipLink.textContent = "Skip to main content";

      primaryNavigation.className = "nav container";
      primaryNavigation.setAttribute("aria-label", "Primary navigation");

      brand.className = "brand";
      brand.href = "index.html";
      brand.textContent = "Saurabh Bhagchandani";

      desktopLinks.className = "nav-links desktop-nav";
      appendNavigationLinks(desktopLinks, currentPage);

      menuButton.className = "menu-toggle";
      menuButton.type = "button";
      menuButton.setAttribute("aria-label", "Open navigation menu");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-controls", "mobile-navigation");

      for (var line = 0; line < 3; line += 1) {
        menuButton.appendChild(document.createElement("span"));
      }

      mobileMenu.className = "mobile-menu";
      mobileMenu.id = "mobile-navigation";
      mobileMenu.hidden = true;

      mobileNavigation.className = "mobile-nav container";
      mobileNavigation.setAttribute("aria-label", "Mobile navigation");
      appendNavigationLinks(mobileNavigation, currentPage);

      primaryNavigation.append(brand, desktopLinks, menuButton);
      mobileMenu.appendChild(mobileNavigation);
      header.append(primaryNavigation, mobileMenu);
      this.replaceChildren(skipLink, header);

      this._menuButton = menuButton;
      this._mobileMenu = mobileMenu;
      this._setMenuOpen = function (isOpen) {
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
          "aria-label",
          isOpen ? "Close navigation menu" : "Open navigation menu"
        );
        mobileMenu.hidden = !isOpen;
      };

      menuButton.addEventListener("click", () => {
        var shouldOpen = menuButton.getAttribute("aria-expanded") !== "true";
        this._setMenuOpen(shouldOpen);

        if (shouldOpen) {
          var firstLink = mobileMenu.querySelector("a");

          if (firstLink) {
            firstLink.focus();
          }
        }
      });

      mobileMenu.addEventListener("click", (event) => {
        if (event.target.tagName === "A") {
          this._setMenuOpen(false);
        }
      });

      this._handleKeydown = (event) => {
        if (
          event.key === "Escape" &&
          menuButton.getAttribute("aria-expanded") === "true"
        ) {
          this._setMenuOpen(false);
          menuButton.focus();
        }
      };

      this._handleResize = () => {
        if (window.matchMedia("(min-width: 781px)").matches) {
          this._setMenuOpen(false);
        }
      };
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      if (this._rendered) {
        return;
      }

      var footer = document.createElement("footer");
      var connectSection = document.createElement("div");
      var connectInner = document.createElement("div");
      var heading = document.createElement("h2");
      var socialNavigation = document.createElement("nav");
      var copyrightSection = document.createElement("div");
      var copyright = document.createElement("p");

      footer.className = "site-footer";
      connectSection.className = "footer-connect";
      connectInner.className = "container footer-connect-inner";
      heading.textContent = "Connect with me";
      socialNavigation.className = "footer-social-links";
      socialNavigation.setAttribute("aria-label", "Social links");

      socialLinks.forEach(function (social) {
        var link = document.createElement("a");
        var label = document.createElement("span");

        link.className = "social-link social-link--" + social.icon;
        link.href = social.href;
        link.setAttribute("aria-label", social.label);
        link.title = social.label;

        if (social.external) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }

        label.className = "visually-hidden";
        label.textContent = social.label;
        link.append(createSocialIcon(social.icon), label);
        socialNavigation.appendChild(link);
      });

      copyrightSection.className = "footer-copyright";
      copyright.textContent =
        "Copyright \u00a9 " +
        new Date().getFullYear() +
        " Saurabh Bhagchandani.";

      connectInner.append(heading, socialNavigation);
      connectSection.appendChild(connectInner);
      copyrightSection.appendChild(copyright);
      footer.append(connectSection, copyrightSection);
      this.appendChild(footer);
      this._rendered = true;
    }
  }

  class PageBanner extends HTMLElement {
    connectedCallback() {
      if (this._rendered) {
        return;
      }

      var pageName = this.getAttribute("page") || "";
      var parentName = this.getAttribute("parent") || "";
      var parentHref = this.getAttribute("parent-href") || "";
      var banner = document.createElement("div");
      var inner = document.createElement("div");
      var title = document.createElement("p");
      var breadcrumb = document.createElement("nav");
      var list = document.createElement("ol");
      var homeItem = document.createElement("li");
      var homeLink = document.createElement("a");
      var currentItem = document.createElement("li");
      var separator = document.createElement("span");

      banner.className = "page-banner";
      inner.className = "container page-banner-inner";
      title.className = "page-banner-title";
      title.textContent = pageName;

      breadcrumb.className = "breadcrumb";
      breadcrumb.setAttribute("aria-label", "Breadcrumb");
      list.className = "breadcrumb-list";

      homeLink.href = "index.html";
      homeLink.textContent = "Home";
      homeItem.appendChild(homeLink);

      currentItem.className = "breadcrumb-current";
      currentItem.setAttribute("aria-current", "page");
      separator.className = "breadcrumb-separator";
      separator.setAttribute("aria-hidden", "true");
      separator.textContent = "\u203a";
      currentItem.append(separator, document.createTextNode(pageName));

      if (parentName && parentHref) {
  var parentItem = document.createElement("li");
  var parentLink = document.createElement("a");
  var parentSeparator = document.createElement("span");

  parentItem.className = "breadcrumb-current";

  parentSeparator.className = "breadcrumb-separator";
  parentSeparator.setAttribute("aria-hidden", "true");
  parentSeparator.textContent = "\u203a";

  parentLink.href = parentHref;
  parentLink.textContent = parentName;

  parentItem.append(parentSeparator, parentLink);
  list.append(homeItem, parentItem, currentItem);
} else {
  list.append(homeItem, currentItem);
} 

      breadcrumb.appendChild(list);
      inner.append(title, breadcrumb);
      banner.appendChild(inner);
      this.appendChild(banner);
      this._rendered = true;
    }
  }

  class PageHeading extends HTMLElement {
    connectedCallback() {
      if (this._rendered) {
        return;
      }

      var header = document.createElement("header");
      var eyebrow = document.createElement("p");
      var heading = document.createElement("h1");
      var description = document.createElement("p");

      header.className = "page-header";
      eyebrow.className = "eyebrow";
      eyebrow.textContent = this.getAttribute("eyebrow") || "";
      heading.textContent = this.getAttribute("heading") || "";
      description.textContent = this.getAttribute("description") || "";

      header.append(eyebrow, heading, description);
      this.appendChild(header);
      this._rendered = true;
    }
  }

  if (!customElements.get("site-header")) {
    customElements.define("site-header", SiteHeader);
  }

  if (!customElements.get("site-footer")) {
    customElements.define("site-footer", SiteFooter);
  }

  if (!customElements.get("page-banner")) {
    customElements.define("page-banner", PageBanner);
  }

  if (!customElements.get("page-heading")) {
    customElements.define("page-heading", PageHeading);
  }
})();
