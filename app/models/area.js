import mongoose, { Schema } from "mongoose";
import geoJson from './geoJson.js';

const AreaSchema = new Schema({
    titolo: { type: String, require: true },
    descrizione: { type: String, require: true },
    tipo: { 
        type: String,
        enum: [
            'Flora',
            'Fauna',
            'Aree Protette',
            'Boschi e Foreste',
            'Prati e Pascoli',     
            'Corsi d\'acqua',        
            'Laghi e Bacini',
            'Ghiacciai e Nevi Perpetue',
            'Formazioni Rocciose',
            'Sentieri e Percorsi',
            'Altro'
        ],
        required: true
    },
    posizione: {
        type: geoJson,
        required: true
    }
});

export default mongoose.model('Area', AreaSchema,'aree');