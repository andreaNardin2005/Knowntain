import mongoose, { Schema } from "mongoose";

const UtenteSchema = new Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    punti: { type: Number, default: 0 },
    puntiTot: { type: Number, default: 0 },
    ruolo: { type: String, enum: ['utente'], default: 'utente' }
});

export default mongoose.model('Utente', UtenteSchema,'utenti');