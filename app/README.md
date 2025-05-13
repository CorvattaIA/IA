# Consultoría en Ética para Inteligencia Artificial

Este proyecto es una landing page para la consultoría "ética IA", enfocada en la ética en la inteligencia artificial. La página incluye un test de diagnóstico y un chat inteligente para ayudar a los usuarios a identificar los servicios de ética en IA que necesitan.

## Características

- Diseño inspirado en el estilo minimalista y de alto contraste del ilustrador Noma Bar
- Test de diagnóstico categorizado por sector económico
- Chat inteligente para responder preguntas y agendar reuniones
- Almacenamiento de datos en base de datos PostgreSQL mediante Prisma
- Diseño responsive y accesible
- Soporte para modo oscuro/claro

## Tecnologías utilizadas

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion para animaciones
- Prisma como ORM
- PostgreSQL como base de datos

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL

## Configuración

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd <nombre-del-repositorio>
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura la base de datos:

Crea un archivo `.env` en la raíz del proyecto con la siguiente variable:

```
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/etica_ia"
```

Reemplaza `usuario`, `contraseña` y `etica_ia` con tus credenciales y nombre de base de datos.

4. Ejecuta las migraciones de Prisma:

```bash
npx prisma migrate dev --name init
```

5. Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Estructura del proyecto

- `/app`: Páginas y rutas de la aplicación
- `/components`: Componentes reutilizables
- `/prisma`: Esquema de la base de datos y migraciones
- `/public`: Archivos estáticos

## Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Para iniciar la aplicación en modo producción:

```bash
npm start
```

## Licencia

Este proyecto está bajo la licencia MIT.