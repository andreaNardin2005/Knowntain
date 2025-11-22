import mongoose, { Schema } from "mongoose";

const DipendenteSchema = new Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: String, required: true },
});

const Dipendente = mongoose.model('Dipendente', DipendenteSchema);
export { Dipendente };