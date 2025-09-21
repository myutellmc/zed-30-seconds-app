# Zed 30 Seconds ⏱️

A focused 30-second timer app designed to help you stay productive with quick, focused time blocks. This Progressive Web App (PWA) helps you implement micro-productivity sessions, perfect for quick tasks, breaks, or focused work intervals.

## Features

### ⚡ Core Timer Features
- **30-Second Focus Timer**: Perfect for quick tasks and micro-productivity
- Clean, minimal interface focused on the essential: time
- Visual and audio notifications when timer completes
- Start/stop/reset functionality

### 📱 Progressive Web App (PWA)
- **Installable**: Add to your home screen on mobile and desktop
- **Offline Support**: Works without internet connection
- **Native App Experience**: Runs in standalone mode
- **Background Notifications**: Get alerts even when the app isn't active
- **Quick Shortcuts**: Launch with pre-configured 30s timer

### 🎨 Design
- **Professional Stopwatch Icon**: Custom-designed stopwatch icon similar to ⏱️ emoji
  - Traditional stopwatch design with metallic chrome finish
  - Clear 60-second dial with 30-second highlight
  - Red accent hand pointing to 30 seconds
  - Professional side button and crown details
  - Small seconds sub-dial for authenticity
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark/Light Mode**: Follows your system preferences
- **Accessible**: Built with accessibility in mind

## PWA Implementation

### Web App Manifest
- **Name**: "Zed 30 Seconds" with short name "Zed 30s"
- **Icons**: Custom stopwatch SVG icon in multiple sizes
- **Display Mode**: Standalone for native app experience
- **Theme Colors**: Red accent theme (#ff4444) for timer focus
- **Shortcuts**: Quick access to start 30s timer immediately

### Service Worker Features
- **Offline Caching**: Essential app files cached for offline use
- **Background Sync**: Synchronizes timer data when connection returns
- **Push Notifications**: Timer completion alerts
- **Cache Management**: Automatic cleanup of old cache versions

### Installation
Users can install this as a native app:
- **Chrome**: Look for the "Install" prompt or use the menu
- **Safari iOS**: Use "Add to Home Screen"
- **Edge**: Click the "Install" button in the address bar
- **Firefox**: Use "Install" from the page actions menu

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Convex (for data persistence)
- **Authentication**: Convex Auth
- **PWA**: Custom Service Worker + Web App Manifest

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Deploy
pnpm deploy
```

## File Structure

```
/
├── public/
│   ├── stopwatch-icon.svg      # Custom stopwatch icon
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                  # Service worker
│   └── zed-30-seconds-logo.png # Fallback logo
├── src/
│   ├── components/            # React components
│   ├── pages/                # App pages
│   └── ...
└── index.html                # Updated with PWA meta tags
```

## PWA Features Checklist

✅ **Web App Manifest** - Complete app metadata and icons  
✅ **Service Worker** - Offline support and caching  
✅ **Installable** - Add to home screen functionality  
✅ **Responsive Design** - Works on all device sizes  
✅ **Offline Functionality** - Core features work offline  
✅ **Push Notifications** - Timer completion alerts  
✅ **Background Sync** - Data sync when online  
✅ **App Shortcuts** - Quick actions from home screen  
✅ **Theme Integration** - Follows system color scheme  
✅ **Security** - HTTPS required (handled by deployment platform)

## Usage

1. **Quick Timer**: Open the app and start a 30-second timer immediately
2. **Install**: Add to your home screen for quick access
3. **Offline**: Use even without internet connection
4. **Notifications**: Get alerted when your timer completes
5. **Shortcuts**: Use the installed app's shortcuts for instant timer start

Perfect for:
- Pomodoro technique micro-sessions
- Quick task sprints
- Break reminders
- Focused work intervals
- Productivity experiments

---

*Built with modern web technologies to provide a native app experience in your browser.*
