# Confido Agent Manager

A modern React application for managing ElevenLabs conversational AI agents with automatic balance monitoring and one-click agent creation.

## ✨ Features

- 🔐 **Secure Login** with API key validation
- 📊 **Real-Time Balance Monitoring** with subscription stats
- ⚠️ **Automatic Low Balance Warning** - Popup appears when < 1,000 characters remain
- 🤖 **One-Click Agent Creation** - Automatically uploads knowledge base and creates agent
- 📋 **Agent Management Dashboard** - View and manage all your agents
- ⚙️ **Easy API Key Updates** - Update keys directly from the warning popup
- 🎨 **Modern, Responsive UI** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- ElevenLabs API key ([Get one here](https://elevenlabs.io))
- Cal.com API key (optional, pre-configured)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure .env file (one-time setup)
#    Either copy the example:
cp .env.example .env
#    OR run the helper script:
./UPDATE_ENV.sh

# 3. Edit .env and add your ElevenLabs API key
nano .env

# 4. Start development server (reads .env automatically)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Note**: Vite automatically loads `.env` - no extra steps needed after initial setup!

### Quick Start Script

```bash
# Easy one-command start (after .env is configured once)
./RUN_APP.sh
```

**Demo Login:**
- Username: `admin`
- Password: `demo123`

## 📖 How to Use

### 1. Login

Use the demo credentials:
- **Username**: `admin`
- **Password**: `demo123`

API keys are configured in the `.env` file (not entered at login).

### 2. Dashboard

View your:
- Subscription tier (free, starter, creator, pro, etc.)
- Character usage (used / total)
- Account status

### 3. Low Balance Warning

When your remaining balance drops below 1,000 characters:

- ⚠️ **Yellow warning banner appears automatically**
- Shows exact remaining character count
- Click **"Update API Key"** button
- Enter new API key in popup modal
- Dashboard refreshes with new account data

### 4. Create Agent

Click **"Create Agent"** button to:

1. Upload 3 knowledge base documents:
   - `insurance_providers.md` - Insurance information
   - `clinic_information.md` - Clinic details  
   - `edge_cases.md` - Special scenarios and protocols

2. Configure agent with:
   - System prompt (Ava, the AI front-desk assistant)
   - Cal.com integration tools (get slots, book meetings)
   - Voice settings (ElevenLabs Turbo V2)
   - Complete conversation configuration

3. Create agent on ElevenLabs

Watch real-time progress messages, then see your agent in the list!

### 5. View Agents

- See all created agents
- View agent IDs and creation dates
- Click "View in Dashboard" to test/manage in ElevenLabs

## 📂 Project Structure

```
confido/
├── src/                        # React application source
│   ├── components/            # UI components
│   │   ├── Login.tsx         # Login with API validation
│   │   ├── BalanceWarning.tsx # Low balance alert
│   │   ├── AgentCreator.tsx  # Agent creation workflow
│   │   └── AgentList.tsx     # Display agents
│   ├── pages/
│   │   └── Dashboard.tsx     # Main dashboard
│   ├── services/
│   │   └── api.ts           # ElevenLabs & Cal.com APIs
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── utils/
│   │   └── storage.ts       # LocalStorage management
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                   # Static assets
│   ├── knowledge_base/      # Knowledge base documents
│   │   ├── insurance_providers.md
│   │   ├── clinic_information.md
│   │   └── edge_cases.md
│   └── agent_config.json   # Complete agent configuration
│
├── scripts/                 # CLI utilities (optional)
│   ├── setup_complete_agent.sh
│   ├── upload_knowledge_base.sh
│   └── create_agent.sh
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env                    # Your API keys (gitignored)
└── README.md               # This file
```

## ⚙️ Configuration

### API Keys Setup

**One-time setup** - The app automatically reads from `.env`:

1. Create `.env` file (choose one method):
   ```bash
   # Option A: Copy example file
   cp .env.example .env
   
   # Option B: Use helper script
   ./UPDATE_ENV.sh
   ```

2. Edit `.env` and add your ElevenLabs API key:
   ```bash
   nano .env
   ```
   
   Update this line:
   ```env
   VITE_ELEVENLABS_API_KEY=your_actual_elevenlabs_key
   ```

3. Start the app - it automatically loads `.env`:
   ```bash
   npm run dev
   ```

**That's it!** Vite reads `.env` automatically at startup.

### Demo Login Credentials

Default credentials (can be changed in `.env`):
- **Username**: `admin`
- **Password**: `demo123`

### Agent Configuration

The complete agent configuration is in `public/agent_config.json`. This includes:

- **System Prompt**: Complete instructions for Ava, the AI assistant
- **Voice Settings**: ElevenLabs Turbo V2 with optimized parameters
- **Tools**: Cal.com integration (get_available_slots, book_meeting)
- **Conversation Config**: Turn-taking, ASR, TTS settings
- **Knowledge Base**: References to uploaded documents
- **Guardrails**: HIPAA compliance, emergency protocols

**Note**: The agent configuration has been preserved exactly as originally specified.

### Knowledge Base

Edit documents in `public/knowledge_base/`:

- **insurance_providers.md** - Insurance companies accepted (BCBS, Aetna, UHC, etc.)
- **clinic_information.md** - Clinic location, hours, services, contact info
- **edge_cases.md** - Emergency protocols, HIPAA, difficult scenarios

Changes take effect on next agent creation.

### Environment Variables

The `.env` file contains all configuration:

```env
# ElevenLabs API Key (required)
VITE_ELEVENLABS_API_KEY=your_key_here

# Cal.com API Key
VITE_CALCOM_API_KEY=cal_live_a28b9f72176dfa472dfdc61a97ab553e

# Demo Login
VITE_DEMO_USERNAME=admin
VITE_DEMO_PASSWORD=demo123
```

**Note**: Vite requires `VITE_` prefix for environment variables to be accessible in the browser.

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Tech Stack

- **React 18** + TypeScript
- **Vite** - Lightning fast build tool
- **Axios** - HTTP client
- **ElevenLabs API** - Agent creation & management
- **Cal.com API** - Appointment scheduling

## 🔐 Security

### Current Implementation
- API keys stored in browser localStorage
- Direct API calls from browser to ElevenLabs/Cal.com
- No backend server required

### Production Recommendations

For production deployment:

1. **Implement Backend Proxy**
   - Store API keys securely on server
   - Proxy requests through backend
   - Add rate limiting

2. **Add Authentication**
   - Proper user authentication system
   - JWT tokens
   - Role-based access control

3. **Enable HTTPS**
   - Use SSL certificates
   - Set security headers

4. **Monitor Usage**
   - Track API usage
   - Set up alerts
   - Log errors

## 📊 API Integration

### ElevenLabs API

```typescript
// Get subscription info
GET /v1/user/subscription

// Create knowledge base document
POST /v1/convai/knowledge-base/text
Body: { text: string, name: string }

// Create agent
POST /v1/convai/agents/create
Body: { conversation_config: {...} }

// List agents
GET /v1/convai/agents
```

### Cal.com API

```typescript
// Get available slots
GET /v2/slots?start=YYYY-MM-DD&end=YYYY-MM-DD&eventTypeId=3915550

// Create booking
POST /v2/bookings
Body: { start, eventTypeId, attendee: {...} }
```

## 🐛 Troubleshooting

### Installation Issues

**npm install fails with EPERM error**
```bash
sudo chown -R $USER ~/.npm
npm install
```

### Login Issues

**"Invalid username or password"**
- Default credentials: `admin` / `demo123`
- Check `.env` for custom credentials
- Credentials are: `VITE_DEMO_USERNAME` and `VITE_DEMO_PASSWORD`

**API calls failing**
- Verify `VITE_ELEVENLABS_API_KEY` is set in `.env`
- Key should start with `sk_`
- Restart dev server after changing `.env`

### Agent Creation Fails

**"Failed to upload knowledge base"**
- Verify files exist in `public/knowledge_base/`
- Check files are not empty
- Review browser console for errors

**"Failed to create agent"**
- Ensure sufficient character balance
- Verify `agent_config.json` is valid JSON
- Check API key permissions

### Balance Warning Not Showing

- Must have less than 1,000 characters remaining
- Refresh the page
- Check browser console for errors

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.ts
```

## 🚀 Production Deployment

### Build

```bash
npm run build
```

Generates optimized files in `/dist/`.

### Deploy

Deploy the `/dist` folder to:

- **Vercel** (recommended)
  ```bash
  npm install -g vercel
  vercel
  ```

- **Netlify**
  ```bash
  netlify deploy --prod --dir=dist
  ```

- **AWS S3 + CloudFront**
- **Any static hosting service**

### Environment Variables

Set these in your hosting platform:
- `VITE_ELEVENLABS_API_BASE`
- `VITE_CALCOM_API_BASE`

## 🛠️ CLI Scripts (Optional)

Command-line scripts are available in `scripts/` folder for automation:

```bash
# Complete setup (uploads KB + creates agent)
./scripts/setup_complete_agent.sh

# Or step by step:
./scripts/upload_knowledge_base.sh
./scripts/create_agent.sh
```

Useful for:
- CI/CD pipelines
- Automation scripts
- Batch operations

## 📚 Agent Configuration Details

The agent is configured with:

### Identity
- **Name**: Confido Health AI Assistant
- **Persona**: Ava, warm and empathetic front-desk assistant
- **Role**: Administrative tasks (NOT medical advice)

### Capabilities
- ✅ Appointment scheduling via Cal.com
- ✅ Insurance verification (10+ major providers)
- ✅ Clinic information (hours, location, services)
- ✅ Emergency detection and escalation
- ✅ HIPAA privacy protocols
- ✅ Minor patient handling
- ✅ After-hours routing

### Tools Integrated
1. **calcom_get_available_slots** - Check appointment availability
2. **book_meeting** - Create appointments
3. **end_call** - Properly close conversations

### Guardrails
- Never provides medical advice or diagnosis
- Escalates emergencies immediately (911)
- Maintains HIPAA compliance
- Verifies identity before discussing personal info
- Transfers complex issues to appropriate staff

## 🤝 Support

### Resources
- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [Cal.com API Reference](https://cal.com/docs/api-reference)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

### Issues
- Check browser console for errors
- Review network tab for API failures
- Verify API keys are correct
- Ensure files exist in `public/` folder

## 📝 License

This project is part of the Confido Health AI Agent system.

---

**Ready to start?**

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your ElevenLabs API key! 🚀
