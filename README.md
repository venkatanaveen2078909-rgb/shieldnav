# 🛡️ ShieldNav – AI-Powered Accident-Aware Route Planner

ShieldNav is a **safety-first navigation web application** that helps users choose **safer routes**, not just faster ones.  
Instead of focusing only on travel time, ShieldNav analyzes **accident-prone zones**, calculates a **safety score**, and provides **real-time warnings and emergency support**.

Built with **React, Vite, Leaflet (OpenStreetMap), OSRM, and Supabase**.

---

## 🚀 Features

### 🗺️ Smart Route Planning
- Source → Destination routing
- Multiple route options
- Routes visualized on map using **Leaflet**
- No Google Maps dependency

### ⚠️ Accident-Aware Safety Scoring
- Uses accident hotspot data from Supabase
- Calculates safety score (0–100)
- Highlights high-risk zones on the map
- Prioritizes safer routes over shortest routes

### 🔐 Authentication
- Secure login & signup using **Supabase Auth**
- Protected dashboard access

### 🧭 Navigation Mode
- Live navigation view
- Proximity-based accident alerts
- Voice warnings for high-risk zones

### 🆘 Emergency SOS
- One-tap emergency button
- Shares live location
- Uses saved emergency contacts

---

## 🏗️ Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS

### Maps & Routing
- Leaflet.js
- OpenStreetMap
- OSRM (Open Source Routing Machine)

### Backend
- Supabase
  - Authentication
  - Database (accident hotspots, emergency contacts)

### Browser APIs
- Geolocation API
- Web Speech API (voice alerts)

---

## 📁 Project Structure


src/ ├── assets/          # Images & logos ├── components/      # Reusable UI components ├── hooks/           # Custom React hooks ├── integrations/    # External service integrations ├── lib/             # Core logic (routing, safety score) ├── pages/           # App screens (Dashboard, Auth, etc.) ├── App.tsx          # App routing & layout └── main.tsx         # Entry point
supabase/ ├── migrations/      # Database migrations └── config.toml      # Supabase config


---

## 🧠 How ShieldNav Works

1. User logs in using Supabase Authentication  
2. Dashboard loads with Leaflet map  
3. User selects source & destination  
4. OSRM calculates possible routes  
5. Accident hotspots are fetched from Supabase  
6. Safety score is calculated for each route  
7. Safer routes are highlighted  
8. Navigation mode provides live warnings  
9. SOS button shares location in emergencies  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/venkatanaveen2078909-rgb/shieldnav.git
cd shieldnav


2️⃣ Install dependencies

npm install

3️⃣ Create environment variables

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

4️⃣ Run the app

npm run dev

App will be available at:

http://localhost:8080

🔒 Security Notes
.env is ignored using .gitignore
No secrets are committed
Safe for public GitHub repositories
🎯 Use Cases
Safer daily commuting
Night-time travel warnings
Accident-prone highway awareness
Emergency assistance during travel
🏆 Why ShieldNav?
Safety-first navigation
No dependency on paid map APIs
Scalable & AI-agent friendly architecture
Hackathon-ready and real-world relevant
📌 Future Enhancements
Weather-based risk analysis
Real-time traffic density
ML-based accident prediction
Mobile app version
👨‍💻 Author 
Venkata Naveen Tummala 
B.Tech CSE | Hackathon Project
📜 License
This project is for educational and hackathon purposes.

---
