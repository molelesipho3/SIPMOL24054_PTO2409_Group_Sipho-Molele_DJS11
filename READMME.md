# 🎵 PodcastHub - Your Gateway to Audio Stories

A modern, full-featured podcast streaming application built with React, TypeScript, and Tailwind CSS. Discover thousands of podcasts, manage your favorites, and never miss an episode with our intuitive platform.

## ✨ Features

### 🎧 Audio Experience
- **Seamless Audio Playback**: High-quality streaming with progress tracking
- **Always-Visible Player**: Continue listening while browsing
- **Resume Functionality**: Pick up exactly where you left off
- **Volume Control**: Adjust audio levels to your preference
- **Episode Completion Tracking**: Mark episodes as completed automatically

### 👤 User Management
- **Secure Authentication**: Username/password login and registration
- **Personal Profiles**: Customize your account information
- **Listening Statistics**: Track your podcast journey
- **Data Management**: Clear listening history and reset progress

### ❤️ Favorites & Organization
- **Favorite Episodes**: Save episodes you love for easy access
- **Smart Grouping**: Favorites organized by show and season
- **Multiple Sort Options**: Sort by title, date added, or update time
- **Quick Access**: View recent favorites from your profile

### 🔍 Discovery & Browsing
- **Advanced Search**: Find podcasts by title or description
- **Genre Filtering**: Browse by 9 different categories
- **Smart Sorting**: Multiple sorting options (A-Z, newest, oldest)
- **Show Details**: View seasons, episodes, and descriptions
- **Season Navigation**: Easy switching between different seasons

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Modern UI**: Beautiful gradients and smooth animations
- **Accessible**: Built with accessibility best practices
- **Fast Loading**: Optimized performance with loading states

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd podcasthub
   ```

2. **Install dependencies**
   ```bash
   npm install or pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev or pnpm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` or `http://192.168.0.196:8080/` to view the application

### Building for Production

```bash
npm run build or pnpm run build 
```

The built files will be in the `dist` directory, ready for deployment.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Build Tool**: Vite for fast development and building
- **Audio API**: HTML5 Audio API with custom hooks
- **Data Fetching**: Fetch API with custom service layer
- **Routing**: React Router DOM
- **Storage**: LocalStorage for user data and preferences
- **Icons**: Lucide React for consistent iconography

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── ui/              # Base UI components (shadcn)
│   ├── AudioPlayer.tsx  # Global audio player
│   ├── Dashboard.tsx    # Main application dashboard
│   ├── LandingPage.tsx  # Welcome/landing page
│   ├── PodcastCard.tsx  # Podcast preview cards
│   ├── ShowView.tsx     # Detailed show view
│   ├── ProfileView.tsx  # User profile management
│   └── FavoritesView.tsx # Favorites management
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication logic
│   ├── useAudioPlayer.ts # Audio playback management
│   └── useFavorites.ts  # Favorites management
├── services/            # API and external services
│   └── podcastApi.ts    # Podcast data fetching
├── types/               # TypeScript type definitions
│   └── podcast.ts       # Core data types
├── pages/               # Route components
│   ├── Index.tsx        # Main entry point
│   └── NotFound.tsx     # 404 error page
└── assets/              # Static assets
    └── favicon.png      # Application icon
```

## 🎨 Design System

PodcastHub features a modern design system with:

- **Purple Primary Theme**: Professional purple gradient (#8B5CF6)
- **Orange Accent Colors**: Warm orange highlights (#F97316)
- **Responsive Typography**: Clear hierarchy and readability
- **Smooth Animations**: 300ms transitions with cubic-bezier easing
- **Glass Morphism**: Subtle backdrop blur effects
- **Shadow System**: Elevated cards with custom glows

## 📊 API Integration

The application integrates with the Podcast API (https://podcast-api.netlify.app) to provide:

- **Show Previews**: Browse thousands of available podcasts
- **Detailed Show Data**: Complete season and episode information
- **Genre Information**: Categorized content discovery
- **Real Audio Files**: Actual podcast episodes for streaming

### Supported Genres
1. Personal Growth
2. Investigative Journalism
3. History
4. Comedy
5. Entertainment
6. Business
7. Fiction
8. News
9. Kids and Family

## 💾 Data Storage

All user data is stored locally using browser LocalStorage:

- **User Accounts**: Login credentials and profile information
- **Favorites**: Saved episodes with metadata
- **Listening Progress**: Episode completion and time tracking
- **Preferences**: Sort orders and UI settings

## 🔧 Key Features Implementation

### Audio Player
- Built with HTML5 Audio API
- Custom hooks for state management
- Progress tracking and resume functionality
- Volume controls and playback management

### Authentication
- Local storage-based user management
- Profile customization and editing
- Secure password handling
- Session persistence

### Favorites System
- Episode-level favoriting with show context
- Grouped display by show and season
- Multiple sorting and filtering options
- Bulk management capabilities

### Search & Filtering
- Real-time search across titles and descriptions
- Genre-based filtering
- Multiple sort options (alphabetical, date-based)
- Results count and status indicators

## 🎯 User Stories Completed

This implementation fulfills all core requirements including:

- ✅ Alphabetical sorting by default
- ✅ Episode playback functionality
- ✅ Season-specific views and navigation
- ✅ Show preview images and metadata
- ✅ Genre display and filtering
- ✅ Favorites management with persistence
- ✅ Loading states for data fetching
- ✅ Responsive design for all devices
- ✅ Progress tracking and completion status
- ✅ Data reset and management options

