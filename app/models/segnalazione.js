import mongoose, { Schema } from "mongoose";

const SegnalazioneSchema = new Schema({
    titolo: { type: String, required: true },
    descrizione: { type: String, required: true },
    utente: {
        type: Schema.Types.ObjectId, 
        ref: 'Utente',
        required: true
    },
    dipendente: {
        type: Schema.Types.ObjectId,
        ref: 'Dipendente'
    },
    posizione: {
        type: {
            type: String,
            enum: ['Point'], // deve essere sempre "Point"
            required: true
        },
        coordinates: {
            type: [Number],   // array di numeri
            required: true    // [lon, lat] !IMP: seguire questo ordine prima lon, poi lat
        }
    },
    tipo: {
        type: String,
        enum: [
            'Avvistamento Faunistico',
            'Codizioni Meteo',
            'Manutenzione Sentieri',
            'Caduta Alberi',
            'Pericolo Frane',
            'Pericolo Valanghe',
            'Altro'
        ],
        required: true
    },
    stato: {
        type: String,
        enum: ['Aperta','Validata','Rifiutata'],
        required: true
    },
    foto: [Buffer]
});

const Segnalazione = mongoose.model('Segnalazione', SegnalazioneSchema);
export { Segnalazione };