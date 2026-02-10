import express from 'express';
import Iniziativa from '../models/iniziativa.js';
import Dipendente from '../models/dipendente.js';
import Utente from '../models/utente.js';
import requireBody from '../middlewares/requireBody.js';

const router = express.Router();

/*------------------------------------------------
 - GET: Estrazione di tutte le iniziative in corso
---------------------------------------------------*/
router.get('/', async (req,res) => {
    try {
        // Estraggo dal DB tutte le iniziative inserite
        const iniziative = await Iniziativa.find();
        
        // Ritorno le iniziative trovate
        return res.status(200).json({
            success: true,
            iniziative
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
        });
    }
});

/*----------------------------------------
 - POST: Inserimento nuova iniziativa
------------------------------------------*/
router.post('/', requireBody(['titolo','descrizione','puntiObiettivo']), async (req,res) => {
    try {
        const { titolo, descrizione, puntiObiettivo } = req.body;
        
        // Cerco lo user loggato nella collection Dipendente
        const dipendente = await Dipendente.findById(req.loggedUser.id).select('-password -__v');
        
        // Se non viene trovata corrispondenza ritorno un errore
        if (!dipendente) {
            return res.status(404).send({
                success: false,
                message: 'Dipendente non trovato'
            });
        }

        // Creo la nuova iniziativa con i dati forniti
        const iniziativa = await Iniziativa.create({
            titolo: titolo,
            descrizione: descrizione,
            puntiObiettivo: puntiObiettivo,
            dipendente: dipendente._id
        });

        // Ritorno l'iniziativa creata
        return res.status(201).json({
            success: true,
            iniziativa
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: 'Errore durante la creazione di una nuova inizitiva'
        });
    }
});

/*--------------------------------------------
 - PATCH: Assegnazione punti ad una iniziativa
---------------------------------------------*/
router.patch('/:id', requireBody(['puntiAssegnati']), async (req,res) => {
    try {
        // Trasformo i punti arrivati come stringa in numero
        const puntiAssegnati = Number(req.body.puntiAssegnati);

        // Controllo che i punti assegnati siano un intero positivo
        if (!Number.isInteger(puntiAssegnati) || puntiAssegnati <= 0) {
            return res.status(400).json({
                success: false,
                message: 'I punti assegnati devono essere un numero positivo'
            });
        }

        // Prelevo l'utente che ha effettuato la richiesta dal DB
        const utente = await Utente.findById(req.loggedUser.id).select('-password -__v');

        // Se non viene trovato ritorno un errore
        if (!utente) {
            return res.status(404).send({
                success: false,
                message: 'Utente non trovato'
            });
        }

        // Cerco l'iniziativa a cui assegnare i punti nel DB
        const iniziativa = await Iniziativa.findById(req.params.id);

        // Se non viene trovata ritorno un errore
        if (!iniziativa) {
            return res.status(404).send({
                success: false,
                message: 'Iniziativa non trovata'
            });
        }

        // Se l'utente ha meno punti di quelli che vuole assegnare, ritono un errore
        if (utente.punti < puntiAssegnati) {
            return res.status(400).send({
                success: false,
                message: 'Punti utente non sufficienti'
            });
        }

        // Se voglio assegnare più punti rispetto a quelli assegnabili ad un iniziativa, errore
        if (iniziativa.puntiAttuali + puntiAssegnati > iniziativa.puntiObiettivo) {
            return res.status(400).send({
                success: false,
                message: `Impossibile assegnare più di ${iniziativa.puntiObiettivo - iniziativa.puntiAttuali} punti all'iniziativa`
            });
        }

        // Se tutto va bene incremento i punti dell'iniziativa e decremento i punti utente
        iniziativa.puntiAttuali += puntiAssegnati;
        utente.punti -= puntiAssegnati;

        // Salvo la modifica sui documenti del DB
        await iniziativa.save();
        await utente.save();

        // Ritorno l'iniziativa modificata
        return res.status(200).json({
            success: true,
            iniziativa
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            errorr: err,
            message: 'Errore durante l\'assegnazione di punti all\'inizitiva'
        });
    }
});


export default router;