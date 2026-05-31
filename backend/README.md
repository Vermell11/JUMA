# Backend — Fundación Juan Una Mano Ayuda

> ⚠️ **Aún no hay backend.** El sitio actual es **100% estático** (frontend en Astro),
> por lo que no necesita servidor para funcionar ni para desplegarse.

Esta carpeta queda **reservada** para cuando se requiera lógica de servidor, por ejemplo:

- **Formulario de contacto / voluntariado** que envíe correos (ej. con un endpoint o un servicio como Formspree).
- **Pasarela de donaciones** en línea (Wompi, PayU, Mercado Pago) que requiera validar pagos.
- **Panel de administración** para actualizar testimonios, cifras de impacto o galería.
- **API** para servir datos dinámicos.

## Sugerencia de stack (cuando se implemente)

- Node.js + Express o Fastify, **o** funciones serverless (Netlify/Vercel Functions).
- Variables de entorno en un archivo `.env` (NO se sube a Git; ya está en `.gitignore`).

Mientras tanto, todo el sitio vive en [`../frontend`](../frontend).
