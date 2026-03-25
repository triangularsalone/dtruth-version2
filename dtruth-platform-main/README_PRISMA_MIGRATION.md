Prisma migration instructions

1. Install Prisma and generate client:

   npm install prisma @prisma/client --save-dev
   npx prisma generate

2. Set your DATABASE_URL in `.env` or `.env.local`.

3. Run migration (creates SQL and applies):

   npx prisma migrate dev --name add_user_model

4. After migration, import Prisma client in your code:

   import { PrismaClient } from '@prisma/client'
   const prisma = new PrismaClient()

Notes:
- If you use a production database, use `npx prisma migrate deploy`.
- Keep `.env.local` out of source control and use `.env.local.example` for sharing.
