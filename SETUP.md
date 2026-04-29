# Daily Planner & Journal - Setup Guide

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd daily-planner
npm install
```

### 2. Set Up MongoDB

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user and get connection string
4. Copy the connection string and replace credentials

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in required variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daily-planner
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -hex 32
```

### 4. (Optional) Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy Client ID and Client Secret to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and create your account!

## Deployment to Vercel

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Import to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select your repository
- Click "Import"

### 3. Set Environment Variables
In Vercel dashboard, go to Settings → Environment Variables and add:
- `MONGODB_URI`
- `NEXTAUTH_URL` (use your Vercel domain)
- `NEXTAUTH_SECRET` (generate new one)
- `GOOGLE_CLIENT_ID` (if using OAuth)
- `GOOGLE_CLIENT_SECRET` (if using OAuth)

### 4. Deploy
Click "Deploy" and wait for build to complete!

## Production Checklist

- [ ] MongoDB URI configured with production cluster
- [ ] NEXTAUTH_SECRET is strong and securely generated
- [ ] NEXTAUTH_URL matches your production domain
- [ ] Google OAuth credentials configured (if using)
- [ ] All environment variables set in Vercel
- [ ] Custom domain configured (if desired)
- [ ] Analytics enabled in Vercel dashboard

## Troubleshooting

### Database Connection Issues
- Verify MongoDB URI is correct
- Check MongoDB Atlas firewall allows your IP
- Ensure database name matches in URI

### Authentication Issues
- Clear browser cookies and try again
- Verify NEXTAUTH_URL matches your domain
- Check NEXTAUTH_SECRET is set correctly

### 3D Components Not Loading
- Ensure `@react-three/fiber` and `@react-three/drei` are installed
- Check browser supports WebGL (most modern browsers do)
- Try different browser if issues persist

## Support

For issues or questions:
1. Check the README.md for API documentation
2. Review error messages in browser console
3. Check server logs with `npm run dev`

Happy planning!
