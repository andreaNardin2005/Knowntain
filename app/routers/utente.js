import express from 'express';
import Utente from '../models/utente.js';
import Segnalazione from '../models/segnalazione.js';

const router = express.Router();

/*--------------------------------
 - GET: get del profilo utente
---------------------------------*/
router.get('/me', async (req, res) => {
  	try {
		// tokenChecker aggiunge alla richiesta loggedUser (req.loggedUser)
		// cerco l'utente per id escludendo password e versione
		const user = await Utente.findById(req.loggedUser.id).select('-password -__v');

		// Se non trovo l'utente ritorno un errore
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Utente non trovato'
			});
		} 

		// Cerco le segnalazioni associate all'utente che ho trovato
		const segnalazioni = await Segnalazione.find({ utente: user._id }).exec();

		/* Compatto tutte le informazioni relative 
		all'utente e alle segnalazioni associate in un unico oggetto */
		const profilo = user.toObject();
		const segnObj = segnalazioni.map(s => s.toObject());
		profilo.segnalazioni = segnObj;

		return res.status(200).json({
			success: true,
			profilo
		});
  	} catch (err) {
		return res.status(500).json({
			success: false,
			message: err.message
		});
  	}
});


export default router;