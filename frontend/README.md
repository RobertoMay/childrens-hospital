<p align="center">
  <a href="https://reactjs.org/" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="100" alt="React Logo">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://vitejs.dev/" target="_blank">
    <img src="https://vitejs.dev/logo-with-shadow.png" width="100" alt="Vite Logo">
  </a>
</p>

# React + TypeScript + Vite

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
