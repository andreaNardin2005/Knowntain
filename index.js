import app from './app/app.js';
import mongoose from 'mongoose';
const PORT = 3000;


app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`);
});