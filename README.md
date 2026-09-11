# Guía para clonar y ejecutar el proyecto El Rodeo

## 1. Requisitos previos

Antes de comenzar, se debe tener instalado:

* **Git**
* **Docker Desktop**
* **WSL2**
* Una distribución Linux en WSL, por ejemplo Ubuntu
* **Node.js y npm** para ejecutar el frontend React
* Visual Studio Code, recomendado

Verificar Git:

```bash
git --version
```

Verificar Docker:

```bash
docker --version
docker compose version
```

Verificar Node.js:

```bash
node --version
npm --version
```

---

# 2. Clonar el backend

Abrir WSL/Ubuntu y dirigirse a la carpeta donde se guardarán los proyectos:

```bash
mkdir -p ~/proyectos
cd ~/proyectos
```

Clonar el repositorio del backend:

```bash
git clone git@github.com:adrianlaime718-tech/el-rodeo-api.git
```

Entrar al proyecto:

```bash
cd el-rodeo-api
```

Comprobar que se clonó correctamente:

```bash
git status
```

Debe aparecer algo similar a:

```text
On branch main
Your branch is up to date with 'origin/main'.
```

---

# 3. Configurar el backend

Primero comprobar los archivos:

```bash
ls
```

El proyecto debe contener archivos como:

```text
app
artisan
bootstrap
config
database
docker-compose.yml
routes
composer.json
.env.example
```

Crear el archivo `.env`:

```bash
cp .env.example .env
```

Como el backend utiliza Docker, debemos asegurarnos de que los contenedores estén configurados.

Iniciar Docker:

```bash
docker compose up -d
```

Comprobar los contenedores:

```bash
docker compose ps
```

Deberíamos tener principalmente:

```text
el-rodeo-api-app
el-rodeo-api-postgres
```

El contenedor de PostgreSQL debería aparecer funcionando/healthy.

---

# 4. Instalar dependencias de Laravel

Ejecutar:

```bash
docker compose exec app composer install
```

Después generar la clave de Laravel:

```bash
docker compose exec app php artisan key:generate
```

---

# 5. Configurar la base de datos

Ejecutar las migraciones:

```bash
docker compose exec app php artisan migrate
```

Si el proyecto incluye datos iniciales mediante seeders:

```bash
docker compose exec app php artisan db:seed
```

Si se desea ejecutar migraciones y seeders juntos:

```bash
docker compose exec app php artisan migrate --seed
```

> **Importante:** para una instalación nueva, `migrate --seed` es normalmente lo más cómodo. No ejecutar `migrate:fresh` en una base de datos que contenga información que se quiera conservar.

---

# 6. Crear el usuario administrador

El sistema actualmente utiliza autenticación mediante **Laravel Sanctum**.

Si la base de datos no contiene todavía el usuario administrador, entrar al contenedor:

```bash
docker compose exec app php artisan tinker
```

Y ejecutar:

```php
\App\Models\User::create([
    'name' => 'Administrador',
    'email' => 'admin@elrodeo.com',
    'password' => \Illuminate\Support\Facades\Hash::make('Admin12345'),
]);
```

Salir de Tinker:

```text
exit
```

Las credenciales actuales de prueba son:

```text
Correo: admin@elrodeo.com
Contraseña: Admin12345
```

---

# 7. Comprobar el backend

Ver las rutas:

```bash
docker compose exec app php artisan route:list --path=api
```

El backend debe exponer, entre otras, estas rutas:

```text
POST   /api/login
POST   /api/logout

/api/categories
/api/products
/api/orders
```

La API estará disponible en:

```text
http://localhost:8000
```

Y la API:

```text
http://localhost:8000/api
```

---

# 8. Clonar el frontend

Abrir **otra terminal WSL**.

Ir nuevamente a proyectos:

```bash
cd ~/proyectos
```

Clonar el frontend:

```bash
git clone git@github.com:adrianlaime718-tech/el-rodeo-web.git
```

Entrar:

```bash
cd el-rodeo-web
```

Comprobar:

```bash
git status
```

---

# 9. Instalar las dependencias de React

Dentro de:

```text
~/proyectos/el-rodeo-web
```

ejecutar:

```bash
npm install
```

Esto instalará las dependencias definidas en `package.json`, incluyendo React Router.

---

# 10. Ejecutar el frontend

Ejecutar:

```bash
npm run dev
```

Vite mostrará algo similar a:

```text
Local: http://localhost:5173/
```

Abrir en el navegador:

[http://localhost:5173/](http://localhost:5173/?utm_source=chatgpt.com)

---

# 11. Iniciar sesión

Al acceder al sistema, se mostrará la pantalla de inicio de sesión.

Utilizar:

```text
Correo:
admin@elrodeo.com

Contraseña:
Admin12345
```

Después de iniciar sesión, el frontend guarda el token de autenticación y permite acceder a:

```text
/
 /products
 /categories
 /orders
```

El frontend envía automáticamente el token en las peticiones a la API.

---

# 12. Orden correcto para ejecutar el proyecto

Cada vez que se quiera trabajar con el proyecto, el orden recomendado es:

### Terminal 1 — Backend

```bash
cd ~/proyectos/el-rodeo-api
docker compose up -d
```

Comprobar:

```bash
docker compose ps
```

### Terminal 2 — Frontend

```bash
cd ~/proyectos/el-rodeo-web
npm run dev
```

Después abrir:

```text
http://localhost:5173
```

---

# 13. Detener el proyecto

Para detener el frontend:

```text
Ctrl + C
```

Para detener los contenedores del backend:

```bash
docker compose down
```

Esto detiene los contenedores, pero **no elimina los datos de PostgreSQL**.

Para volver a iniciar posteriormente:

```bash
docker compose up -d
```

---

# 14. Flujo completo resumido

Una instalación desde cero quedaría así:

```bash
# BACKEND
cd ~/proyectos
git clone git@github.com:adrianlaime718-tech/el-rodeo-api.git
cd el-rodeo-api

cp .env.example .env

docker compose up -d

docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

Luego:

```bash
# FRONTEND
cd ~/proyectos
git clone git@github.com:adrianlaime718-tech/el-rodeo-web.git
cd el-rodeo-web

npm install
npm run dev
```

Y acceder a:

```text
http://localhost:5173
```

---

## 15. Estructura final

Después de clonar ambos repositorios:

```text
~/proyectos/
│
├── el-rodeo-api/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── docker-compose.yml
│   ├── composer.json
│   └── ...
│
└── el-rodeo-web/
    ├── src/
    │   ├── components/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   └── types/
    ├── package.json
    └── ...
```
