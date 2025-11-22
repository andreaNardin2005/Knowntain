import mongoose, { Schema } from "mongoose";

const DipendenteSchema = new Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: String, required: true }
});

/* Il terzo parametro serve a dare il nome corretto alla collection
moongoose di defaul prende il nome del primo parametro lo fa diventare 
lowercase e ci appende una 's' alla fine*/
 
export default mongoose.model('Dipendente', DipendenteSchema,'dipendenti');