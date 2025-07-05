# 🚀 Weather App Setup Guide

This guide will help you set up the Weather App locally with all required API keys.

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd weather-app
```

### 2. Install Dependencies

```bash
# Install all dependencies (backend + frontend)
npm run install-all

# OR install manually:
cd backend && npm install
cd frontend && npm install
```

### 3. 🔑 Configure API Keys

#### Step 3.1: Create Environment File

```bash
cd backend
cp .env.example .env
```

#### Step 3.2: Get Required API Keys

##### ✅ **Required: OpenWeatherMap API** (Free)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to "API Keys" section
4. Copy your API key
5. Add to `.env` file:
   ```env
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

##### 🎯 **Optional: YouTube Data API** (Free - for travel videos)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Add to `.env` file:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

##### 🗺️ **Optional: Google Maps API** (Free tier available)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps Embed API" and "Geocoding API"
3. Create credentials (API Key)
4. Add to `.env` file:
   ```env
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

#### Step 3.3: Final .env File Example

```env
# Required
OPENWEATHER_API_KEY=abc123def456ghi789

# Optional (remove # to enable)
YOUTUBE_API_KEY=xyz789abc123def456
GOOGLE_MAPS_API_KEY=map123key456token789

# Server Config
PORT=3001
```

### 4. 🚀 Run the Application

#### Option 1: One Command (Recommended)

```bash
npm run dev
```

This starts both backend (port 3001) and frontend (auto-detected port).

#### Option 2: Manual Setup

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**

```bash
cd backend/frontend
npm run dev
```

### 5. 🌐 Access Your App

- **Frontend**: Open the URL shown in terminal (usually http://localhost:5173)
- **Backend API**: http://localhost:3001

## ✅ Verify Installation

1. **Weather Search**: Try searching for "London" or "New York"
2. **GPS Location**: Click "Use My Location" button
3. **History**: Check the "Search History" tab
4. **Export**: Try downloading CSV/JSON data

## 🎯 Features Available

### With OpenWeatherMap API Only:

- ✅ Current weather data
- ✅ 5-day forecasts
- ✅ GPS location support
- ✅ Search history with CRUD operations
- ✅ Data export (CSV/JSON)

### With All APIs:

- ✅ All above features
- ✅ YouTube travel videos for locations
- ✅ Interactive Google Maps

## 🔧 Troubleshooting

### Common Issues:

**1. "API key not found" errors:**

- Check `.env` file exists in `backend/` folder
- Verify API keys are correct (no extra spaces)
- Restart the backend server after adding keys

**2. CORS errors:**

- Make sure backend is running on port 3001
- Check if frontend is trying to connect to correct backend URL

**3. Port conflicts:**

- If port 3001 is busy, change PORT in `.env` file
- Update frontend API calls if you change backend port

**4. Location not working:**

- Allow location access in browser
- Try typing location manually if GPS fails

## 📁 Project Structure

```
weather-app/
├── .gitignore              # Protects sensitive files
├── package.json            # Root package with scripts
├── README.md               # Main documentation
├── SETUP.md               # This setup guide
└── backend/
    ├── server.js          # Express server
    ├── package.json       # Backend dependencies
    ├── .env              # API keys (not in git)
    ├── .env.example      # Template for API keys
    ├── db/               # SQLite database
    └── frontend/         # React app
        ├── src/
        │   ├── App.jsx   # Main component
        │   └── App.css   # Styles
        └── package.json  # Frontend dependencies
```

## 🆘 Need Help?

1. Check that all API keys are correctly set in `.env`
2. Ensure both servers are running
3. Verify Node.js version (v16+)
4. Check browser console for errors

## 🔒 Security Notes

- ✅ `.env` file is protected by `.gitignore`
- ✅ API keys are never committed to Git
- ✅ Use `.env.example` as template for new setups
- ⚠️ Never share your actual API keys publicly

---

**🎉 You're all set! Enjoy exploring weather data around the world!**
