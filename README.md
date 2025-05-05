<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="200" alt="Laravel Logo">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://reactjs.org/" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="100" alt="React Logo">
  </a>
</p>

<h1 align="center">Hospital Infantil</h1>

### Clonar el repositorio

```bash
git clone [URL]
cd childrens-hospital
```

# Ejecución del backend

Asegúrese de que se encuentre dentro de la carpeta backend

```bash
cd backend
```

## **Ejecutar el proyecto con Docker Sail**

### **Requisitos previos**

1. Tener instalado [Docker](https://docs.docker.com/desktop/setup/install/windows-install/).
2. Si se usa Windows es recomendable tener instalado WSL2

### **1. Configurar el archivo `.env`**

Se debe crear el archivo .env en la raíz del proyecto backend basándose en .env.example

```bash
cp .env.example .env
```

Luego edite **`.env`** y asegúrese de que tenga estas variables clave:

```
APP_NAME=Laravel
APP_KEY=base64:RC6onFfBIyXS9ylRI0Thkl/QB3rRFMRRWaXA9vS7U4g=

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=patients
DB_USERNAME=sail
DB_PASSWORD=password

APP_PORT=8000
FORWARD_DB_PORT=3307
VITE_PORT=5174
```

### **2. Instalar dependencias de Composer (usando Sail)**

Ejecuta este comando para instalar las dependencias dentro del contenedor:

```bash
./vendor/bin/sail composer install
```

### **3. Iniciar los contenedores con Sail**

```bash
./vendor/bin/sail up -d
```

Esto iniciará:

- Un contenedor para Laravel en el puerto **`8000`**.
- Un contenedor para MySQL en el puerto **`3307`**.

### **4. Ejecutar migraciones y seeders**

```bash
./vendor/bin/sail artisan migrate --seed
```

Esto creará las tablas con los datos de ejemplo.

### **5. Acceder a la aplicación**

- **Laravel**: [http://localhost:8000](http://localhost:8000/).
- **MySQL**: Puede conectarse desde un cliente usando:
  - Host: `localhost`
  - Puerto: **`3307`**
  - Usuario: **`sail`**
  - Contraseña: **`password`**

## **Ejecutar el proyecto localmente**

### **Requisitos previos**

1. **Servidor web local** (XAMPP, WAMP, Laragon o similar)
2. **PHP 8.1+**
3. **Composer** ([Instalar](https://getcomposer.org/))
4. **MySQL**

### **1. Configurar el archivo `.env`**

```bash
cp .env.example .env
```

ó si esta en Windows:

```powershell
Copy-Item .env.example .env
```

(Igual se puede hacer manualmente).

### 1.1. Editar **`.env`** con estos valores:

```
APP_NAME=Laravel
APP_KEY=base64:RC6onFfBIyXS9ylRI0Thkl/QB3rRFMRRWaXA9vS7U4g=
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=patients
DB_USERNAME=root
DB_PASSWORD=
```

**Nota:**

- `DB_DATABASE` es obligatorio.
- Los demás valores (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`) dependen de su entorno.
- En XAMPP, por defecto el usuario es `root` y la contraseña está vacía.

### **2. Instalar dependencias**

```powershell
composer install
```

### **3. Configurar base de datos**

1. Crear una base de datos llamada **`patients`** en MySQL
2. Ejecutar migraciones y seeders:

```powershell
php artisan migrate --seed
```

Esto creará las tablas con los datos de ejemplo.

### **4. Generar clave de aplicación**

```powershell
php artisan key:generate
```

### **5. Iniciar el servidor**

```powershell
php artisan serve --port=8000
```

### **7. Acceder a la aplicación**

- **Laravel**: [http://localhost:8000](http://localhost:8000/)
- **MySQL**: Puede conectarse desde un cliente usando los datos que proporcionó en .env de acuerdo a su entorno:
  - Host: `localhost`
  - Puerto: **`3306`**
  - Usuario: **`root`**
  - Contraseña:

# Ejecución del frontend

Asegúrese de que se encuentre dentro de la carpeta frontend

```powershell
cd frontend
```

### **Requisitos previos**

1. **Node.js 18+** ([Descargar](https://nodejs.org/))
2. **npm 9+**
3. **Backend Laravel en ejecución**

### **1. Configurar variables de entorno**

Cree un archivo **`.env`** en la raíz del proyecto frontend:

```bash
touch .env
```

ó si esta en Windows:

```powershell
New-Item .env -ItemType File
```

(Igual se puede hacer manualmente).

### **1.1 Editar .env:**

```
VITE_API_BASE_URL=http://localhost:8000/api
```

**Notas**:

- Esta URL debe apuntar al backend Laravel en ejecución.
- Si se usa un puerto diferente al 8000, ajústelo (ej: **`http://localhost:9000/api`**).

### **2. Instalar dependencias**

Ejecuta en la raíz del proyecto frontend:

```powershell
npm install
```

### **3. Iniciar el servidor de desarrollo**

```
npm run dev
```

El sistema iniciará:

- Servidor Vite en **`http://localhost:5173`**

### **4. Acceder al frontend**

Abrir el navegador en: [http://localhost:5173](http://localhost:5173)

# Capturas de su ejecución

![image1.png](https://res.cloudinary.com/dumchkwoa/image/upload/v1746482983/image1.png)

![image2.png](https://res.cloudinary.com/dumchkwoa/image/upload/v1746482983/image2.png)

![image3.png](https://res.cloudinary.com/dumchkwoa/image/upload/v1746482983/image3.png)

# Base de datos

![image4.png](https://res.cloudinary.com/dumchkwoa/image/upload/v1746482983/image4.png)
