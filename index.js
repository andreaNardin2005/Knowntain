import app from './app/app.js';
import { connectDB } from './app/db.js';
const PORT = process.env.PORT || 8080;

// Funzione che tenta la connessione a DB Mongo Atlas
connectDB();

app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`);
});