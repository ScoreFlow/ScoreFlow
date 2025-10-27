<img width="108" height="113" alt="favicon" src="https://github.com/user-attachments/assets/584e48c3-6e8d-4c68-a57b-11b0ee80b7ec" />

# ScoreFlow

A music score manager and distributor for orchestras.

## Developing

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Database Type Generation

When making changes to the database schema (via Supabase migrations), you need to regenerate the TypeScript types:

```bash
# Start Supabase locally
supabase start

# Generate the types
supabase gen types typescript --local > src/lib/types/database.types.ts
```

The CI will automatically check that the generated types match the committed version.
