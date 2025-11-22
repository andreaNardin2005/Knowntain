import mongoose from "mongoose";
const URI = 'mongodb://localhost:27017/Knowntain';

export async function connectDB() {
  try {
    await mongoose.connect(URI);
    console.log('MongoDB connected');
  } catch (err) {
        console.error('Errore di connessione a MongoDB:', err);
        process.exit(1);
  }
}