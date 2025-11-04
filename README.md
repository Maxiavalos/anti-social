# ⚛️ UNAHUR SocialNet (Frontend - React/TypeScript)

## 🎓 Contexto Universitario

Este proyecto fue desarrollado como Trabajo Práctico para la materia **Construcción de Interfaz de Usuario** de la Universidad Nacional de Hurlingham (**UNAHUR**).

El objetivo principal es aplicar conceptos de desarrollo FrontEnd avanzado (React, TypeScript) en la simulación de una red social, haciendo hincapié en la gestión de estado, rutas con la utilizacion de una API REST.

---

## 🌟 Descripción del Proyecto

Este repositorio contiene el desarrollo del **FrontEnd** para la simulación de la red social **"UnaHur Anti-Social Net"**.

El objetivo es crear una aplicación web moderna y reactiva utilizando **React** y **TypeScript** que interactúe con una API REST para ofrecer una experiencia completa de navegación, autenticación simulada y creación de contenido.

---

## 🎯 Funcionalidades Implementadas

La aplicación cubre el ciclo de vida de un usuario dentro de la red social, desde el acceso hasta la publicación de contenido:

### 🔐 Autenticación y Gestión de Usuarios

* **Inicio de Sesión (Login Simulado):**
    * Se requiere un `nickName` y la **contraseña fija "123456"**.
    * Verificación de existencia del usuario mediante `GET /users` a la API.
    * Persistencia de la sesión a través de **`useContext`** para el estado global y **`localStorage`** para mantener la sesión entre recargas.
* **Registro de Usuario:**
    * Formulario de alta que envía una solicitud `POST /users` a la API.
    * Validaciones de campos requeridos y manejo de *feedback* visual ante errores de registro (ej. `nickName` ya utilizado).

### 🏠 Interacción con el Contenido

* **Home (Página de Inicio):**
    * Muestra un **Feed de Publicaciones Recientes** con descripción, imágenes, etiquetas y contador de comentarios.
    * Incluye elementos libres de diseño como Banners o sección "Sobre nosotros".
* **Detalle de Publicación (`/post/:id`):**
    * Vista completa del post con su contenido, etiquetas y lista de comentarios.
    * Formulario para agregar nuevos comentarios (`POST /comments`).

### 🛡️ Vistas y Operaciones Protegidas

Estas rutas solo son accesibles si el usuario ha iniciado sesión:

* **Perfil de Usuario:**
    * Muestra el `nickName` del usuario logueado.
    * Lista las **publicaciones propias** obtenidas de la API (filtradas por `userId`).
    * Incluye la funcionalidad de **Cerrar Sesión (Logout)**.
* **Crear Nueva Publicación:**
    * Formulario para crear nuevos posts.
    * Manejo de campos: Descripción, URLs de imágenes (opcional) y selección de etiquetas (obtenidas de la API).
    * Flujo de creación: `POST /posts` y, si hay imágenes, múltiples `POST /postimages`.

---

## 🛠️ Tecnologías Utilizadas

El desarrollo sigue un enfoque moderno de desarrollo Frontend, utilizando las siguientes tecnologias:

| Categoría | Tecnología/Concepto | Rol en el Proyecto |
| :--- | :--- | :--- |
| **Tecnología Base** | **React & TypeScript** | Estructura de componentes y tipado estático para robustez. |
| **Gestión de Estado** | `useState`, `useEffect` | Manejo del estado local y la carga de datos asíncrona. |
| **Contexto Global** | `useContext` | Almacenamiento y acceso al estado de autenticación del usuario. |
| **Navegación** | `react-router-dom` | Enrutamiento de la aplicación y gestión de las **rutas protegidas**. |
| **Comunicación** | **Fetch** o **Axios** | Consumo de la API REST (GET, POST, etc.). |
| **Persistencia** | `localStorage` | Mantenimiento de la sesión del usuario entre recargas del navegador. |
| **Interfaz** | **Formularios Controlados** | Manejo de *inputs* de usuario con validaciones y *feedback* visual. |
| **Estilo** | CSS / Framework (Bootstrap) | Diseño *responsive*. |

---

## 🚀 Instalación y Ejecución

Para levantar el proyecto y comenzar a interactuar con la API:
- Requisitos previos: Tener instalado Node.js (versión LTS recomendada).

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Maxiavalos/anti-social
    ```
2.  **En el VS Code nos posicionamos sobre el directorio:**
    ```bash
    cd anti-social
    ```
3.  **Instalar dependencias:**
    ```bash
    npm install
    ```
4.  **Ejecutar la aplicación (asegúrate que el BackEnd esté corriendo):**
    ```bash
    npm run dev
    ```

La aplicación estará disponible en el `localhost de la terminal`.

---

## 👥 Integrantes del Grupo:

Este trabajo fue desarrollado por el siguiente equipo:

* **Máximo Alexander Avalos** (maxiavalos07@gmail.com)
* **Leonel Agustin Arce** (leonelagustin.arce@estudiantes.unahur.edu.ar)
* **Eliel Dario Remonda** (elieldario.remonda@estudiantes.unahur.edu.ar)