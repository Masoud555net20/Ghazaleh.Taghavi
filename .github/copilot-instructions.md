# AI Agent Instructions - Ghazaleh Taghavi Legal Consultation

## 🏛️ Project Overview
This is a modern React + TypeScript + Vite application for Ghazaleh Taghavi, a top-tier lawyer in Hamedan, Iran. The website provides legal consultation services with AI-powered assistance, appointment booking, and payment processing.

## 🏗️ Architecture & Key Components

### Core Structure
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (no explicit config, uses inline classes)
- **AI Integration**: Groq API with Llama 3.1 model
- **PWA**: Vite PWA plugin for progressive web app capabilities

### Component Architecture
- **Main App (`App.tsx`)**: Root component with lazy-loaded sections
- **Hero Section (`Hero.tsx`)**: Image slideshow with Persian typography
- **Legal Assistant (`LegalAssistant.tsx`)**: AI-powered legal Q&A interface
- **Booking System (`Booking.tsx`)**: Appointment scheduling form
- **Payment System (`Payment.tsx`)**: Payment processing interface
- **Services/About/Process**: Marketing content sections

### Service Layer
- **`services/groqService.ts`**: Handles AI legal advice API calls
- **Environment Variables**: `VITE_GROQ_API_KEY` required for Groq API

## 🚀 Development Workflows

### Environment Setup
```bash
npm install
# Set API keys in .env.local:
VITE_GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
npm run dev  # Runs on http://localhost:3000
```

### Build & Deployment
```bash
npm run build    # Production build
npm run preview  # Preview production build
```

## 🎯 Project-Specific Conventions

### Persian Language Support
- All UI text is in Persian (Farsi)
- Uses custom Persian font: `IranNastaliq.ttf` in `public/Font/`
- RTL (right-to-left) layout considerations

### AI Integration Patterns
- **Legal Assistant**: Always includes disclaimer text and encourages formal consultation
- **Error Handling**: Graceful fallbacks for API failures
- **Response Formatting**: Automatic formatting of AI responses with bold highlights for consultation prompts

### Component Patterns
- **Reusable Form Fields**: `InputField` and `SelectField` components in Booking/Payment
- **Lazy Loading**: Non-critical sections loaded dynamically
- **Image Optimization**: Hero section uses optimized background images

## 🔑 Critical Integration Points

### External Dependencies
- **Groq API**: For AI legal assistance (`llama-3.1-8b-instant` model)
- **Environment Variables**: Must be set in `.env.local` for local development

### Cross-Component Communication
- **State Management**: Local React state (no external state library)
- **Service Integration**: Direct service imports for API calls
- **Form Handling**: Controlled components with local state

## 🛠️ Key Files & Directories

### Core Configuration
- `vite.config.ts` - Build configuration with PWA setup
- `tsconfig.json` - TypeScript configuration with path aliases
- `package.json` - Dependencies and scripts

### Main Components
- `App.tsx` - Root component with lazy loading
- `index.tsx` - React DOM rendering entry point

### Services
- `services/groqService.ts` - AI integration service

### Public Assets
- `public/Font/IranNastaliq.ttf` - Persian calligraphy font
- `public/*.png|jpg|webp` - Hero section images

## ⚠️ Important Considerations

1. **API Key Management**: Never commit actual API keys to version control
2. **Legal Disclaimer**: AI responses must always include consultation encouragement
3. **RTL Support**: Ensure proper right-to-left layout for Persian text
4. **Image Optimization**: Hero images are large - consider compression for production
5. **PWA Features**: Service worker and manifest are configured via Vite PWA plugin

## 🎨 Styling Approach
- Uses Tailwind CSS classes directly in components
- Custom animations defined in Hero component
- Responsive design with mobile-first approach
- Persian-specific typography styling

## 🔍 Debugging Tips
- Check browser console for Groq API errors
- Verify environment variables are properly loaded
- Test lazy loading components work correctly
- Validate Persian text rendering and RTL layout