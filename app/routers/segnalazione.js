import express from 'express';
import Segnalazione from '../models/segnalazione.js';
import Dipendente from '../models/dipendente.js';
import Utente from '../models/utente.js';
import requireBody from '../middlewares/requireBody.js';

const router = express.Router();

/*---------------------------------
 - GET: get delle segnalazioni
---------------------------------*/
router.get('/', async (req, res) => {
    try {
        let segnalazioni = [];

        // controllo quale è il tipo di utente
        if (req.loggedUser.ruolo === 'dipendente') {

            // Se è un dipendente ritorno tutte le segnalazioni
            segnalazioni = await Segnalazione
                .find({})
                .sort({ stato: 1, data: 1 })
                .exec();
        } else {

            // Se è un utente ritorno solo quelle validate
            segnalazioni = await Segnalazione
                .find({ stato: 'Validata' })
                .sort({ data: 1 })
                .exec();
        }

        return res.json({
            success: true,
            segnalazioni
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message 
        });
    }
});

/*-----------------------------------
 - POST: Creazione nuova segnalazione
-------------------------------------*/
router.post('/', requireBody(['titolo','descrizione','posizione','tipo']), async (req,res) => {
    try {
        // Provo a salvare la nuova segnalazione sul DB con i dati forniti
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

/*----------------------------------------
 - PATCH: Aggiornamento stato segnalazione
------------------------------------------*/
router.patch('/:id', requireBody(['stato','punti']), async (req,res) => {
    
    try {
        // Spacchetto i dati del body
        const { stato, punti } = req.body;

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
        segnalazione.stato = stato;

        // Salvo il dipendente nel campo dedicato nella segnalazione
        segnalazione.dipendente = dipendente._id;

        // Cerco L'utente associato alla segnalazione
        const utente = await Utente.findById(segnalazione.utente);

        // Se non viene trovata corrispondenza ritorno un errore
        if (!utente) {
            return res.status(404).json({
                success: false,
                message: 'Utente non trovato'
            });
        }

        // Se viene validata
        if (stato === 'Validata') {
            // Assegno 100 punti alla segnalazione
            segnalazione.punti = punti;
            
            // Incremento i punti spendibili e i punti totali dell'utente 
            utente.punti += punti;
            utente.puntiTot += punti;
        }

        // Salvo le modifiche sull'utente e sulla segnalazione su MongoDB
        await segnalazione.save();
        await utente.save();

        return res.status(200).json({
            success: true,
            segnalazione
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
        });
    }
});

export default router;