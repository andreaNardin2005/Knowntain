import mongoose, { Schema } from "mongoose";

const IniziativaSchema = new Schema({
    titolo: { type: String, required: true },
    descrizione: { type: String, required: true },
    dipendente: {
        type: Schema.Types.ObjectId,
        ref: 'Dipendente'
    },
    puntiAttuali: { type: Number, default: 0 },      // punti accumulati dagli utenti
    puntiObiettivo: { type: Number, required: true }   // punteggio da raggiungere
});

const Iniziativa = mongoose.model('Iniziativa', IniziativaSchema);
export { Iniziativa };