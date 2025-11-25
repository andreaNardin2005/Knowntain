import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB Atlas connected');
  } catch (err) {
    console.error('Errore di connessione a MongoDB Atlas:', err);
    process.exit(1);
  }
}