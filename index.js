import app from './app/app.js';
import { connectDB } from './app/db.js';
const PORT = 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`);
});