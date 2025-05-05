<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

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

-   Un contenedor para Laravel en el puerto **`8000`**.
-   Un contenedor para MySQL en el puerto **`3307`**.

### **4. Ejecutar migraciones y seeders**

```bash
./vendor/bin/sail artisan migrate --seed
```

Esto creará las tablas con los datos de ejemplo.

### **5. Acceder a la aplicación**

-   **Laravel**: [http://localhost:8000](http://localhost:8000/).
-   **MySQL**: Puede conectarse desde un cliente usando:
    -   Host: `localhost`
    -   Puerto: **`3307`**
    -   Usuario: **`sail`**
    -   Contraseña: **`password`**

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

-   `DB_DATABASE` es obligatorio.
-   Los demás valores (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`) dependen de su entorno.
-   En XAMPP, por defecto el usuario es `root` y la contraseña está vacía.

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

-   **Laravel**: [http://localhost:8000](http://localhost:8000/)
-   **MySQL**: Puede conectarse desde un cliente usando los datos que proporcionó en .env de acuerdo a su entorno:
    -   Host: `localhost`
    -   Puerto: **`3306`**
    -   Usuario: **`root`**
    -   Contraseña:
