import express from 'express';
import Utente from '../models/utente.js';
import Segnalazione from '../models/segnalazione.js';

const router = express.Router();

router.get('/me', async (req, res) => {
  try {
    // tokenChecker aggiunge req.loggedUser 
    // cerco l'utente per id escludendo password e versione
    const user = await Utente.findById(req.loggedUser.id).select('-password -__v');

    // Se non trovo l'utente ritorno un errore
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    // Cerco le segnalazioni associate all'utente che ho trovato
    const segnalazioni = await Segnalazione.find({utente: user._id}).exec();

    // Compatto tutte le informazioni relative all'utente e alle segnalazioni associate in un unico oggetto
    const merge = user.toObject();
    const segnObj = segnalazioni.map(s => s.toObject());
    merge.segnalazioni = segnObj;

    res.json(merge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;