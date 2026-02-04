import app from './app/app.js';
import mongoose from 'mongoose';
const PORT = process.env.PORT || 8080;

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Database connesso');
  } catch (err) {
    console.error('Errore di connessione al Database:', err);
    process.exit(1);
  }
}

// Funzione che tenta la connessione a DB Mongo Atlas
await connectDB();

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT} ...`);
});