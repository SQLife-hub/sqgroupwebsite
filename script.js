const translatable = document.querySelectorAll("[data-zh][data-en]");
const languageToggle = document.querySelector("[data-lang-toggle]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const form = document.querySelector("#contact-form");
const revealItems = document.querySelectorAll(".reveal");
let activeLanguage = "zh";

function setLanguage(language) {
  activeLanguage = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  translatable.forEach((element) => {
    element.textContent = element.dataset[language];
  });
  languageToggle.textContent = language === "zh" ? "EN" : "中文";
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    setLanguage(activeLanguage === "zh" ? "en" : "zh");
  });
}

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
