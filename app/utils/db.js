import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Database connesso');
  } catch (err) {
    console.error('Errore di connessione al Database:', err);
    process.exit(1);
  }
}