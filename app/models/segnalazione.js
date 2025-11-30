import mongoose, { Schema } from 'mongoose';
import geoJson from './geoJson.js';

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
        type: geoJson,
        required: true
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

export default mongoose.model('Segnalazione', SegnalazioneSchema,'segnalazioni');