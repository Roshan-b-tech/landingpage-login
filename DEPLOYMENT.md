# Deployment Guide

This document provides instructions for deploying the PopX application to Netlify (frontend) and Render (backend).

## Frontend Deployment to Netlify

1. **Create a Netlify account**
   - Go to [netlify.com](https://www.netlify.com/) and sign up or log in

2. **Deploy your site using one of these methods:**

   ### Option 1: Deploy via Netlify UI
   
   - Click on "New site from Git"
   - Connect to your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository
   - Set build command to: `npm run build`
   - Set publish directory to: `dist`
   - Click "Deploy site"

   ### Option 2: Deploy using Netlify CLI
   
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Initialize and deploy
   cd /path/to/your/project
   netlify init
   netlify deploy --prod
   ```

3. **Add environment variables in Netlify**
   - Go to Site settings > Build & deploy > Environment
   - Add the following variable:
     - Key: `VITE_API_URL`
     - Value: `https://your-backend-app.onrender.com/api` (use your actual Render URL)

4. **Set up redirects for SPA routing**
   - The `netlify.toml` file in your project already contains the necessary redirects configuration
   - This ensures that all routes are handled by your React Router

## Backend Deployment to Render

1. **Create a Render account**
   - Go to [render.com](https://render.com/) and sign up or log in

2. **Create a new Web Service**
   - Click on "New" and select "Web Service"
   - Connect your Git repository or use the "manual deploy" option
   - For manual deploy, you'll need to push your server code to a separate repository

3. **Configure your service**
   - Name: Choose a name for your service (e.g., "popx-api")
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Set the root directory to `server` if your backend is in a subdirectory

4. **Add environment variables**
   - Scroll down to the "Environment" section
   - Add the following variables:
     - `PORT`: `3000` (Render will override this with its own port)
     - `FRONTEND_URL`: Your Netlify app URL (e.g., `https://your-app.netlify.app`)

5. **Deploy the service**
   - Click "Create Web Service"
   - Render will build and deploy your app

6. **Update your frontend configuration**
   - Once your backend is deployed, copy the Render URL
   - Update the `VITE_API_URL` environment variable in Netlify with this URL
   - Trigger a new deploy in Netlify to apply the changes

## Connecting Frontend to Backend

After deploying both services:

1. Get your Render backend URL: `https://your-backend-app.onrender.com`
2. Update your frontend's `.env.production` file with: `VITE_API_URL=https://your-backend-app.onrender.com/api`
3. Redeploy your frontend to Netlify

## Testing the Deployment

1. Visit your Netlify URL
2. Test registration and login functionality
3. Verify that profile images are being saved correctly
4. Check that the navigation is working as expected

## Troubleshooting

- **CORS issues**: Ensure the `FRONTEND_URL` in your backend environment variables matches your Netlify domain
- **API connection errors**: Check network requests in the browser developer tools to identify issues
- **Build failures**: Review the build logs in Netlify or Render for specific error messages 