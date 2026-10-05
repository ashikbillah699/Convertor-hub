# OpticThirst

OpticThirst is a Vite/React application with a local Express + MongoDB content API for blogs and affiliate products.

## Local development

The API binds to `127.0.0.1`, and Vite proxies `/api` to it. There is no deployment requirement for local development.

1. Install Node.js and MongoDB Community Server, then start the local MongoDB service.
2. From the project directory, install packages and create your local environment file:

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

3. Generate an admin password hash in a terminal. The password is entered without being echoed:

   ```powershell
   npm run admin:hash
   ```

   Put the printed `ADMIN_PASSWORD_HASH` value in `.env` and set `ADMIN_USERNAME`. Generate a session secret:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
   ```

   Put the resulting value in `.env` as `SESSION_SECRET`. Keep `MONGODB_URI`, `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET` server-side; never add a `VITE_` prefix or commit `.env`.

4. Seed the existing six full blog posts and twelve products, then start the API:

   ```powershell
   npm run db:seed
   npm run server:dev
   ```

   Start the frontend in a second terminal:

   ```powershell
   npm run dev
   ```

   Open `http://localhost:8080`; the admin panel is at `/admin`. Check API/database status at `http://localhost:8080/api/health`.

The seed is idempotent: it inserts missing records and never overwrites existing edits. The admin panel supports creating, editing, publishing/unpublishing, and deleting blogs and products. The JSON editor is validated by the API. Existing blog IDs, product slugs, and tool-category associations are preserved. Public endpoints return published content only.
