# Migewlito Deployment Guide

This project is configured for deployment on Vercel.

## ⚠️ Important Limitations

This application uses local files (JSON) for storing data (Users, Game Configs, etc.) and PHP Sessions for login.
**On Vercel, the filesystem is read-only and serverless functions are stateless.**

This means:
1.  **New registrations will NOT be saved permanently.**
2.  **Login might not work consistently** because PHP session files are not shared between serverless function instances.
3.  **Admin settings updates will revert** after a short time.

To make this application fully functional on Vercel, you would need to:
- Use an external database (MySQL, PostgreSQL, or Vercel KV) instead of local JSON files.
- Use a persistent session store (e.g., Redis) or JWT tokens for authentication.

## How to Deploy

### Option 1: Vercel CLI (If installed)

1.  Open a terminal in this folder.
2.  Run `vercel login`.
3.  Run `vercel`.
4.  Follow the prompts.

### Option 2: GitHub (Recommended)

1.  Create a new repository on GitHub.
2.  Push this code to the repository:
    ```bash
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <YOUR_REPO_URL>
    git push -u origin main
    ```
3.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
4.  Click "Add New..." -> "Project".
5.  Import your GitHub repository.
6.  Vercel will detect the `vercel.json` and deploy automatically.

## Project Structure

- `gogogo.com/en-ph/`: The main application code.
- `vercel.json`: Configuration to tell Vercel how to serve the PHP files and assets.
