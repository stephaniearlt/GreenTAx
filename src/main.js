(function (html) {
  "use strict";

  // Replace "no-js" class with "js"
  html.className = html.className.replace(/\bno-js\b/g, "") + " js";

  /* Preloader */
  const ssPreloader = () => {
    const body = document.body;
    const preloader = document.querySelector("#preloader");
    const details = document.querySelector(".s-details");

    if (!(preloader && details)) return;

    window.addEventListener("load", () => {
      body.classList.remove("ss-preload");
      body.classList.add("ss-loaded");

      preloader.addEventListener("transitionstart", (e) => {
        if (e.target.matches("#preloader")) window.scrollTo(0, 0);
      });

      preloader.addEventListener("transitionend", (e) => {
        if (e.target.matches("#preloader")) {
          details.style.bottom = `${
            window.innerHeight - details.offsetHeight
          }px`;
          body.classList.add("ss-show");
          e.target.style.display = "none";
        }
      });
    });

    window.addEventListener("beforeunload", () =>
      body.classList.remove("ss-show")
    );
  };

  /* Modal */
  const ssModal = () => {
    const modal = document.querySelector(".ss-modal");
    const trigger = document.querySelector(".ss-modal-trigger");
    const closeButton = document.querySelector(".ss-modal__close");

    if (!(modal && trigger && closeButton)) return;

    const toggleModal = () => modal.classList.toggle("show-modal");

    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", (e) => {
      if (e.target === modal) toggleModal();
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "Escape") modal.classList.remove("show-modal");
    });
  };

  /* Tabs */
  const sstabs = () => {
    const tabList = document.querySelector(".tab-nav__list");
    const tabPanels = document.querySelectorAll(".tab-content__item");
    const tabItems = document.querySelectorAll(".tab-nav__list li");

    if (!(tabList && tabPanels.length && tabItems.length)) return;

    const tabLinks = Array.from(tabItems).map((item, index) => {
      const link = item.querySelector("a");
      item.setAttribute("role", "presentation");

      const anchor = link.getAttribute("href").split("#")[1];
      const attributes = {
        id: `tab-link-${index}`,
        role: "tab",
        tabIndex: index === 0 ? "0" : "-1",
        "aria-selected": index === 0 ? "true" : "false",
        "aria-controls": anchor,
      };

      Object.keys(attributes).forEach((key) =>
        link.setAttribute(key, attributes[key])
      );
      if (index === 0) link.setAttribute("data-tab-active", "");

      link.addEventListener("focus", () => tabClickEvent(link, index));
      link.addEventListener("keydown", (e) =>
        handleKeyboardEvent(link, index, e)
      );

      return link;
    });

    tabPanels.forEach((panel, i) => {
      const attributes = {
        role: "tabpanel",
        "aria-hidden": i === 0 ? "false" : "true",
        "aria-labelledby": `tab-link-${i}`,
      };
      Object.keys(attributes).forEach((key) =>
        panel.setAttribute(key, attributes[key])
      );
      if (i === 0) panel.setAttribute("data-tab-active", "");
    });

    const tabClickEvent = (link, index) => {
      tabLinks.forEach((tabLink) => {
        tabLink.setAttribute("tabindex", "-1");
        tabLink.setAttribute("aria-selected", "false");
        tabLink.removeAttribute("data-tab-active");
      });

      link.setAttribute("tabindex", "0");
      link.setAttribute("aria-selected", "true");
      link.setAttribute("data-tab-active", "");

      tabPanels.forEach((panel, i) => {
        panel.setAttribute("aria-hidden", i === index ? "false" : "true");
        panel.toggleAttribute("data-tab-active", i === index);
      });

      window.dispatchEvent(new Event("resize"));
    };

    const handleKeyboardEvent = (link, index, e) => {
      const { keyCode } = e;
      const prevTab = tabLinks[index - 1];
      const nextTab = tabLinks[index + 1];

      if (keyCode === 9) {
        // TAB
        if (e.shiftKey) {
          // SHIFT + TAB
          e.preventDefault();
          if (document.activeElement === tabLinks[0]) {
            // If focus is on first tab, move to last global focusable element
            document.querySelector("main").focus();
          } else if (document.activeElement === tabPanels[index]) {
            // Focus on last tab: Moves to the first focusable element in the content
            tabPanels[index]
              .querySelector("a, button, input, [tabindex]")
              .focus();
          } else if (prevTab) {
            prevTab.focus();
          }
        } else {
          // TAB
          e.preventDefault();
          if (document.activeElement === tabLinks[tabLinks.length - 1]) {
            // If focus is on last tab, jump to first focusable element in content
            tabPanels[index]
              .querySelector("a, button, input, [tabindex]")
              .focus();
          } else if (nextTab) {
            nextTab.focus();
          }
        }
      } else if (keyCode === 37 && prevTab) {
        // Left arrow
        prevTab.focus();
        e.preventDefault();
      } else if (keyCode === 39 && nextTab) {
        // Right arrow
        nextTab.focus();
        e.preventDefault();
      } else if (keyCode === 13) {
        // ENTER
        link.click();
      }
    };
  };

  document.addEventListener("DOMContentLoaded", sstabs);

  /* Smooth Scrolling */
  const ssMoveTo = () => {
    const triggers = document.querySelectorAll(".smoothscroll");

    if (!triggers.length) return;

    const smoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", smoothScroll);
    });
  };

  /* Back to Top */
  const ssBackToTop = () => {
    const pxShow = 800;
    const goTopButton = document.querySelector(".ss-go-top");

    if (!goTopButton) return;

    const scrollToTop = () => {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    };

    const toggleVisibility = () => {
      goTopButton.classList.toggle("link-is-visible", window.scrollY >= pxShow);
    };

    window.addEventListener("scroll", toggleVisibility);
    goTopButton.addEventListener("click", scrollToTop);
    toggleVisibility();
  };

  /* Revealing Effect */
  const ssRevealingEffect = () => {
    const intro = document.querySelector(".s-intro");
    const details = document.querySelector(".s-details");
    if (!(intro && details)) return;

    const checkpoint = intro.offsetHeight;
    window.addEventListener("scroll", () => {
      const opacity = Math.max(0, 1 - window.pageYOffset / checkpoint);
      details.style.setProperty("--overlay-opacity", opacity);
    });

    window.addEventListener("resize", () => {
      details.style.bottom = `${window.innerHeight - details.offsetHeight}px`;
    });
  };

  /* Initialize */
  (function ssInit() {
    ssPreloader();
    ssModal();
    sstabs();
    ssMoveTo();
    ssBackToTop();
    ssRevealingEffect();
  })();
})(document.documentElement);
