# Fundación Juan Una Mano Ayuda — Sitio web

Sitio web **one-page**, **bilingüe (ES/EN)**, construido con **Astro + Tailwind CSS v4**.
Diseño premium, humano y minimalista, con animaciones suaves y accesibles
(respeta `prefers-reduced-motion`) y 100% responsive.

## 🚀 Cómo ejecutarlo

```bash
npm install        # instalar dependencias (solo la primera vez)
npm run dev        # servidor de desarrollo → http://localhost:4321
npm run build      # genera el sitio estático en dist/
npm run preview    # previsualiza el build de producción
```

> Si cambias fotos o logos, re-ejecuta `node _build_assets.mjs` y luego `npm run build`.

## 📦 Despliegue

Sitio **100% estático** (carpeta `dist/`). Opciones gratuitas:
- **Netlify / Vercel / Cloudflare Pages**: conecta el repo. Build: `npm run build` · Salida: `dist`.
- Cualquier hosting: sube el contenido de `dist/` por FTP.

## 🎨 Marca aplicada

- **Colores:** Primario `#0077C8`, Primario oscuro `#005EA0`, Secundario `#1A8FE3`,
  Acento `#E53935`, Texto `#1A1A1A` / `#5B6470`, Fondos `#FFFFFF` / `#F8FAFC`.
- **Tipografías:** Poppins (títulos), Inter (texto), Caveat (frases emotivas).
- **Logos:** generados desde `Logos/Logo01.png` (horizontal) y `Logo02.png` (apilado).
  - Navbar: logo horizontal que pasa de **blanco → color** al hacer scroll.
  - Footer: logo apilado a color sobre tarjeta blanca.
- **Fotos:** seleccionadas de `Fotos/` (159 originales), optimizadas automáticamente
  por Astro a **WebP** en varios tamaños (srcset + lazy loading).

## ✨ Secciones (one-page)

Inicio (hero) · Nosotros (misión/visión + versículo) · Impacto (contadores animados) ·
Programas (6) · Galería (12 fotos, masonry) · Testimonios · Donar · Contacto · Footer.

## ✅ Datos ya integrados

- Nombre, logo real, NIT `901.325.629`, razón social.
- Misión y visión redactadas (ajústalas si lo deseas).
- Impacto: 200 niños · 5–12 años · 1 comunidad (Santa Rosa) · 4+ jornadas/año.
- Donaciones: **Bancolombia** `78800001391`, **Nequi** `3008017056`, montos
  $20.000 / $50.000 / $100.000 (con botón "Copiar").
- Instagram real enlazado: `@fjuanunamanoayuda`.

## ⚠️ Pendientes por reemplazar

Edita `src/pages/index.astro`:

1. **Contacto** — actualmente `xxx`: dirección, teléfono y correo. (busca `xxx`)
2. **WhatsApp** — constante `WHATSAPP = "57XXXXXXXXXX"` arriba del archivo. Pon el número real.
3. **Testimonios** — son de muestra (con una etiqueta visible que lo aclara). Reemplázalos por reales.

## ♿ Accesibilidad y rendimiento

- `prefers-reduced-motion` desactiva todas las animaciones.
- Contraste AA, focus visible, `alt` en imágenes, `aria-label` en botones de icono, skip link.
- Touch targets ≥ 44px, viewport meta, sin scroll horizontal (verificado a 390px).
- Imágenes WebP responsive + lazy loading; 1 CSS + JS mínimo. Build ≈ 2.5 MB.

## 📁 Estructura

```
src/
  pages/index.astro     ← toda la página + diccionario ES/EN + animaciones
  styles/global.css     ← tema de marca, animaciones, accesibilidad
  assets/               ← logos (color + blanco) + fotos (optimizadas por Astro)
public/favicon.png      ← favicon
_build_assets.mjs       ← script (sharp) que recorta logos y selecciona fotos
Fotos/  Logos/          ← originales (no se publican)
```

## 🔧 Cómo cambiar las fotos

Las imágenes clave son `src/assets/hero.jpeg`, `about.jpeg`, `donate.jpeg` y la galería
`src/assets/gallery/g01..g12.jpeg`. Reemplaza el archivo por otro con el mismo nombre
(o ajusta los índices en `_build_assets.mjs`) y vuelve a `npm run build`.
