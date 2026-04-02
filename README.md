# CineScope - Full Stack Movie Recommendation App

CineScope is a full-stack movie recommendation web application inspired by Netflix, featuring a dynamic 3D user interface, JWT authentication, and personalized favorites using TMDB API.

## 🚀 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Python FastAPI, Motor (Async MongoDB), pyjwt
- **Database**: MongoDB
- **External API**: TMDB API

## ⚙️ Features
- **Netflix-Style UI**: Modern dark theme with 3D CSS hover effects on movie cards.
- **JWT Authentication**: Secure user signup, login, and protected routes.
- **Dynamic Content**: Shows trending, top-rated, and personalized movie rows.
- **Favorites System**: Users can save movies to their list.
- **Async Backend**: High-performance FastAPI server communicating with MongoDB and TMDB securely.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.9+
- Node.js v18+
- MongoDB instance (local or Atlas)
- TMDB API Key (Get from [here](https://developers.themoviedb.org/3/getting-started/introduction))

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your details:
   ```env
   TMDB_API_KEY=your_api_key
   MONGODB_URI=mongodb://localhost:27017
   DATABASE_NAME=cinescope
   SECRET_KEY=generate_a_secure_key
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   *FastAPI docs will be running at `http://localhost:8000/docs`*

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The app will be accessible at `http://localhost:5173`*

## 🎬 Architecture & 3D Implementation
- **API Calls**: The frontend NEVER calls TMDB directly to ensure security. FastAPI acts as the intermediary proxying securely.
- **UI Architecture**: Component-based layout (`MovieRow`, `MovieCard`, `Navbar`) optimized to reduce unnecessary re-renders via Vite + React hooks.
- **3D Effects**: Built using CSS `perspective`, `translateZ`, and `rotateX` seamlessly integrated into the Tailwind styling for lightweight, hardware-accelerated 3D effects.
