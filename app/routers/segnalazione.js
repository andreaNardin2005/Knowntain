import express from 'express';
import Segnalazione from '../models/segnalazione.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const segnalazioni = await Segnalazione.find({ stato: 'Validata' }).exec();
        res.json(segnalazioni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req,res) => {

    if (!req.body.titolo || !req.body.descrizione || !req.body.posizione || !req.body.tipo) {
        res.status(400).json({success: false, message: 'Invalid input data'});
        return;
    }

    try {
        let segnalazione = await Segnalazione.create({
            titolo: req.body.titolo,
            descrizione: req.body.descrizione,
            utente: req.loggedUser.id,
            posizione: req.body.posizione,
            tipo: req.body.tipo
            //TODO: foto?
        });
        res.status(201).json(segnalazione);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Non è stato possibile salvare la nuova segnalazione'
        });
    }
});

router.patch('/:id', async (req,res) => {

});

export default router;