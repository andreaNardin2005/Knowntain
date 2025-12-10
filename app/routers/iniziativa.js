import express from 'express';
import Iniziativa from '../models/iniziativa.js';
import Dipendente from '../models/dipendente.js';

const router = express.Router();

// Estrazione di tutte le iniziative in corso
router.get('/', async (req,res) => {
    try {
        // Estraggo dal DB tutte le iniziative inserite
        const iniziative = await Iniziativa.find();
        
        res.json(iniziative);
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
});

// Inserimento di una nuova iniziativa
router.post('/', async (req,res) => {
    try {
        if (!req.body.titolo || !req.body.descrizione || !req.body.puntiObiettivo) {
            return res.status(400).send({
                success: false,
                message: 'La richiesta per la creazione di una nuova iniziativa è incompleta'
            });
        }

        // Cerco lo user loggato nella collection Dipendente
        const dipendente = await Dipendente.findById(req.loggedUser.id).select('-password -__v');
        
        // Se non viene trovata corrispondenza ritorno un errore
        if (!dipendente) {
            return res.status(404).send({
                success: false,
                message: 'Dipendente non trovato'
            });
        }

        const iniziativa = await Iniziativa.create({
            titolo: req.body.titolo,
            descrizione: req.body.descrizione,
            puntiObiettivo: req.body.puntiObiettivo,
            dipendente: dipendente._id
        });

        res.json(iniziativa);
    } catch (err) {
        res.status(500).send({
            success: false,
            message: 'Errore durante la creazione di una nuova inizitiva'
        });
    }
});


export default router;