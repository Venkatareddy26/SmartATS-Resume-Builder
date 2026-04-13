# SmartATS React Frontend

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

Or use the setup script:

```powershell
# Windows PowerShell
.\setup.ps1
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

### 3. Build for Production

```bash
npm run build
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Zustand** - State management
- **TanStack Query** - Server state
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   └── layout/         # Layout components
├── pages/              # Page components
│   ├── LandingPage.tsx    ✅ Complete
│   ├── AuthPage.tsx       📝 Placeholder
│   ├── DashboardPage.tsx  📝 Placeholder
│   ├── EditorPage.tsx     📝 Placeholder
│   └── ...
├── store/              # State management
│   └── authStore.ts       ✅ Complete
├── lib/                # Utilities
│   └── api.ts             ✅ Complete
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_AI_SERVICE_URL=http://localhost:8000
VITE_ENV=development
```

### Vite Configuration

See `vite.config.ts` for:
- Path aliases (@/)
- Proxy configuration
- Build optimization

### TypeScript Configuration

See `tsconfig.json` for:
- Strict mode
- Path mapping
- ES2020 target

## 🎨 Styling

### Tailwind CSS

Custom configuration in `tailwind.config.js`:

```javascript
colors: {
  primary: '#5048e5',
  background: {
    light: '#f6f6f8',
    dark: '#121121',
  },
}
```

### Custom Classes

```css
.btn-primary      /* Primary button */
.btn-secondary    /* Secondary button */
.input-field      /* Input field */
.card             /* Card container */
.editable-field   /* Editable text field */
```

## 🔌 API Integration

### Using the API Client

```typescript
import { authAPI, resumeAPI, aiAPI } from '@/lib/api'

// Authentication
const { data } = await authAPI.login({ email, password })

// Resume operations
const resumes = await resumeAPI.getAll()

// AI operations
const analysis = await aiAPI.analyze({ resume_text })
```

### Using React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['resumes'],
  queryFn: resumeAPI.getAll,
})
```

### Using Zustand Store

```typescript
import { useAuthStore } from '@/store/authStore'

const { user, isAuthenticated, login, logout } = useAuthStore()
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Type Checking

```bash
npm run type-check
```

## 📦 Building

### Development Build

```bash
npm run build
```

Output: `dist/` folder

### Preview Build

```bash
npm run preview
```

## 🚀 Deployment

### Vercel

```bash
vercel deploy
```

### Netlify

```bash
netlify deploy --prod
```

### Manual Deployment

1. Build: `npm run build`
2. Upload `dist/` folder to your hosting

## 🔍 Troubleshooting

### Dependencies Not Installing

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173
```

### TypeScript Errors

```bash
# Check types
npm run type-check
```

## 📚 Documentation

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and type check
4. Submit a pull request

## 📄 License

Proprietary - All rights reserved
