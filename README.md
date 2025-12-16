## Getting Started

### Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   - Get your project URL and keys from [Supabase Dashboard](https://supabase.com/dashboard)
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SECRET_KEY`: Your Supabase service role key

### Installation

Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development Server

Run the development server:

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
