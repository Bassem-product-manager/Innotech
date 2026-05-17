const header = document.querySelector("[data-header]");
const brand = document.querySelector(".brand");
const logo = document.querySelector(".brand-logo");
const mainNav = document.querySelector(".main-nav");
const navToggle = document.querySelector("[data-nav-toggle]");
const langMenus = Array.from(document.querySelectorAll("[data-lang-menu]"));
const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveNav = (sectionId) => {
  if (!sectionId) return;

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if (navSections.length) {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveNav(link.getAttribute("href").slice(1));
      closeMobileNav();
    });
  });

  navSections.forEach((section) => {
    section.addEventListener("click", () => setActiveNav(section.id));
  });

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveNav(visible.target.id);
        }
      },
      {
        rootMargin: "-38% 0px -48% 0px",
        threshold: [0.01, 0.2, 0.45, 0.7],
      }
    );

    navSections.forEach((section) => navObserver.observe(section));
  }
}

const setMobileNavOpen = (isOpen) => {
  if (!header || !navToggle) return;
  header.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
};

const closeMobileNav = () => setMobileNavOpen(false);

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    setMobileNavOpen(!header?.classList.contains("nav-open"));
  });

  document.addEventListener("click", (event) => {
    if (!header?.classList.contains("nav-open")) return;
    if (header.contains(event.target)) return;
    closeMobileNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });
}

const closeLanguageMenus = (exceptMenu = null) => {
  langMenus.forEach((menu) => {
    if (menu === exceptMenu) return;
    menu.classList.remove("is-open");
    menu.querySelector("[data-lang-toggle]")?.setAttribute("aria-expanded", "false");
  });
};

langMenus.forEach((menu) => {
  const toggle = menu.querySelector("[data-lang-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const willOpen = !menu.classList.contains("is-open");
    closeLanguageMenus(menu);
    menu.classList.toggle("is-open", willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
    closeMobileNav();
  });
});

document.addEventListener("click", (event) => {
  if (langMenus.some((menu) => menu.contains(event.target))) return;
  closeLanguageMenus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLanguageMenus();
  }
});

const updateHeaderShadow = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

window.addEventListener("scroll", updateHeaderShadow, { passive: true });
updateHeaderShadow();

const scrollTopButton = document.querySelector("[data-scroll-top]");

const updateScrollTopButton = () => {
  if (!scrollTopButton) return;
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 520);
};

if (scrollTopButton) {
  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", updateScrollTopButton, { passive: true });
  updateScrollTopButton();
}

window.addEventListener("load", () => {
  const target = window.location.hash ? document.querySelector(window.location.hash) : null;
  if (!target) return;

  const alignHashTarget = () => target.scrollIntoView({ block: "start" });

  requestAnimationFrame(alignHashTarget);
  window.setTimeout(alignHashTarget, 280);
  window.setTimeout(alignHashTarget, 900);
});

if (brand && logo) {
  logo.addEventListener("error", () => {
    brand.classList.add("logo-missing");
  });
}

const initPortfolioMarquees = () => {
  document.querySelectorAll(".portfolio-track").forEach((track) => {
    track
      .querySelectorAll('.portfolio-card[aria-hidden="true"], .portfolio-cta-card[aria-hidden="true"]')
      .forEach((duplicate) => duplicate.remove());

    const originals = Array.from(track.children).filter(
      (item) => item.classList.contains("portfolio-card") || item.classList.contains("portfolio-cta-card")
    );

    originals.forEach((item) => {
      const duplicate = item.cloneNode(true);
      duplicate.setAttribute("aria-hidden", "true");
      duplicate.querySelectorAll("a, button").forEach((control) => control.setAttribute("tabindex", "-1"));
      track.append(duplicate);
    });
  });
};

initPortfolioMarquees();

const runHeroTyping = () => {
  const heroContent = document.querySelector(".hero-content");
  const titleLines = document.querySelectorAll(".hero-content h1 .title-line");
  const description = document.querySelector(".hero-description");

  if (!heroContent || titleLines.length < 2 || !description) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    heroContent.classList.add("typing-complete");
    return;
  }

  const firstLineText = titleLines[0].textContent.trim();
  const secondLineStrong = titleLines[1].querySelector("strong");
  const secondLineAccent = secondLineStrong?.textContent.trim() || "";
  const secondLinePrefix = titleLines[1].textContent.replace(secondLineAccent, "");
  const descriptionText = description.textContent.replace(/\s+/g, " ").trim();
  const secondLineText = `${secondLinePrefix}${secondLineAccent}`;
  const prefixLength = Array.from(secondLinePrefix).length;

  titleLines[0].textContent = "";
  titleLines[1].textContent = "";
  description.textContent = "";
  heroContent.classList.add("is-typing");

  const typeText = (write, text, speed = 34) =>
    new Promise((resolve) => {
      const letters = Array.from(text);
      let index = 0;

      const tick = () => {
        write(letters.slice(0, index).join(""));
        index += 1;

        if (index <= letters.length) {
          window.setTimeout(tick, speed);
        } else {
          resolve();
        }
      };

      tick();
    });

  const writeSecondLine = (value) => {
    const letters = Array.from(value);
    const prefix = letters.slice(0, prefixLength).join("");
    const accent = letters.slice(prefixLength).join("");

    titleLines[1].replaceChildren(
      document.createTextNode(prefix),
      Object.assign(document.createElement("strong"), { textContent: accent })
    );
  };

  const startTyping = async () => {
    await typeText((value) => {
      titleLines[0].textContent = value;
    }, firstLineText, 38);
    await typeText(writeSecondLine, secondLineText, 40);
    await typeText((value) => {
      description.textContent = value;
    }, descriptionText, 13);
    heroContent.classList.add("typing-complete");
  };

  window.setTimeout(startTyping, 260);
};

runHeroTyping();

if (window.lucide) {
  window.lucide.createIcons();
}

const trackedActions = document.querySelectorAll("[data-track-event]");

trackedActions.forEach((action) => {
  action.addEventListener("click", () => {
    const eventName = action.dataset.trackEvent;
    if (!eventName) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName });

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName);
    }
  });
});

const faqItems = document.querySelectorAll(".faq-item");
const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentItem = button.closest(".faq-item");
    const isOpen = currentItem?.classList.contains("is-open");

    faqItems.forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen && currentItem) {
      currentItem.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const solutionTabs = document.querySelectorAll("[data-solution-tab]");
const solutionPanels = document.querySelectorAll("[data-solution-panel]");

const activateSolutionTab = (activeTab) => {
  const target = activeTab?.dataset.solutionTab;
  if (!target) return;

  solutionTabs.forEach((tab) => {
    const isActive = tab === activeTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  solutionPanels.forEach((panel) => {
    const isActive = panel.dataset.solutionPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

solutionTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateSolutionTab(tab));

  tab.addEventListener("keydown", (event) => {
    const isNext = event.key === "ArrowLeft" || event.key === "ArrowDown";
    const isPrevious = event.key === "ArrowRight" || event.key === "ArrowUp";

    if (!isNext && !isPrevious) return;

    event.preventDefault();
    const nextIndex = isNext
      ? (index + 1) % solutionTabs.length
      : (index - 1 + solutionTabs.length) % solutionTabs.length;
    const nextTab = solutionTabs[nextIndex];

    nextTab.focus();
    activateSolutionTab(nextTab);
  });
});

const serviceTabs = document.querySelectorAll("[data-service-tab]");
const servicePanels = document.querySelectorAll("[data-service-panel]");

const activateServiceTab = (activeTab) => {
  const target = activeTab?.dataset.serviceTab;
  if (!target) return;

  serviceTabs.forEach((tab) => {
    const isActive = tab === activeTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  servicePanels.forEach((panel) => {
    const isActive = panel.dataset.servicePanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

serviceTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateServiceTab(tab));

  tab.addEventListener("keydown", (event) => {
    const isNext = event.key === "ArrowLeft" || event.key === "ArrowDown";
    const isPrevious = event.key === "ArrowRight" || event.key === "ArrowUp";

    if (!isNext && !isPrevious) return;

    event.preventDefault();
    const nextIndex = isNext
      ? (index + 1) % serviceTabs.length
      : (index - 1 + serviceTabs.length) % serviceTabs.length;
    const nextTab = serviceTabs[nextIndex];

    nextTab.focus();
    activateServiceTab(nextTab);
  });
});

const storySections = document.querySelectorAll(
  ".message-section, .ai-content-section, .why-section, .portfolio-section, .process-section, .services-section, .solutions-section, .stats-section"
);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js-enabled");

const revealElements = document.querySelectorAll(
  "#process .section-heading, #process .timeline-step, #contact .contact-copy, #contact .contact-card, #contact .contact-form, .faq-intro, .faq-item, .footer-brand, .footer-column"
);

if (revealElements.length) {
  revealElements.forEach((element, index) => {
    element.classList.add("reveal-ready");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("reveal-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("reveal-visible", entry.isIntersecting);
        });
      },
      {
        rootMargin: "0px 0px -8%",
        threshold: 0.14,
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }
}

const formatStatNumber = (value, stat) => {
  const suffix = stat.dataset.suffix || "";
  const format = stat.dataset.format;

  if (format === "compact") {
    if (value >= 1000000) return `1M${suffix}`;
    if (value >= 1000) return `${Math.floor(value / 1000)}K${suffix}`;
  }

  return `${Math.floor(value)}${suffix}`;
};

const animateStats = (section) => {
  if (!section || section.classList.contains("stats-counted")) return;
  section.classList.add("stats-counted");

  const numbers = section.querySelectorAll(".stat-number");
  const duration = 2400;

  numbers.forEach((stat) => {
    const target = Number(stat.dataset.target || 0);

    if (!target || prefersReducedMotion) {
      stat.textContent = formatStatNumber(target, stat);
      return;
    }

    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      stat.textContent = formatStatNumber(current, stat);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        stat.textContent = formatStatNumber(target, stat);
      }
    };

    requestAnimationFrame(tick);
  });
};

if (storySections.length) {
  if ("IntersectionObserver" in window) {
    const storyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
          if (!entry.isIntersecting) return;
          if (entry.target.classList.contains("stats-section")) {
            animateStats(entry.target);
          }
        });
      },
      { threshold: 0.28 }
    );

    storySections.forEach((section) => storyObserver.observe(section));
  } else {
    storySections.forEach((section) => {
      section.classList.add("is-visible");
      if (section.classList.contains("stats-section")) {
        animateStats(section);
      }
    });
  }
}

const aiServiceCards = document.querySelectorAll(".ai-service-card");

if (aiServiceCards.length) {
  if ("IntersectionObserver" in window) {
    const aiCardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-revealed", entry.isIntersecting);
        });
      },
      {
        rootMargin: "0px 0px -8%",
        threshold: 0.18,
      }
    );

    aiServiceCards.forEach((card) => aiCardObserver.observe(card));
  } else {
    aiServiceCards.forEach((card) => card.classList.add("is-revealed"));
  }
}

const initAiServiceShowcase = () => {
  const showcase = document.querySelector("[data-ai-service-showcase]");
  if (!showcase) return;

  const cards = Array.from(showcase.querySelectorAll(".ai-service-card"));
  const copyPanel = showcase.querySelector(".ai-service-copy");

  if (!cards.length) return;

  cards.forEach((card) => card.classList.add("is-revealed"));

  let activeIndex = -1;

  const updateActiveContent = (index) => {
    if (index === activeIndex) return;
    activeIndex = index;

    cards.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
      item.classList.toggle("is-past", itemIndex < index);
    });
  };

  const clearInlineCardStyles = () => {
    if (copyPanel) {
      copyPanel.style.transform = "";
      copyPanel.style.inset = "";
    }

    cards.forEach((card) => {
      card.style.transform = "";
      card.style.opacity = "";
      card.style.filter = "";
      card.style.zIndex = "";
      card.classList.remove("is-past");
    });
  };

  const setupFallbackObserver = () => {
    clearInlineCardStyles();
    updateActiveContent(0);

    let ticking = false;

    const updateFromScroll = () => {
      ticking = false;

      const targetY = window.innerHeight * 0.42;
      let nextIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardY = rect.top + rect.height * 0.4;
        const distance = Math.abs(cardY - targetY);

        if (distance < bestDistance) {
          bestDistance = distance;
          nextIndex = index;
        }
      });

      updateActiveContent(nextIndex);
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  };

  setupFallbackObserver();
};

initAiServiceShowcase();
