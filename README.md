# 🐏 Carnero Dev - Plataforma de Innovación Tecnológica

[![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)

**Carnero Dev** es una plataforma web de alto rendimiento diseñada para la gestión, promoción y registro de competiciones tecnológicas y hackathons. Desarrollada con las tecnologías más modernas de la industria, ofrece una experiencia de usuario inmersiva con animaciones fluidas y una arquitectura robusta basada en componentes.

## ✨ Características Principales

- 🚀 **Astro 6 Engine**: Renderizado ultra-rápido y carga progresiva optimizada.
- 🎨 **Tailwind CSS 4**: Estilos modernos con una estética "cyber-tech" y diseño responsivo.
- ⚡ **Animaciones GSAP**: Interacciones fluidas y efectos visuales de alta gama con ScrollTrigger.
- 🔐 **Integración Supabase**: Base de datos en tiempo real y gestión de registros de participantes.
- 📧 **Notificaciones Resend**: Sistema automatizado para confirmaciones de registro.
- 📱 **Diseño Responsive**: Adaptado perfectamente para móviles, tablets y escritorio.

## 🎯 Verticales de la Competencia

El evento se centra en 6 ejes principales de innovación tecnológica:

1. **Innovación Abierta**: Resolución de problemáticas reales sin límites de arquitectura.
2. **Inteligencia Artificial**: Implementación de agentes inteligentes y LLMs avanzados.
3. **Desarrollo Web & Cloud**: Creación de plataformas escalables y dinámicas.
4. **Ciberseguridad & Redes**: Protección de datos y despliegues seguros.
5. **DevOps & Automatización**: Flujos CI/CD e infraestructura como código.
6. **Trabajo en Equipo**: Colaboración bajo presión en sprints continuos.

## 🛠️ Stack Tecnológico

| Tecnología | Descripción |
| :--- | :--- |
| **Astro** | Framework web para contenido estático y dinámico optimizado. |
| **Tailwind CSS 4** | Framework de CSS para diseño rápido y consistente. |
| **Supabase** | Backend as a Service para autenticación y base de datos (PostgreSQL). |
| **GSAP** | Biblioteca líder para animaciones web robustas. |
| **Resend** | API moderna para el envío de correos electrónicos transaccionales. |

## 📁 Estructura del Proyecto

```text
/
├── public/              # Archivos estáticos y activos públicos
├── src/
│   ├── components/      # Componentes de UI modulares y reutilizables
│   ├── layouts/         # Plantillas de diseño base de la aplicación
│   ├── lib/             # Configuraciones de clientes (Supabase, etc.)
│   ├── pages/           # Rutas y páginas principales del sitio
│   └── styles/          # Estilos globales y configuraciones de Tailwind
├── astro.config.mjs     # Configuración principal de Astro
└── package.json         # Dependencias y scripts del proyecto
```

## 🚀 Instalación y Desarrollo

Sigue estos pasos para configurar el proyecto localmente:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/carnero-dev.git
   cd carnero-dev
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales:
   ```env
   SUPABASE_URL=tu_supabase_url
   SUPABASE_ANON_KEY=tu_supabase_anon_key
   RESEND_API_KEY=tu_resend_api_key
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El sitio estará disponible en [http://localhost:4321](http://localhost:4321).

## 📊 Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el entorno de desarrollo con Hot Module Replacement. |
| `npm run build` | Genera una versión de producción optimizada en `/dist`. |
| `npm run preview` | Previsualiza localmente la compilación de producción. |
| `npm run astro` | Acceso directo a la CLI de Astro. |

---

Desarrollado para la comunidad de desarrolladores de **Carnero Dev**.
