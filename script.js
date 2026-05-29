const translatable = document.querySelectorAll("[data-zh][data-en]");
const languageToggle = document.querySelector("[data-lang-toggle]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const form = document.querySelector("#contact-form");
const revealItems = document.querySelectorAll(".reveal");
const progressBar = document.createElement("div");
const isLocalFile = window.location.protocol === "file:";
const cleanPath = window.location.pathname.replace(/\/$/, "") || "/";
let activeLanguage = cleanPath === "/zh" || cleanPath.startsWith("/zh/") ? "zh" : "en";
const pageKind = document.body.dataset.pageKind || (document.body.classList.contains("life-page")
  ? "legacy"
  : document.body.classList.contains("general-page")
    ? "gi"
    : "home");
const seoCopy = {
  home: {
    en: {
      title: "SQ Group Malaysia | Estate Planning & General Insurance",
      description:
        "SQ Group Malaysia connects you to SQ Life Consultancy for estate planning and SQ General PLT for general insurance support in Kuala Lumpur.",
    },
    zh: {
      title: "SQ Group Malaysia | 资产传承与一般保险",
      description: "SQ Group Malaysia 提供两个服务入口：SQ Life Consultancy 处理资产传承与遗产事务，SQ General PLT 协助一般保险安排。",
    },
  },
  legacy: {
    en: {
      title: "SQ Life Consultancy | Estate Planning Malaysia",
      description:
        "SQ Life Consultancy in Kuala Lumpur helps families and businesses with estate planning, will and trust planning, estate administration, and asset unfreezing.",
    },
    zh: {
      title: "SQ Life Consultancy | 资产传承与遗产处理",
      description: "SQ Life Consultancy 协助个人、家庭及企业梳理资产传承、遗嘱信托规划、遗产处理与资产解冻流程。",
    },
  },
  gi: {
    en: {
      title: "SQ General PLT | General Insurance Agency Malaysia",
      description:
        "SQ General PLT in Kuala Lumpur helps individuals, families, and businesses arrange motor, home, travel, personal accident, business, and engineering insurance.",
    },
    zh: {
      title: "SQ General PLT | 一般保险安排",
      description: "SQ General PLT 协助个人、家庭及企业安排汽车、房屋、旅游、个人意外、商业与工程保险。",
    },
  },
};

function routeForLanguage(language) {
  let path = cleanPath.replace(/\.html$/, "");
  if (path.endsWith("/sq-life")) path = "/legacy";
  if (path.endsWith("/sq-general")) path = "/gi";
  if (path === "/life") path = "/legacy";
  if (path === "/general") path = "/gi";

  if (language === "zh") {
    if (path === "/") return "/zh";
    return path.startsWith("/zh") ? path : `/zh${path}`;
  }

  if (path === "/zh") return "/";
  if (path.startsWith("/zh/")) return path.slice(3);
  return path;
}

function updateSeoLanguage(language) {
  const canonical = document.querySelector("link[rel='canonical']");
  const ogUrl = document.querySelector("meta[property='og:url']");
  const description = document.querySelector("meta[name='description']");
  const ogTitle = document.querySelector("meta[property='og:title']");
  const ogDescription = document.querySelector("meta[property='og:description']");
  const baseUrl = `https://www.sqgroup.com.my${routeForLanguage(language)}`;
  const copy = {
    title: document.body.dataset[`seoTitle${language === "zh" ? "Zh" : "En"}`] || seoCopy[pageKind]?.[language]?.title || document.title,
    description:
      document.body.dataset[`seoDescription${language === "zh" ? "Zh" : "En"}`] ||
      seoCopy[pageKind]?.[language]?.description ||
      description?.getAttribute("content") ||
      "",
  };
  if (canonical) canonical.setAttribute("href", baseUrl);
  if (ogUrl) ogUrl.setAttribute("content", baseUrl);
  document.title = copy.title;
  if (description) description.setAttribute("content", copy.description);
  if (ogTitle) ogTitle.setAttribute("content", copy.title);
  if (ogDescription) ogDescription.setAttribute("content", copy.description);
}

function updateLocalizedLinks(language) {
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }
    if (language === "zh") {
      if (href === "/") {
        link.setAttribute("href", "/zh");
      } else if (href.startsWith("/") && !href.startsWith("/zh")) {
        link.setAttribute("href", `/zh${href}`);
      }
      return;
    }
    if (href === "/zh") {
      link.setAttribute("href", "/");
    } else if (href.startsWith("/zh/")) {
      link.setAttribute("href", href.slice(3));
    }
  });
}

function setLanguage(language) {
  activeLanguage = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  translatable.forEach((element) => {
    element.textContent = element.dataset[language];
  });
  if (languageToggle) {
    languageToggle.textContent = language === "zh" ? "EN" : "中文";
  }
  updateSeoLanguage(language);
  updateLocalizedLinks(language);
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    const nextLanguage = activeLanguage === "zh" ? "en" : "zh";
    if (isLocalFile) {
      setLanguage(nextLanguage);
      return;
    }
    window.location.href = routeForLanguage(nextLanguage);
  });
}

setLanguage(activeLanguage);

progressBar.className = "scroll-progress";
progressBar.setAttribute("aria-hidden", "true");
document.body.prepend(progressBar);

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (nav && navToggle) {
  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const service = formData.get("service");
    const brand = document.querySelector(".brand-tab.active span")?.textContent || "SQ";
    const message =
      activeLanguage === "zh"
        ? `你好，我想咨询 ${brand}。\n姓名：${name}\n电话：${phone}\n服务类型：${service}`
        : `Hello, I would like to enquire with ${brand}.\nName: ${name}\nPhone: ${phone}\nService type: ${service}`;
    window.open(`https://wa.me/60102761236?text=${encodeURIComponent(message)}`, "_blank", "noreferrer");
  });
}

if (document.querySelector("#year")) {
  document.querySelector("#year").textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => {
  if (item.getBoundingClientRect().top < window.innerHeight * 0.94) {
    item.classList.add("is-visible");
    return;
  }
  revealObserver.observe(item);
});
