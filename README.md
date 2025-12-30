# NoSQL Web Demo (React + Vite)

A premium, client-side Single Page Application demonstrating NoSQL concepts and Big Data Analytics.

## Features
- **Client-Side Big Data**: Generates 50,000+ rows directly in the browser using Faker-like generators.
- **Interactive Simulations**:
  - MongoDB (Document), Redis (Key-Value), Cassandra (Column), Neo4j (Graph).
  - SQL vs Column Store Performance Benchmarking.
- **Premium UI**: Dark mode, glassmorphism, and responsive dashboard layout.

## Project Structure
```
src/
├── components/
│   ├── views/          # Individual Dashboard Views
│   ├── Sidebar.jsx     # Navigation
│   └── ...
├── utils/
│   ├── dataGenerator.js # Synthetic Data Logic
│   ├── dbSimulation.js  # DB Logic
│   └── analytics.js     # Analysis Logic
├── App.jsx             # Main Layout
└── main.jsx            # Entry Point
```

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production (Netlify/Vercel):
   ```bash
   npm run build
   ```
   The output will be in the `dist` folder.
