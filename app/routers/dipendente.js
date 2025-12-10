import express from 'express';
import Dipendente from '../models/dipendente.js';

const router = express.Router();

// Creazione di un nuovo account dipendente

router.post('/create', (req,res) => {
    if (!req.body.nome || !req.body.cognome || !req.body.email || !req.body.password) {
        return res.status(400).send({
            success: false,
            message: 'Richiesta di crezione di un nuovo dipendente errata'
        });
    }

    if (req.loggedUser.isAdmin) {
        
    }

});


export default router;