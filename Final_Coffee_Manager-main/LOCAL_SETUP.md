# 🚀 Coffee Manager - Local Development Setup

## Prerequisites

- **Node.js 18+** and npm

## Quick Start

### 1. 📁 Get the Code

```bash
# Download or clone the project
# Extract if downloaded as zip
cd Final_Coffee_Manager-main
```

### 2. ⚡ Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend:** http://localhost:5173

## 🧪 Testing the Setup

### Test Frontend

Visit: http://localhost:5173

- Should show the Coffee Manager login page
- Try logging in with any credentials (standalone mode):
  - **Technician:** `tech1` / `password` (or any username with 'tech')
  - **Employee:** `user1` / `password` (or any other username)

## 🎯 Standalone Mode

The frontend currently runs in **standalone mode** with:

- ✅ **Mock authentication** (any credentials work)
- ✅ **Demo machine data** built-in
- ✅ **Local storage persistence** for all changes
- ✅ **Full functionality** without backend dependency

## 🔑 Demo Features

### ✅ Working Features

- **Authentication** with role simulation
- **Role-based access control** (technician vs employee)
- **Machine management** (supplies, maintenance, notes)
- **Electricity status management** (available/unavailable)
- **Dynamic alerts** based on supply levels and conditions
- **Supply refill tracking** with history
- **Real-time status updates**
- **Data persistence** across browser sessions

### 🎛️ Machine Management

- **View machine status** and supply levels
- **Edit electricity status** (technicians only)
- **Refill supplies** with automatic tracking
- **Manage alerts** and maintenance notes
- **Real-time analytics** and usage tracking

## 🔄 Development Workflow

1. **Install dependencies** (`npm install`)
2. **Start development server** (`npm run dev`)
3. **Open browser** to http://localhost:5173
4. **Login** with any credentials
5. **Develop and test** features in standalone mode

## 📝 Environment Variables

Current setup (standalone mode):

```env
VITE_STANDALONE_MODE=true
VITE_API_BASE_URL=http://localhost:8080/api
VITE_DEBUG=true
```

### Switching to Backend Integration

When backend becomes available:

```env
VITE_STANDALONE_MODE=false
VITE_API_BASE_URL=http://your-backend-url/api
```

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Start production server
npm run start
```

## 📖 Project Structure

```
Final_Coffee_Manager-main/
├── client/                    # React frontend
│   ├── components/ui/         # UI component library
│   ├── components/            # Coffee machine components
│   ├── pages/                 # Route components
│   ├── contexts/              # React contexts (Auth, etc.)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # API client & utilities
│   ├── App.tsx               # Main app component
│   └── global.css            # TailwindCSS styles
├── data/                      # Static data files
├── public/                    # Static assets
├── BACKEND_INTEGRATION.md     # Backend integration guide
├── AGENTS.md                  # Project documentation
└── package.json              # Dependencies and scripts
```

## 🎨 UI Components

Built with:
- **React 18** with TypeScript
- **TailwindCSS 3** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **React Router 6** for navigation

## 🐛 Troubleshooting

### Frontend Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear browser cache and localStorage
# Open DevTools → Application → Storage → Clear storage
```

### Port Issues

```bash
# Check if port 5173 is free
netstat -tulpn | grep 5173

# Start on different port
npm run dev -- --port 3000
```

### Build Issues

```bash
# Type check
npm run typecheck

# Format code
npm run format.fix
```

## 📋 Development Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Application accessible at http://localhost:5173
- [ ] Can login with any credentials
- [ ] Machine management features working
- [ ] Data persists across browser refresh

## 🔧 Backend Integration

When ready to integrate with backend:

1. See `BACKEND_INTEGRATION.md` for API requirements
2. Set `VITE_STANDALONE_MODE=false`
3. Configure `VITE_API_BASE_URL` to your backend
4. Backend team implements required endpoints
5. Frontend automatically switches to backend mode

## 📚 Key Files

- `client/lib/api.ts` - API client with standalone/backend modes
- `client/lib/dataManager.ts` - LocalStorage data management
- `client/pages/MachineManagement.tsx` - Main machine interface
- `client/contexts/AuthContext.tsx` - Authentication context
- `BACKEND_INTEGRATION.md` - Backend integration guide

Happy coding! 🎉

## 🤝 Team Collaboration

- **Frontend Team**: Can work completely independently
- **Backend Team**: Use `BACKEND_INTEGRATION.md` for requirements
- **Integration**: Seamless switch when backend is ready
