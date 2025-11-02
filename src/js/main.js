/* Fermentierra global JavaScript */
const COMPONENT_ATTR = "data-src";
const LANGUAGE_STORAGE_KEY = "fermentierra-lang";
const EMAIL_ROUTES = {
  tasting: "degustation@fermentierra.com",
  subscription: "abonnements@fermentierra.com",
  cocreation: "atelier@fermentierra.com",
  training: "formation@fermentierra.com",
  quote: "devis@fermentierra.com",
};
let currentDictionary = {};

/**
 * Load HTML components referenced with the data-src attribute.
 */
async function loadComponents() {
  const componentHolders = document.querySelectorAll(`[${COMPONENT_ATTR}]`);
  for (const holder of componentHolders) {
    const src = holder.getAttribute(COMPONENT_ATTR);
    try {
      const response = await fetch(src);
      const markup = await response.text();
      holder.innerHTML = markup;
    } catch (error) {
      console.error(`Erreur lors du chargement du composant ${src}`, error);
    }
  }
}

/**
 * Retrieve translation file matching the language code.
 * @param {string} lang
 */
async function fetchTranslations(lang) {
  const fallback = "fr";
  try {
    const response = await fetch(`assets/lang/${lang}.json`);
    if (!response.ok) throw new Error("Lang file not found");
    return await response.json();
  } catch (error) {
    if (lang !== fallback) {
      return fetchTranslations(fallback);
    }
    console.warn("Aucune traduction disponible, retour au français.");
    return {};
  }
}

/**
 * Apply translations to DOM nodes with data-i18n attributes.
 */
function applyTranslations(dictionary) {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const value = key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), dictionary);
    if (typeof value === "string") {
      node.style.opacity = "0";
      requestAnimationFrame(() => {
        node.textContent = value;
        node.style.opacity = "1";
      });
    }
  });
}

/**
 * Setup language selector interactions.
 */
function setupLanguageSelector(dictionary) {
  currentDictionary = dictionary;
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const lang = event.currentTarget.dataset.language;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      const newDictionary = await fetchTranslations(lang);
      currentDictionary = newDictionary;
      applyTranslations(currentDictionary);
      const html = document.documentElement;
      html.setAttribute("lang", lang);
      const current = document.querySelector("#languageDropdown [data-i18n='language.current']");
      if (current) {
        current.textContent = lang.toUpperCase();
      }
    });
  });
  applyTranslations(currentDictionary);
}

/**
 * Validate contact forms and simulate routing to the correct mailbox.
 */
function initContactForms() {
  const forms = document.querySelectorAll("form.contact-form");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add("was-validated");
      if (!form.checkValidity()) {
        return;
      }
      const formData = new FormData(form);
      const interest = formData.get("interest");
      const email = EMAIL_ROUTES[interest] || "bonjour@fermentierra.com";
      const subject = encodeURIComponent(`Demande ${interest}`);
      const body = encodeURIComponent(`Nom : ${formData.get("name")}\nEtablissement : ${formData.get("establishment") || "-"}\nEmail : ${formData.get("email")}\nTéléphone : ${formData.get("phone") || "-"}\nMessage : ${formData.get("message") || "-"}`);
      // Launch the user's email client while also showing confirmation.
      window.open(`mailto:${email}?subject=${subject}&body=${body}`);
      const successMessage = form.parentElement.querySelector("[data-success-message]");
      if (successMessage) {
        successMessage.classList.remove("d-none");
      }
      form.reset();
      form.classList.remove("was-validated");
    });
  });
}

/**
 * Floating callback widget appearing on every page.
 */
function initCallbackWidget() {
  if (document.querySelector("[data-callback-widget]")) return;
  const container = document.createElement("div");
  container.className = "floating-callback";
  container.setAttribute("data-callback-widget", "true");
  container.innerHTML = `
    <button type="button" class="btn" aria-haspopup="true" aria-expanded="false">
      <span aria-hidden="true">📞</span>
      <span data-i18n="callback.label">Être rappelé</span>
    </button>
  `;
  document.body.appendChild(container);

  const formWrapper = document.createElement("div");
  formWrapper.className = "callback-form card d-none";
  formWrapper.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h2 class="h6 mb-1" data-i18n="callback.title">Planifier un rappel</h2>
          <p class="small mb-0" data-i18n="callback.subtitle">Nos équipes vous contactent dans l'heure ouvrée.</p>
        </div>
        <button type="button" class="btn-close" aria-label="Fermer"></button>
      </div>
      <form class="callback-inner needs-validation" novalidate>
        <div class="mb-3">
          <label class="form-label" for="callbackName" data-i18n="callback.name">Nom</label>
          <input class="form-control" id="callbackName" name="name" required>
          <div class="invalid-feedback" data-i18n="callback.nameError">Indiquez votre nom.</div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="callbackPhone" data-i18n="callback.phone">Téléphone</label>
          <input class="form-control" id="callbackPhone" name="phone" type="tel" required>
          <div class="invalid-feedback" data-i18n="callback.phoneError">Numéro requis pour vous rappeler.</div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="callbackTime" data-i18n="callback.time">Créneau souhaité</label>
          <input class="form-control" id="callbackTime" name="time" type="datetime-local">
        </div>
        <button class="btn btn-success w-100" type="submit" data-i18n="callback.submit">Demander un rappel</button>
      </form>
      <div class="alert alert-success d-none mt-3" role="status" data-i18n="callback.confirmation">Merci ! Nous vous appelons très vite.</div>
    </div>
  `;
  document.body.appendChild(formWrapper);

  const toggleButton = container.querySelector("button");
  const closeButton = formWrapper.querySelector(".btn-close");
  const innerForm = formWrapper.querySelector("form");

  toggleButton.addEventListener("click", () => {
    formWrapper.classList.toggle("d-none");
    const expanded = formWrapper.classList.contains("d-none") ? "false" : "true";
    toggleButton.setAttribute("aria-expanded", expanded);
  });

  closeButton.addEventListener("click", () => {
    formWrapper.classList.add("d-none");
    toggleButton.setAttribute("aria-expanded", "false");
  });

  innerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    innerForm.classList.add("was-validated");
    if (!innerForm.checkValidity()) return;
    formWrapper.querySelector("[data-i18n='callback.confirmation']").classList.remove("d-none");
    innerForm.reset();
    innerForm.classList.remove("was-validated");
  });
}

/**
 * Load product catalogue onto the listing page.
 */
async function renderProducts() {
  const container = document.querySelector("[data-products]");
  if (!container) return;
  const response = await fetch("assets/data/products.json");
  const { products = [] } = await response.json();
  const grouped = products.reduce((acc, product) => {
    const key = product.range || "Autres";
    acc[key] = acc[key] || [];
    acc[key].push(product);
    return acc;
  }, {});

  container.innerHTML = Object.entries(grouped)
    .map(([range, items]) => {
      const cards = items
        .map(
          (item) => `
          <div class="col-md-6 col-lg-4">
            <article class="card product-card h-100" aria-labelledby="product-${item.id}">
              <img class="card-img-top" src="${item.image}" alt="${item.name}" loading="lazy">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h3 id="product-${item.id}" class="h5">${item.name}</h3>
                  <span class="badge badge-soft">${item.usage}</span>
                </div>
                <p class="flex-grow-1">${item.description}</p>
                <div class="d-flex gap-2 mt-3">
                  <a class="btn btn-success flex-grow-1" href="product.html?id=${item.id}" data-i18n="products.view">Voir la fiche</a>
                  <button class="btn btn-outline-success" type="button" data-product="${item.id}" data-action="add">+</button>
                </div>
              </div>
            </article>
          </div>
        `
        )
        .join("");
      return `
        <section class="mb-5">
          <header class="mb-4">
            <h2 class="h3">${range}</h2>
          </header>
          <div class="row g-4">${cards}</div>
        </section>
      `;
    })
    .join("");

  container.querySelectorAll("[data-action='add']").forEach((button) => {
    button.addEventListener("click", () => {
      const toast = document.querySelector("[data-cart-toast]");
      if (toast) {
        toast.classList.remove("d-none");
        toast.querySelector("[data-i18n='products.added']").classList.remove("d-none");
        setTimeout(() => toast.classList.add("d-none"), 2500);
      }
    });
  });
  applyTranslations(currentDictionary);
}

/**
 * Render individual product detail from query parameter.
 */
async function renderProductDetail() {
  const detailContainer = document.querySelector("[data-product-detail]");
  if (!detailContainer) return;
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const response = await fetch("assets/data/products.json");
  const { products = [] } = await response.json();
  const product = products.find((item) => item.id === productId) || products[0];
  if (!product) return;

  document.title = `${product.name} - Fermentierra`;
  detailContainer.innerHTML = `
    <div class="row g-5 align-items-start">
      <div class="col-lg-6">
        <img class="img-fluid rounded" src="${product.image}" alt="${product.name}">
      </div>
      <div class="col-lg-6">
        <h1 class="display-6 mb-3">${product.name}</h1>
        <p class="lead">${product.description}</p>
        <div class="mb-4">
          <span class="badge badge-soft me-2">${product.range}</span>
          <span class="badge badge-soft">${product.usage}</span>
        </div>
        <div class="card card-highlight mb-4">
          <div class="card-body">
            <h2 class="h5" data-i18n="product.ingredients">Ingrédients clés</h2>
            <ul class="mb-0">
              ${product.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="timeline mb-4">
          <div class="timeline-step">
            <h3 class="h6 mb-1" data-i18n="product.process">Processus de fermentation</h3>
            <p class="mb-0">${product.process}</p>
          </div>
          <div class="timeline-step">
            <h3 class="h6 mb-1" data-i18n="product.packaging">Conditionnements disponibles</h3>
            <p class="mb-0">${product.packaging}</p>
          </div>
          <div class="timeline-step">
            <h3 class="h6 mb-1" data-i18n="product.pairings">Associations culinaires</h3>
            <p class="mb-0">${product.pairings}</p>
          </div>
        </div>
        <div class="d-flex flex-column flex-md-row gap-3">
          <button class="btn btn-success btn-lg" type="button" data-i18n="product.addToCart">Ajouter au panier</button>
          <a class="btn btn-outline-success btn-lg" href="#contact" data-i18n="product.requestQuote">Demander un devis</a>
        </div>
      </div>
    </div>
  `;
  applyTranslations(currentDictionary);
}

async function renderCaseStudies() {
  const container = document.querySelector("[data-case-studies]");
  if (!container) return;
  const response = await fetch("assets/data/case-studies.json");
  const { studies = [] } = await response.json();
  container.innerHTML = studies
    .map(
      (study) => `
      <div class="col-md-6 col-lg-4">
        <article class="card h-100 case-study-card" aria-labelledby="case-${study.id}">
          <img class="card-img-top" src="${study.image}" alt="${study.client}">
          <div class="card-body d-flex flex-column">
            <h3 id="case-${study.id}" class="h5">${study.client}</h3>
            <p class="small text-muted" data-i18n="case.problem">Problème</p>
            <p>${study.problem}</p>
            <p class="small text-muted" data-i18n="case.solution">Solution</p>
            <p>${study.solution}</p>
            <p class="small text-muted" data-i18n="case.results">Résultats</p>
            <p>${study.results}</p>
            <blockquote class="blockquote mt-auto">
              <p class="mb-0">“${study.testimonial}”</p>
              <footer class="blockquote-footer">${study.author}</footer>
            </blockquote>
          </div>
        </article>
      </div>
    `
    )
    .join("");
  applyTranslations(currentDictionary);
}

async function renderCaseStudyCarousel() {
  const carousel = document.querySelector("[data-case-carousel]");
  if (!carousel) return;
  const response = await fetch("assets/data/case-studies.json");
  const { studies = [] } = await response.json();
  carousel.innerHTML = studies
    .map(
      (study, index) => `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <div class="d-flex align-items-center gap-4">
          <img src="${study.image}" class="rounded" alt="${study.client}" width="120" height="90">
          <div>
            <p class="mb-1">${study.solution}</p>
            <small class="text-muted">${study.client}</small>
          </div>
        </div>
      </div>
    `
    )
    .join("");
  applyTranslations(currentDictionary);
}

async function renderBlogPosts() {
  const container = document.querySelector("[data-blog-list]");
  if (!container) return;
  const response = await fetch("assets/data/blog.json");
  const { posts = [] } = await response.json();
  container.innerHTML = posts
    .map(
      (post) => `
      <div class="col-md-6 col-lg-4">
        <article class="card blog-card" aria-labelledby="blog-${post.slug}">
          <img src="${post.image}" class="card-img-top" alt="${post.title}">
          <div class="card-body d-flex flex-column">
            <span class="badge badge-soft align-self-start mb-3">${post.category}</span>
            <h3 id="blog-${post.slug}" class="h5">${post.title}</h3>
            <p class="text-muted small">${post.date}</p>
            <p class="flex-grow-1">${post.excerpt}</p>
            <a class="btn btn-link px-0" href="${post.url}" target="_blank" rel="noopener" data-i18n="blog.readMore">Lire l'article</a>
          </div>
        </article>
      </div>
    `
    )
    .join("");
  applyTranslations(currentDictionary);
}

async function renderTraining() {
  const container = document.querySelector("[data-training-list]");
  if (!container) return;
  const response = await fetch("assets/data/training.json");
  const { sessions = [] } = await response.json();
  container.innerHTML = sessions
    .map(
      (session) => `
      <div class="col-md-6">
        <article class="card h-100 border-0 shadow-sm" aria-labelledby="training-${session.id}">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h3 id="training-${session.id}" class="h5">${session.title}</h3>
                <p class="text-muted mb-0">${session.date}</p>
              </div>
              <span class="badge badge-soft">${session.format}</span>
            </div>
            <p class="flex-grow-1">${session.description}</p>
            <a class="btn btn-success mt-3" href="${session.registration}" target="_blank" rel="noopener" data-i18n="training.register">Je m'inscris</a>
          </div>
        </article>
      </div>
    `
    )
    .join("");
  applyTranslations(currentDictionary);
}

async function renderProductPreview() {
  const previewContainer = document.querySelector("[data-products-preview]");
  if (!previewContainer) return;
  const response = await fetch("assets/data/products.json");
  const { products = [] } = await response.json();
  previewContainer.innerHTML = products.slice(0, 3)
    .map(
      (item) => `
        <div class="col-md-4">
          <article class="card product-card h-100">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
              <h3 class="h5">${item.name}</h3>
              <p class="small text-muted">${item.range}</p>
              <p>${item.description}</p>
              <a class="btn btn-link px-0" href="product.html?id=${item.id}" data-i18n="products.view">Voir la fiche</a>
            </div>
          </article>
        </div>
      `
    )
    .join("");
  applyTranslations(currentDictionary);
}

async function renderBlogPreview() {
  const container = document.querySelector("[data-blog-preview]");
  if (!container) return;
  const response = await fetch("assets/data/blog.json");
  const { posts = [] } = await response.json();
  container.innerHTML = posts.slice(0, 2)
    .map(
      (post) => `
        <div class="col-12">
          <article class="p-3 border rounded bg-white h-100">
            <h3 class="h6">${post.title}</h3>
            <p class="mb-1 small text-muted">${post.category} • ${post.date}</p>
            <p class="mb-2">${post.excerpt}</p>
            <a class="btn btn-sm btn-outline-success" href="${post.url}" target="_blank" rel="noopener" data-i18n="blog.readMore">Lire l'article</a>
          </article>
        </div>
      `
    )
    .join("");
  applyTranslations(currentDictionary);
}

async function initPageSpecificFeatures() {
  await renderProducts();
  await renderProductDetail();
  await renderCaseStudies();
  await renderCaseStudyCarousel();
  await renderBlogPosts();
  await renderTraining();
  await renderProductPreview();
  await renderBlogPreview();
}

async function init() {
  await loadComponents();
  const lang = localStorage.getItem(LANGUAGE_STORAGE_KEY) || document.documentElement.lang || "fr";
  const dictionary = await fetchTranslations(lang);
  setupLanguageSelector(dictionary);
  document.documentElement.setAttribute("lang", lang);
  const current = document.querySelector("#languageDropdown [data-i18n='language.current']");
  if (current) {
    current.textContent = lang.toUpperCase();
  }
  initContactForms();
  initCallbackWidget();
  initPageSpecificFeatures();

  const yearHolder = document.getElementById("currentYear");
  if (yearHolder) {
    yearHolder.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
