# 🎮 4 in a Row — Real-Time Multiplayer Game (Backend Engineering Intern Assignment)

👋 Welcome! This project is a real-time, backend-driven version of the classic game **4 in a Row** (Connect Four), featuring:

- Real-time gameplay via WebSockets  
- Strategic bot fallback  
- Kafka-based analytics  
- Persistent leaderboard  
- A simple interactive frontend

---

## 🧠 Objective

- Create a multiplayer server using **Node.js**
- Allow 1v1 gameplay (Player vs Player or Player vs Bot)
- Build a minimal frontend interface
- Integrate **Kafka** for decoupled analytics logging

---

## 📁 Project Structure

├── client/ # Frontend (Vite + Tailwind + React)
│ ├── public/
│ ├── src/
│ ├── index.html
│ ├── package.json
│ └── vite.config.ts
│
├── kafka/ # Kafka-related services
│ ├── src/
│ ├── .env.local
│ ├── docker-compose.yaml
│ └── package.json
│
├── server/ # Game backend logic
│ ├── src/
│ │ ├── game/ # Game engine and state
│ │ ├── services/ # Kafka, DB, Leaderboard
│ │ ├── Analytics.ts # Kafka producer
│ │ ├── db.ts # Mongo/Postgres connection
│ │ ├── index.ts # WebSocket server entry
│ │ └── types.ts # Shared game types
│ └── package.json
│
├── .gitignore
└── README.md


---

## 🛠 Features

### 1. 🧍 Matchmaking
- Players enter a username and wait.
- After 10 seconds without match → fallback to **Bot**.

### 2. 🤖 Strategic Bot
- Prevents opponent wins
- Prioritizes winning combinations
- Makes intelligent, fast moves

### 3. 🌐 Real-Time Play
- WebSocket powered 1v1 turns
- Instant board updates
- Reconnects allowed within 30 seconds

### 4. 💾 Game State & Persistence
- Active game state: in-memory
- Completed games: saved in MongoDB/Postgres

### 5. 🏅 Leaderboard
- Player win counts
- Displayed on frontend

### 6. 📊 Kafka Analytics
- Kafka producer emits events (`game_start`, `game_update`, `game_end`)
- Kafka consumer logs to DB
- Analytics: win rates, game durations, player stats

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js ≥ 18.x  
- Docker + Docker Compose  
- Kafka + Zookeeper (via Docker)  
- MongoDB or PostgreSQL

---

### 🔧 1. Clone & Install

```bash
git clone https://github.com/sajal-123/4inRow_Assignment
cd 4-in-a-row

# Install frontend dependencies
cd client && npm install

# Install backend
cd ../server && npm install

# Install kafka analytics consumer
cd ../kafka && npm install
```

### 🐳 2. Start Kafka and Zookeeper

```
cd kafka
docker-compose up -d
```
Ensure .env.local exists with:
```
MONGO_URI=mongodb://localhost:27017/analytics
```

### 🧠 3. Start Kafka Analytics Consumer

```
cd kafka
npm start
```

### 🕹 4. Start Game Server

```
cd server
npm run dev
```

### 🌐 5. Start Frontend

```
cd client
npm run dev

```

## 🖼️ Frontend Features

- ✅ Username input  
- ✅ 7x6 grid for gameplay  
- ✅ Real-time turns  
- ✅ Bot & player moves visible  
- ✅ Game results display  
- ✅ Leaderboard view  


---

## 📈 Kafka Event Flow

### Game emits events:
- `game_start`
- `game_update`
- `game_end`

### Kafka consumer:
- Logs events to **MongoDB**
- Updates game records with:
  - Winner
  - Duration
- Tracks metrics:
  - Most frequent winner
  - Average game duration

---

## 📊 Future Metrics (Suggested)

- 📊 Games per hour/day  
- ⏱️ Average game duration  
- 🏆 Most common winners  
- 🔁 Player rejoin stats  

---

## 📦 Tech Stack

| Area        | Stack                     |
|-------------|---------------------------|
| **Frontend**| React + Vite + Tailwind   |
| **Backend** | Node.js + WebSocket       |
| **Analytics**| Kafka + MongoDB          |
| **Dev Tools**| Docker, dotenv           |
