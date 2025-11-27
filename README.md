# 🎉 EventManager - Sistema de Gestión de Eventos

Sistema web moderno para la gestión integral de eventos y sus invitados. Desarrollado con Next.js 16, React 19, Prisma ORM y PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## 📋 Descripción

EventManager es una aplicación CRUD completa que permite:

- **Crear y gestionar eventos** de diferentes tipos (bodas, cumpleaños, XV años, conferencias, etc.)
- **Administrar listas de invitados** con confirmación de asistencia
- **Controlar la capacidad** del evento con indicadores visuales
- **Visualizar eventos** en modo tarjetas o lista
- **Tema claro/oscuro** con persistencia de preferencias

## ✨ Características

### Gestión de Eventos
- Crear, editar y eliminar eventos
- 10 tipos de eventos predefinidos
- Soporte para eventos virtuales y sorpresa
- Control de capacidad máxima de asistentes

### Gestión de Invitados
- Agregar, editar y eliminar invitados
- Confirmar asistencia
- Registrar acompañantes
- Filtrar por estado (confirmados/pendientes)
- Búsqueda por nombre

### Interfaz de Usuario
- Diseño responsivo (móvil, tablet, escritorio)
- Tema oscuro y claro
- Animaciones suaves
- Persistencia de preferencias de vista

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| **Next.js 16** | Framework React con App Router |
| **React 19** | Biblioteca de UI |
| **TypeScript** | Tipado estático |
| **Prisma ORM** | Acceso a base de datos |
| **PostgreSQL** | Base de datos relacional |
| **Tailwind CSS 4** | Estilos utilitarios |
| **Lucide React** | Iconos |

## 📁 Estructura del Proyecto

```
event-manager/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── migrations/        # Migraciones de BD
├── src/
│   ├── app/
│   │   ├── api/           # API Routes (REST)
│   │   │   ├── events/    # CRUD de eventos
│   │   │   └── guests/    # CRUD de invitados
│   │   ├── events/        # Páginas de eventos
│   │   ├── globals.css    # Estilos globales
│   │   └── layout.tsx     # Layout principal
│   ├── components/        # Componentes reutilizables
│   │   ├── Badge.tsx
│   │   ├── DeleteButton.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventForm.tsx
│   │   ├── GuestForm.tsx
│   │   ├── GuestTable.tsx
│   │   └── Header.tsx
│   ├── lib/
│   │   └── prisma.ts      # Cliente de Prisma
│   └── types/
│       └── index.ts       # Tipos TypeScript
└── package.json
```

## 🚀 Instalación Local

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd event-manager
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/eventmanager?schema=public"
```

4. **Ejecutar migraciones**
```bash
npx prisma migrate dev
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
```
http://localhost:3000
```

## 🌐 Despliegue en Railway

### Opción 1: Desde GitHub (Recomendado)

1. **Subir a GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <tu-repositorio>
git push -u origin main
```

2. **En Railway**
   - Ir a [railway.app](https://railway.app)
   - Click en "New Project"
   - Seleccionar "Deploy from GitHub repo"
   - Elegir tu repositorio

3. **Agregar PostgreSQL**
   - Click en "New" → "Database" → "PostgreSQL"
   - Railway configurará automáticamente `DATABASE_URL`

4. **Configurar variables de entorno** (si es necesario)
   - En el servicio de tu app, ir a "Variables"
   - Railway debería auto-configurar `DATABASE_URL`

5. **Ejecutar migraciones** (primera vez)
   - En Railway, ir a tu servicio
   - Abrir la terminal o usar Railway CLI:
   ```bash
   railway run npx prisma migrate deploy
   ```

### Opción 2: Railway CLI

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Agregar PostgreSQL
railway add

# Desplegar
railway up
```

## 📊 Modelo de Datos

### Event (Evento)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | ID único |
| title | String | Título del evento |
| description | String? | Descripción opcional |
| date | DateTime | Fecha del evento |
| location | String | Ubicación |
| organizer | String | Nombre del organizador |
| eventType | Enum | Tipo de evento |
| maxAttendees | Int | Capacidad máxima |
| isVirtual | Boolean | ¿Es virtual? |
| isSurprise | Boolean | ¿Es sorpresa? |

### Guest (Invitado)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | ID único |
| name | String | Nombre completo |
| origin | String? | Ciudad de origen |
| companions | Int | Número de acompañantes |
| confirmed | Boolean | ¿Confirmó asistencia? |
| relationship | String? | Relación (familia, trabajo, etc.) |
| eventId | Int | ID del evento |

## 🔌 API Endpoints

### Eventos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/events` | Listar todos los eventos |
| GET | `/api/events/[id]` | Obtener evento por ID |
| POST | `/api/events` | Crear evento |
| PUT | `/api/events/[id]` | Actualizar evento |
| DELETE | `/api/events/[id]` | Eliminar evento |

### Invitados
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/guests` | Listar todos los invitados |
| GET | `/api/guests/[id]` | Obtener invitado por ID |
| POST | `/api/guests` | Crear invitado |
| PUT | `/api/guests/[id]` | Actualizar invitado |
| DELETE | `/api/guests/[id]` | Eliminar invitado |

## 🎨 Temas

La aplicación incluye dos temas:

- **Tema Oscuro** (por defecto): Fondo azul oscuro con acentos violeta y verde
- **Tema Claro**: Fondo blanco/gris con los mismos acentos

El tema se puede cambiar con el botón sol/luna en el header y se guarda en localStorage.

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es parte del curso IH719 - Conceptualización de Servicios en la Nube.

---

Desarrollado con ❤️ usando Next.js y Prisma
