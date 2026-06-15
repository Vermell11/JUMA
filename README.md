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
npm run assets     # regenera logos/fotos desde design-source/ (solo si cambias originales)
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
- **Logos:** generados desde `design-source/Logos/Logo01.png` (horizontal) y `Logo02.png` (apilado).
  - Navbar: logo horizontal que pasa de **blanco → color** al hacer scroll.
  - Footer: logo apilado a color sobre tarjeta blanca.
- **Fotos:** seleccionadas de `design-source/Fotos/` (159 originales), optimizadas automáticamente
  por Astro a **WebP** en varios tamaños (srcset + lazy loading).
- **Hero animado:** una "ventana" que se expande con el scroll, compuesta por un paisaje
  (`public/hero/fondo.webp`) y un personaje animado (Milo) reproducido como secuencia de
  frames WebP con transparencia (`public/hero/milo-frames/`) en un `<canvas>`.

## ✨ Secciones (one-page)

Inicio (hero animado) · Nosotros (misión/visión + versículo) · Impacto (contadores animados) ·
Programas (6) · Galería (12 fotos, masonry) · Testimonios · Donar · Contacto · Footer.

Detalle decorativo: la capa `NatureLayer` (hojas, pétalos y mariposas flotantes) aparece
en varias secciones. Todas las animaciones respetan `prefers-reduced-motion`.

## ✅ Datos ya integrados

- Nombre, logo real, NIT `901.325.629`, razón social.
- Misión y visión redactadas (ajústalas si lo deseas).
- Impacto: 200 niños · 5–12 años · 1 comunidad (Santa Rosa) · 4+ jornadas/año.
- Donaciones: **Bancolombia** `78800001391`, **Nequi** `3008017056`, montos
  $20.000 / $50.000 / $100.000 (con botón "Copiar").
- Instagram real enlazado: `@fjuanunamanoayuda`.

## ⚠️ Pendientes por reemplazar

Edita `frontend/src/pages/index.astro`:

1. **Contacto** — actualmente `xxx`: dirección, teléfono y correo. (busca `xxx`)
2. **WhatsApp** — constante `WHATSAPP = "57XXXXXXXXXX"` arriba del archivo. Pon el número real.
3. **Testimonios** — son de muestra (con una etiqueta visible que lo aclara). Reemplázalos por reales.

## ♿ Accesibilidad y rendimiento

- `prefers-reduced-motion` desactiva todas las animaciones.
- Contraste AA, focus visible, `alt` en imágenes, `aria-label` en botones de icono, skip link.
- Touch targets ≥ 44px, viewport meta, sin scroll horizontal (verificado a 390px).
- Imágenes WebP responsive + lazy loading; 1 CSS + JS mínimo. Build ≈ 2.5 MB.

## 📁 Estructura de `frontend/`

```
frontend/
  src/
    pages/index.astro       ← toda la página + diccionario ES/EN + animaciones
    styles/global.css       ← tema de marca, animaciones, accesibilidad
    assets/                 ← logos (color + blanco) + fotos usadas (optimizadas por Astro)
  public/favicon.png        ← favicon
  scripts/build-assets.mjs  ← script (sharp) que recorta logos y selecciona fotos · `npm run assets`
  design-source/            ← material original de la fundación (respaldo)
    Fotos/                  ← 159 fotos originales
    Logos/                  ← logos PNG + PDFs de marca
  astro.config.mjs, package.json, tsconfig.json   ← config (deben ir junto al package.json)
```

## 🔧 Cómo cambiar las fotos

Las imágenes clave son `frontend/src/assets/about.jpeg`, `donate.jpeg` y la galería
`frontend/src/assets/gallery/g01..g12.jpeg`. Reemplaza el archivo por otro con el mismo nombre
(o ajusta los índices en `frontend/scripts/build-assets.mjs` y corre `npm run assets`) y vuelve a `npm run build`.

El paisaje y el personaje del hero viven en `frontend/public/hero/` (`fondo.webp` y la carpeta
`milo-frames/`). Sus fuentes en alta resolución se guardan en `frontend/design-source/` (no se
versionan los videos por su peso; ver `.gitignore`).
