import express from 'express';
import Segnalazione from '../models/segnalazione.js';
import Dipendente from '../models/dipendente.js';
import Utente from '../models/utente.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        // Cerco sul DB tutte le segnalazioni marcate come 'Validate'
        const segnalazioni = await Segnalazione.find({ stato: 'Validata' }).exec();
        res.json(segnalazioni);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message 
        });
    }
});


router.post('/', async (req,res) => {

    // controllo che la richiesta abbia tutti i dati obbligatori, altrimenti errore
    if (!req.body.titolo || !req.body.descrizione || !req.body.posizione || !req.body.tipo) {
        res.status(400).json({ success: false, message: 'Invalid input data' });
        return;
    }

    try {
        // provo a salvare la nuova segnalazione sul DB con i dati forniti
        const segnalazione = await Segnalazione.create({
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
            message: 'Impossibile salvare la nuova segnalazione'
        });
    }
});

router.patch('/:id', async (req,res) => {
    // Controllo che venga passato nella richiesta il nuovo stato per la segnalazione
    if (!req.body.stato) {
        return res.status(400).send({
            success: false,
            message: 'Stato segnalazione non trovato nella richiesta'
        });
    }

    try {
        // Cerco lo user loggato nella collection Dipendente
        const dipendente = await Dipendente.findById(req.loggedUser.id).select('-password -__v');

        // Se non viene trovata corrispondenza ritorno un errore
        if (!dipendente) {
            return res.status(404).send({
                success: false,
                message: 'Dipendente non trovato'
            });
        }

        // Cerco la segnalazione da modificare tra la collection Segnalazione
        const segnalazione = await Segnalazione.findById(req.params.id);

        // Se non viene trovata corrispondenza ritorno un errore
        if (!segnalazione) {
            return res.status(404).send({
                success: false,
                message: 'Segnalazione non trovata'
            });
        }

        // Cambio lo stato in 'Validata' o 'Rifiutata'
        segnalazione.stato = req.body.stato;

        // Salvo il dipendente nel campo dedicato nella segnalazione
        segnalazione.dipendente = dipendente._id;

        // Assegno 100 punti alla segnalazione
        segnalazione.punti = 100;

        // Cerco L'utente associato alla segnalazione
        const utente = await Utente.findById(segnalazione.utente);

        // Se non viene trovata corrispondenza ritorno un errore
        if (!utente) {
            return res.status(404).send({
                success: false,
                message: 'Utente non trovato'
            });
        }

        utente.punti += segnalazione.punti;

        // Salvo le modifiche su MongoDB
        await segnalazione.save();
        await utente.save();
        res.json(segnalazione);
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
});

export default router;