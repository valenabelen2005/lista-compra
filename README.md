# 1. Crear proyecto Next.js
npx create-next-app@latest lista-compra

# 2. Entrar a la carpeta
cd
mi-app-sql

# 3. Instalar Prisma (el traductor entre JavaScript y SQL)

npm install prisma@6 @prisma/client@6   (versión 6)

npm install prisma --save-dev (Última versión)

npx prisma init

Al ejecutar
npx prisma init
, se creará un archivo llamado
.env
. Aquí es donde se"conecta" el código con la base de datos local, hay que escribir lo siguiente:

DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/NOMBRE_DB?schema=public"

En el archivo
prisma/schema.prisma
, definimos cómo se verá nuestra tabla. Este es el primer paso real para crear la base de datos, por ejemplo añadimos esto al final del archivo:
   
model Usuario { 
  id Int @id @default(autoincrement()) 
  email String @unique 
  nombre String?
}

* y comprobamos que en generator client tiene esto así:

generator client {
  provider = "prisma-client-js" // tiene que tener el -js al final, sino da error
  // output   = "../app/generated/prisma" // Hay que borrar esta línea
}

* Al ponerle el -js, le estamos confirmando: "Crea el traductor específico para JavaScript/TypeScript y guárdalo en la biblioteca del proyecto (node_modules)".

- Con lo siguiente, creamos la base de datos en PostgreSQL:
    npx prisma migrate dev --name init

* si tenemos que hacer otra vez el init, primero tenemos que borrar con 
    npx prisma migrate reset

- Instalamos la librería del cliente:

    npm install @prisma/client (versión 7 no 100% estable)

    npm install prisma@6 @prisma/client@6 (prisma versión 6, más estable por ahora)

- Generamos el cliente para acceder a la base de datos:
    npx prisma generate

* Este comando anterior lee tu archivo schema.prisma y crea un cliente personalizado con los nombres de tus tablas (Contactos, Productos, etc.) para que tengas autocompletado.

- Si se cambia algo en el archivo "schema.prisma" hay que repetir la siguiente secuencia:
    
    1. npx prisma migrate dev: Para que la Base de Datos se entere del cambio.

    2. npx prisma generate: Para que Next.js se entere del cambio y te ayude con el código.


-****- Después de cambiar algo en el proyecto como cambiarle el nombre, hay que hacer otra vez:
            npx prisma generate

    y después ya podemos hacer otra vez el npm run dev.# lista-compra
# lista-compra
