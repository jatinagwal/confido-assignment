# Setup Guide - Confido Agent Manager

Quick setup guide to get your React app running in 5 minutes.

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- React 18
- TypeScript
- Vite (build tool)
- Axios (HTTP client)

## Step 2: Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 3: Open Browser

Visit http://localhost:3000

You'll see the login screen.

## Step 4: Configure API Keys

Edit the `.env` file and add your API keys:

```bash
# Edit .env file
nano .env

# Add your keys:
VITE_ELEVENLABS_API_KEY=your_actual_key_here
VITE_CALCOM_API_KEY=your_calcom_key
```

## Step 5: Login

Use the demo credentials:
- **Username**: `admin`
- **Password**: `demo123`

These can be changed in the `.env` file.

## Step 6: Test Balance Warning

To test the low balance warning:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this code:

```javascript
// Simulate low balance
localStorage.setItem('test_low_balance', 'true');
location.reload();
```

The warning banner should appear.

## Step 7: Create Your First Agent

1. Click "Create Agent" button
2. Watch the progress messages
3. Wait for "Agent created successfully!" message
4. Your agent appears in the list below

## Troubleshooting

### npm install fails

**Error**: `EPERM` or permission denied

**Fix**: Run with sudo or fix npm permissions:
```bash
sudo chown -R $USER ~/.npm
```

### Port 3000 already in use

**Fix**: Kill the process or use a different port:
```bash
# Kill process
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.ts
```

### "Module not found" errors

**Fix**: Clear and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Login fails with "Invalid credentials"

**Check**:
- Username: `admin`
- Password: `demo123`
- Or check custom credentials in `.env` file

### API operations fail

**Check**:
- `.env` file has `VITE_ELEVENLABS_API_KEY` set
- API key starts with `sk_`
- Restart dev server after changing `.env`

### Agent creation fails

**Check**:
- Knowledge base files exist in `/frontend/public/knowledge_base/`
- `agent_config.json` exists in `/frontend/public/`
- Sufficient character balance in your account

## File Checklist

Ensure these files exist:

```
frontend/
├── public/
│   ├── knowledge_base/
│   │   ├── insurance_providers.md
│   │   ├── clinic_information.md
│   │   └── edge_cases.md
│   └── agent_config.json
└── src/
    └── (all source files)
```

If missing, copy from root:
```bash
cp -r knowledge_base frontend/public/
cp agent_config.json frontend/public/
```

## Production Build

When ready for production:

```bash
npm run build
```

This creates optimized files in `/frontend/dist/`.

Deploy the `/dist` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting

## Next Steps

- Customize `agent_config.json` for your use case
- Update knowledge base documents
- Add your branding/logo
- Set up a custom domain
- Implement backend proxy for security

## Need Help?

Check the main README_REACT.md for detailed documentation.

