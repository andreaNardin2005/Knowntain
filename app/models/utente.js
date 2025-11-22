import mongoose, { Schema } from "mongoose";

const UtenteSchema = new Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    punti: { type: Number, default: 0 }
});

const Utente = mongoose.model('Utente', UtenteSchema);
export { Utente };