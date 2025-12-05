# Abdullah Khaled — Portfolio (static)

This is a ready-to-upload static portfolio site for Abdullah Khaled (Math teacher & .NET MAUI developer).

## What's included
- `index.html` — single-page, editable Bootstrap site
- `assets/style.css` — small stylesheet for the theme
- `assets/images/profile-placeholder.svg` — placeholder profile image

## How to edit
1. Open `index.html` in an editor (VS Code, Notepad++, etc.).
2. Replace placeholder text (name, email, project descriptions).
3. Replace the profile image at `assets/images/profile-placeholder.svg` with your own image (same filename or update the src in `index.html`).

## How to upload
### GitHub Pages
1. Create a new repository on GitHub and push these files to the `main` branch.
2. In repository settings → Pages, select `main` / root and save. The site will be published at `https://<your-username>.github.io/<repo-name>/`.

### Netlify or Vercel
- Drag-and-drop the site folder to Netlify's "Sites" dashboard, or connect via Git and deploy automatically.
- For Vercel, use "Import Project" and choose the GitHub repo (set framework to "Other" or "Static").

### Azure Static Web Apps
- Create a Static Web App and link your GitHub repo. Set the app artifact location to `/` if using root files.

## Notes
- The contact form uses `mailto:` to open the user's email client. To enable server-side sending, replace the form `action` with your API endpoint or use a serverless function.
- This site is intentionally simple so you can edit it without a build step.
