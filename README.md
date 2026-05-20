This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Admin Dashboard & User Roles

This application includes a role-based admin dashboard with the following user roles:

### User Roles

- **viewer**: Can view entries but cannot create, edit, or delete
- **admin**: Can create and edit only "Photo" category entries
- **super_admin**: Full access to all entries and can manage user roles

### Database Setup

The application uses Supabase with Row Level Security (RLS) policies to enforce permissions at the database level.

#### Required Tables

1. **entries** - Stores documents, photos, videos, and reports
2. **admins** - Stores user roles and admin information

#### Applying RLS Policies

To apply the role-based security policies:

```bash
# Install dependencies (if needed)
npm install

# Push the migration to your Supabase database
npm run db:push
```

#### Testing RLS Policies

After applying the migration, test that policies are working:

```bash
# Run the RLS test script
npm run test:rls
```

This will check:
- RLS is enabled on tables
- Policies are created
- Helper functions exist

#### Manual Policy Setup (if needed)

If you need to set up policies manually in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase/migrations/20260325040500_add_rls_policies.sql`

#### Manual Policy Setup (if needed)

If you need to set up policies manually in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase/migrations/20260325040500_add_rls_policies.sql`

### Admin Registration

New admin users can be registered at `/admin/register`. The registration form allows setting the initial role (admin or super_admin).

### Dashboard Access

- Admin dashboard: `/admin/dashboard`
- Login: `/admin/login`
- Registration: `/admin/register`

### Permissions Summary

| Action | viewer | admin | super_admin |
|--------|--------|-------|-------------|
| View entries | ✅ | ✅ | ✅ |
| Create Photo entries | ❌ | ✅ | ✅ |
| Create other entries | ❌ | ❌ | ✅ |
| Edit entries | ❌ | Photo only | ✅ |
| Delete entries | ❌ | ❌ | ✅ |
| Manage user roles | ❌ | ❌ | ✅ |

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
