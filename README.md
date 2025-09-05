# Stayzio

Stayzio es una aplicación web para la gestión y visualización de listados de propiedades, con funcionalidades de reseñas, autenticación de usuarios y mapas interactivos.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express.js**: Framework web para Node.js, utilizado para crear la API y gestionar rutas.
- **MongoDB**: Base de datos NoSQL para almacenar usuarios, listados y reseñas.
- **Mongoose**: ODM para MongoDB, facilita la interacción con la base de datos.
- **Arcjet**: Ayuda a proteger tu API o aplicación web de abusos automatizados y tráfico malicioso.
- **Bootstrap 5**: Framework CSS para diseño responsivo y componentes UI.
- **Mapbox GL JS**: Librería para mapas interactivos en la visualización de ubicaciones.
- **Font Awesome**: Iconos vectoriales para mejorar la interfaz de usuario.
- **Passport.js**: Middleware de autenticación para Node.js.
- **dotenv**: Manejo de variables de entorno.
- **Método Override**: Permite el uso de métodos HTTP como PUT y DELETE en formularios HTML.
- **Express-session**: Manejo de sesiones de usuario.
- **bcrypt**: Hashing de contraseñas para mayor seguridad.

## Estructura del proyecto

- `/controllers`: Lógica de negocio para listados, usuarios y reseñas.
- `/models`: Definición de esquemas de Mongoose para las entidades principales.
- `/routes`: Definición de rutas para la API y vistas.
- `/views`: Plantillas EJS para la interfaz de usuario.
- `/public`: Archivos estáticos (CSS, JS, imágenes).
- `/utils`: Utilidades y middlewares personalizados.

## Instalación

1. Clona el repositorio.
2. Instala dependencias con `pnpm install`.
3. Configura las variables de entorno en un archivo `.env`.
4. Inicia la aplicación con `pnpm start`.

---
