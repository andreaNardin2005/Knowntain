import mongoose, { Schema } from "mongoose";

const geoJsonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point', 'Polygon'],  // tipi supportati
        required: true
    },
    coordinates: {
        type: Array,  // [lng, lat] per Point, array di array di punti per Polygon
        required: true
    }
}, { _id: false }); // _id: false evita di creare id interno per schema incorporato

export default geoJsonSchema;