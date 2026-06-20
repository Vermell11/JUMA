# Fundación Juan Una Mano Ayuda — Sitio web

Sitio web **one-page**, **bilingüe (ES/EN)**, construido con **Astro + Tailwind CSS v4**.
Diseño premium, humano y minimalista, con animaciones suaves y accesibles
(respeta `prefers-reduced-motion`) y 100% responsive.

## 🗂️ Estructura del repositorio

```
JUMA/
├── frontend/     ← el sitio web (Astro + Tailwind). Aquí vive todo el código.
├── backend/      ← reservado para lógica de servidor futura (ver backend/README.md).
├── README.md
└── .gitignore
```

> ℹ️ Hoy el sitio es **100% estático**, así que **no hay backend todavía**.
> La carpeta `backend/` queda reservada para cuando se necesite (donaciones online,
> formularios con envío de correo, panel de administración, etc.).

## 🚀 Cómo ejecutarlo (también al cambiar de PC)

Solo necesitas tener **Node.js** instalado. Todo se ejecuta **dentro de `frontend/`**:

```bash
git clone https://github.com/Vermell11/JUMA.git
cd JUMA/frontend
npm install        # reinstala TODAS las dependencias (equivale al requirements.txt de Python)
npm run dev        # servidor de desarrollo → http://localhost:4321
npm run build      # genera el sitio estático en dist/
npm run preview    # previsualiza el build de producción
```

> ℹ️ Este es un proyecto **Node/Astro**, no Python: no usa `requirements.txt`.
> Su equivalente exacto es `package.json`, que ya está versionado en Git.

## 📦 Despliegue

Sitio **100% estático** (carpeta `frontend/dist/`). Opciones gratuitas:
- **Netlify / Vercel / Cloudflare Pages**: conecta el repo y configura:
  - **Base directory / Root:** `frontend`
  - **Build command:** `npm run build`
  - **Publish / Output directory:** `dist` (es decir `frontend/dist`)
- Cualquier hosting: sube el contenido de `frontend/dist/` por FTP.

## 🎨 Marca aplicada

- **Colores:** Primario `#0077C8`, Primario oscuro `#005EA0`, Secundario `#1A8FE3`,
  Acento `#E53935`, Texto `#1A1A1A` / `#5B6470`, Fondos `#FFFFFF` / `#F8FAFC`.
- **Tipografías:** Poppins (títulos), Inter (texto), Caveat (frases emotivas).
- **Logos:** versiones horizontal (color + blanco) y apilada, en `public/assets/`.
  - Navbar: logo horizontal que pasa de **blanco → color** al hacer scroll.
  - Footer: logo apilado.
- **Fotos:** fotografías reales de las jornadas, en `public/assets/gallery/`.
- **Hero animado:** ilustración estilo "dibujo infantil a crayón" (sol, nubes, pájaros,
  iglesia, casas, niños tomados de la mano, corazones y flores) dibujada y animada con
  el scroll mediante SVG en `public/js/hero.js`.
- **Mascota:** Milo (perrito) aparece en el footer (`public/assets/milo-clean/`).

## ✨ Secciones (one-page)

Inicio (hero ilustrado animado) · Nosotros (misión/visión + versículo) · Impacto (foto a
sangre + contadores animados) · Programas (6) · Galería (mosaico con lightbox) ·
Testimonios (carrusel) · Donar (montos con impacto + copiar cuenta) · Contacto · Footer.

Todas las animaciones respetan `prefers-reduced-motion`.

## ✅ Datos ya integrados

- Nombre, logo real, NIT `901.325.629`, razón social.
- Misión y visión redactadas (ajústalas si lo deseas).
- Impacto: 200 niños · 5–12 años · 1 comunidad (Santa Rosa) · 4+ jornadas/año.
- Donaciones: **Bancolombia** `78800001391`, **Nequi** `3008017056`, montos
  $20.000 / $50.000 / $100.000 (con botón "Copiar").
- Instagram real enlazado: `@fjuanunamanoayuda`.

## ⚠️ Pendientes por reemplazar

Busca `xxx` en `frontend/src/pages/index.astro` y reemplaza:

1. **Contacto** — dirección, teléfono (`tel:+57xxxxxxxxx`) y correo (`mailto:`).
2. **WhatsApp** — enlaces `https://wa.me/57xxxxxxxxxx` (en Contacto y Footer).
3. **Testimonios** — son de muestra (con una etiqueta visible que lo aclara). Reemplázalos por
   reales en el atributo `data-testi` de la sección Testimonios.

## ♿ Accesibilidad y rendimiento

- `prefers-reduced-motion` desactiva todas las animaciones (hero, contadores, reveals).
- Contraste AA, focus visible, `alt` en imágenes, `aria-label` en botones de icono, skip link.
- Touch targets amplios, viewport meta, sin scroll horizontal (verificado en móvil).
- Imágenes con `loading="lazy"`; CSS/JS propios y ligeros (sin frameworks pesados).

## 📁 Estructura de `frontend/`

El sitio es HTML + CSS + JS puro servido por Astro (sin componentes ni Tailwind).

```
frontend/
  src/pages/index.astro     ← la página (HTML completo, bilingüe ES/EN)
  public/
    css/site.css            ← sistema de diseño (tokens de marca, layout base)
    css/sections.css        ← estilos por sección
    js/hero.js              ← hero ilustrado animado (SVG dibujado con el scroll)
    js/site.js              ← i18n, menú, reveals, contadores, donar, copiar, lightbox
    assets/                 ← logos, about.jpeg, gallery/, milo-clean/
    favicon.png
  design-source/            ← material original de la fundación (respaldo, fotos/logos/videos)
  astro.config.mjs, package.json, tsconfig.json
```

## 🔧 Cómo cambiar textos, idiomas e imágenes

- **Textos / bilingüe:** cada elemento traducible usa `data-es` / `data-en` en `index.astro`.
  Edita ambos atributos para cambiar el contenido en español e inglés.
- **Imágenes:** reemplaza los archivos en `frontend/public/assets/` (galería en
  `assets/gallery/`) manteniendo el mismo nombre, o ajusta las rutas `/assets/...` en `index.astro`.
- **Hero ilustrado:** se genera por código en `frontend/public/js/hero.js`.
