# El Rodeo Web

Aplicación web del sistema de gestión multicanal del restaurante **El Rodeo**, desarrollada con React y TypeScript.

El frontend consume la API REST del proyecto `el-rodeo-api` para gestionar autenticación, productos, categorías, pedidos, usuarios y mesas según el rol del usuario autenticado.

---

## 1. Arquitectura

La aplicación forma parte de una arquitectura cliente-servidor:

```text
┌──────────────────────────────┐
│        El Rodeo Web          │
│      React + TypeScript      │
│                              │
│  Navegador / Interfaz Web    │
└──────────────┬───────────────┘
               │ HTTP/JSON
               ▼
┌──────────────────────────────┐
│        El Rodeo API          │
│    Laravel + Sanctum         │
│                              │
│        REST API              │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         PostgreSQL           │
└──────────────────────────────┘
```

El frontend no accede directamente a PostgreSQL. Todas las operaciones de datos se realizan mediante la API REST.

---

## 2. Tecnologías

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* CSS

### Backend

* Laravel
* PHP
* Laravel Sanctum
* API REST
* PostgreSQL

### Herramientas

* Node.js
* npm
* Git
* Docker
* Visual Studio Code

---

## 3. Requisitos

Para ejecutar el frontend se necesita:

* Node.js
* npm
* Git
* Navegador web
* API de El Rodeo ejecutándose

Comprobar Node.js:

```bash
node --version
```

Comprobar npm:

```bash
npm --version
```

Comprobar Git:

```bash
git --version
```

> El backend debe estar ejecutándose para que el frontend pueda autenticarse y consultar información.

---

## 4. Clonar el repositorio

El repositorio oficial es:

```text
git@github.com:adrianlaime718-tech/el-rodeo-web.git
```

Clonar:

```bash
cd ~/projects
git clone git@github.com:adrianlaime718-tech/el-rodeo-web.git
```

Entrar al proyecto:

```bash
cd el-rodeo-web
```

Verificar el estado:

```bash
git status
```

La rama estable para presentación es:

```text
main
```

---

## 5. Instalación

Instalar las dependencias:

```bash
npm install
```

Las dependencias utilizadas por el proyecto se encuentran definidas en:

```text
package.json
```

---

## 6. Configuración de la API

La aplicación utiliza la siguiente dirección para comunicarse con el backend durante el desarrollo:

```text
http://localhost:8000/api
```

La configuración se encuentra en:

```text
src/services/api.ts
```

El backend debe estar disponible antes de iniciar sesión o realizar operaciones que requieran datos.

---

## 7. Ejecutar el proyecto

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará una dirección similar a:

```text
http://localhost:5173/
```

Abrir esa dirección en el navegador.

---

## 8. Autenticación

La aplicación utiliza autenticación mediante tokens proporcionados por Laravel Sanctum.

El proceso es:

```text
Usuario
   │
   ▼
Pantalla de Login
   │
   ▼
POST /api/login
   │
   ▼
Token de autenticación
   │
   ▼
Almacenamiento local
   │
   ▼
Peticiones autenticadas a la API
```

El token se envía automáticamente en las peticiones que requieren autenticación.

Para cerrar sesión, el frontend utiliza:

```text
POST /api/logout
```

Además de eliminar la sesión local, el backend invalida el token correspondiente.

---

## 9. Roles y permisos

El sistema web contempla tres roles principales:

### Administrador

Tiene acceso a las funciones administrativas:

* Inicio
* Gestión de pedidos
* Gestión de productos
* Gestión de categorías
* Gestión de usuarios
* Gestión de mesas
* Cierre de sesión

### Mesero

Tiene acceso principalmente a:

* Inicio
* Gestión de pedidos
* Consulta y creación de pedidos
* Cierre de sesión

### Cocina

Tiene acceso principalmente a:

* Inicio
* Gestión y actualización del estado de pedidos
* Cierre de sesión

Las rutas protegidas se controlan mediante componentes de protección de rutas.

---

## 10. Protección de rutas

La aplicación utiliza componentes para controlar el acceso a las diferentes páginas.

Entre ellos:

```text
ProtectedRoute
AdminRoute
```

`ProtectedRoute` evita que usuarios no autenticados accedan a las páginas protegidas.

`AdminRoute` restringe las páginas administrativas a usuarios con rol de administrador.

---

## 11. Funcionalidades

### Autenticación

* Inicio de sesión
* Cierre de sesión
* Persistencia de sesión mediante token
* Control de acceso según rol

### Productos

El administrador puede:

* Consultar productos
* Crear productos
* Editar productos
* Activar o desactivar productos
* Eliminar productos

### Categorías

El administrador puede:

* Consultar categorías
* Crear categorías
* Editar categorías
* Activar o desactivar categorías
* Eliminar categorías

### Pedidos

La aplicación permite:

* Consultar pedidos
* Crear pedidos
* Agregar productos a los pedidos
* Modificar los productos de un pedido pendiente
* Actualizar el estado de los pedidos
* Eliminar pedidos según permisos
* Trabajar con pedidos para mesa
* Trabajar con pedidos para llevar

Los pedidos utilizan estados como:

```text
pending
confirmed
completed
cancelled
```

### Mesas

El administrador puede:

* Consultar mesas
* Crear mesas
* Editar mesas
* Activar o desactivar mesas

Los meseros pueden consultar las mesas necesarias para registrar pedidos.

### Usuarios

El administrador puede:

* Consultar usuarios
* Crear usuarios
* Editar usuarios
* Gestionar roles y estado de los usuarios

---

## 12. Estructura de pedidos

Los pedidos utilizan una estructura basada en elementos (`items`).

Ejemplo conceptual:

```json
{
  "type": "mesa",
  "table_id": 1,
  "customer_name": null,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

Para pedidos para llevar puede utilizarse:

```json
{
  "type": "para_llevar",
  "table_id": null,
  "customer_name": "Cliente",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

El cálculo de precios y totales es responsabilidad del backend.

---

## 13. Comunicación con la API

La comunicación HTTP se centraliza principalmente en:

```text
src/services/api.ts
```

El frontend utiliza las funciones del servicio para realizar operaciones como:

```text
Login
Logout
Productos
Categorías
Pedidos
Mesas
Usuarios
```

La respuesta de la API se procesa en los componentes y páginas correspondientes.

---

## 14. Estructura del proyecto

La estructura principal es:

```text
el-rodeo-web/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ...
│   │
│   ├── layouts/
│   │   └── MainLayout.tsx
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Products/
│   │   ├── Categories/
│   │   ├── Orders/
│   │   ├── Users/
│   │   └── Tables/
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── types/
│   │   ├── category.ts
│   │   ├── order.ts
│   │   └── product.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   └── index.css
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 15. Scripts disponibles

Los principales comandos definidos en `package.json` son:

### Desarrollo

```bash
npm run dev
```

### Compilación

```bash
npm run build
```

### Linter

```bash
npm run lint
```

### Vista previa de producción

```bash
npm run preview
```

---

## 16. Compilación para producción

Para comprobar que el proyecto puede compilarse correctamente:

```bash
npm run build
```

El resultado se genera en:

```text
dist/
```

Una compilación exitosa indica que TypeScript y Vite pudieron generar la aplicación de producción.

---

## 17. Flujo de ejecución completo

Para trabajar con el sistema completo:

### Terminal 1 — API

```bash
cd ~/projects/el-rodeo/el-rodeo-api
docker compose up -d
```

Verificar:

```bash
docker compose ps
```

### Terminal 2 — Web

```bash
cd ~/projects/el-rodeo/el-rodeo-web
npm run dev
```

Abrir:

```text
http://localhost:5173
```

El flujo general es:

```text
Navegador
    │
    ▼
El Rodeo Web
    │
    │ HTTP/JSON
    ▼
El Rodeo API
    │
    ▼
PostgreSQL
```

---

## 18. Pruebas básicas

Antes de realizar una presentación o entrega se recomienda comprobar:

1. El backend está ejecutándose.
2. El frontend inicia correctamente.
3. El login funciona.
4. El usuario recibe acceso según su rol.
5. Los productos se muestran correctamente.
6. Las categorías se muestran correctamente.
7. Los pedidos pueden consultarse.
8. Los pedidos pueden crearse según el rol.
9. Los estados de los pedidos pueden actualizarse según los permisos.
10. Las funciones administrativas de usuarios y mesas funcionan para el administrador.
11. El cierre de sesión funciona correctamente.

---

## 19. Git y ramas

Durante el desarrollo se utiliza:

```text
develop
```

para nuevos cambios.

La rama:

```text
main
```

contiene la versión estable preparada para presentación.

Consultar la rama actual:

```bash
git branch --show-current
```

Consultar el estado:

```bash
git status
```

Actualizar la información del repositorio:

```bash
git pull origin main
```

---

## 20. Repositorio

Repositorio oficial:

```text
git@github.com:adrianlaime718-tech/el-rodeo-web.git
```

---

## 21. Relación con los demás componentes

El proyecto Web es uno de los clientes del sistema El Rodeo.

```text
                    ┌─────────────────────┐
                    │   El Rodeo API      │
                    │ Laravel + Sanctum   │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             El Rodeo Web          El Rodeo Mobile
             React + Vite             Flutter
```

El frontend web y la aplicación móvil utilizan la misma API para acceder a los datos y aplicar las reglas de negocio centralizadas en el backend.
