import express from 'express';
import Utente from '../models/utente.js';

const router = express.Router();

/*----------------------------------------
 - GET: get della classifica utenti
------------------------------------------*/
router.get('/', async (req,res) => {
    try {
        /*
        Estraggo dal DB per ogni utente il nickname e i suoi puntiTot
        ordinando il risultato per punti in modo decrescente e
        con .lean() trasformo il documento mongoose in un array JS plain
        per poterlo manipolare
        */
        const utenti = await Utente.find()
                                   .select('nickname puntiTot')
                                   .sort({puntiTot: 'desc'})
                                   .lean();

        // Prendo solo i 50 utenti con punteggio più alto                           
        const utentiTop = utenti.slice(0,50);

        // Per gli utenti selezionati aggiungo un campo posizione
        let i = 1;
        utentiTop.forEach(utente => {
            utente.posizione = i++;
        });

        // Ritorno l'array degli utenti più virtuosi
        return res.status(200).json({
            success: true,
            utentiTop
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
        });
    }
});


export default router;