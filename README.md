This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Autenticación (NextAuth.js)

Se configuraron los siguientes proveedores:

1. Google
2. GitHub
3. Credenciales (email + contraseña con `bcryptjs`)

Características añadidas:
- Registro de usuarios (`/register`) con hash seguro de contraseñas.
- Inicio de sesión con email/contraseña (`CredentialsProvider`).
- Bloqueo temporal tras 5 intentos fallidos (15 minutos).
- Botones de acceso con Google y GitHub (`/signIn`).
- Dashboard protegido (`/dashboard`).

### Variables de entorno requeridas
Crear un archivo `.env.local` en la raíz con:

```bash
NEXTAUTH_SECRET=tu_super_secreto_largo
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxx
GITHUB_CLIENT_ID=xxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxx
```

Genera `NEXTAUTH_SECRET` (por ejemplo usando `openssl rand -base64 32` en sistemas con OpenSSL). En Windows PowerShell:

```powershell
[convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 } | ForEach-Object {[byte]$_}))
```

### Instalación de dependencias adicionales

```bash
npm install next-auth bcryptjs react-icons
```

### Flujo de registro e inicio de sesión
1. Visita `/register` para crear una cuenta local.
2. Luego usa `/signIn` para acceder con credenciales o proveedores OAuth.
3. Tras autenticarte serás redirigido a `/dashboard`.

### Nota sobre almacenamiento de usuarios
Actualmente los usuarios se guardan en memoria (archivo `src/lib/users.ts`). Al reiniciar el servidor se pierde la información. Para producción reemplaza este módulo por una base de datos (ej. Prisma + SQLite/PostgreSQL) y ajusta el `CredentialsProvider`.

### Personalización futura
- Añadir verificación de email, recuperación de contraseña.
- Persistir intentos fallidos en la base de datos.
- Auditoría y roles de usuario.

