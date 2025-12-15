import mongoose, { Schema } from 'mongoose';
import geoJson from './geoJson.js';

const SegnalazioneSchema = new Schema({
    titolo: { type: String, required: true },
    descrizione: { type: String, required: true },
    data: { type: Date, required: true, default: Date.now },
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
        type: geoJson,
        required: true
    },
    tipo: {
        type: String,
        enum: [
            'Avvistamento Faunistico',
            'Condizioni Meteo',
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
        default: 'Aperta',
        required: true
    },
    punti: {
        type: Number,
        default: 0
    },
    foto: [Buffer]
});

export default mongoose.model('Segnalazione', SegnalazioneSchema,'segnalazioni');