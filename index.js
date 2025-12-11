import app from './app/app.js';
import { connectDB } from './app/db.js';
const PORT = process.env.PORT || 8080;

// Funzione che tenta la connessione a DB Mongo Atlas
await connectDB();

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT} ...`);
});