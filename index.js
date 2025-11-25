import app from './app/app.js';
import { connectDB } from './app/db.js';
const PORT = process.env.PORT;

// Funzione che tenta la connessione ad DB Mongo Atlas
connectDB();

app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`);
});