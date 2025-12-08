import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

function createToken(user) {
    let payload = {
		email: user.email,
		id: user._id,
        nome: user.nome,
        cognome: user.cognome
	}

	let options = {
		expiresIn: 86400 // scade dopo 24h
	}

    // creazione JWT token
	return jwt.sign(payload, process.env.JWT_SECRET, options);
}

async function getModel(req) {
    let mod;
    if (req.body.ruolo === 'utente') {
        // Se utente
        // lazy import del model
        mod = await import('../models/utente.js');
    } else {
        // Se dipendente
        // lazy import del model
        mod = await import('../models/dipendente.js');
    }
    return mod.default;
}

router.post('/login', async (req,res,next) => {
    // TODO: Login con Google ******************
    let user = {};

    // Ottiene il model dell'utente guardando l'attributo 'ruolo' della request
    let Model = await getModel(req);
    
    // Cerca un utente associato alla mail inserita nel body della request
    user = await Model.findOne(
        {email: req.body.email}
    ).exec();

    // Se utente non trovato, return
    if (!user) {
        res.status(401).json({success: false, message: 'Authentication failed. User not found.' });
        return;
    }

    // Controlla se la password matcha
    if (user.password != req.body.password) {
        res.status(401).json({success: false, message: 'Authentication failed. Wrong password.' });
        return;
    }

    // Se l'utente ha passato i controlli sopra viene creato un token
    const token = createToken(user);
    
    let route = (req.body.ruolo === 'utente') ? '/utenti/' : '/dipendenti/';
	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		id: user._id,
		self: route + user._id
	});
});


router.post('/register', async (req,res) => {

    // importa model utente, dal momento che la registrazione è solo per gli utenti
    const mod = await import('../models/utente.js');
    const Utente = mod.default;

    // Controlla che tutti gli attributi richiesti siano definiti
    if (!req.body.email || !req.body.password || !req.body.nome || !req.body.cognome || !req.body.nickname) {
        res.status(400).json({success: false, message: 'Invalid input data'});
        return;
    }

    // Cerca l'estistenza di un untente con lo stesso nickname o email
    const used = await Utente.findOne({
        $or: [
            { email: req.body.email },
            { nickname: req.body.nickname }
        ]
    }).exec();

    // Se esiste viene segnalato un errore di conflitto
    if (used) {
        res.status(409).json({success: false, message: 'Email or Nickname already in use'});
        return;
    }

    // Crea un nuovo documento nella collection Utente e lo salva sul DB
    let user = await Utente.create({
        nome: req.body.nome,
        cognome: req.body.cognome,
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password
    });

    // Crea il token per il nuovo utente
    const token = createToken(user);

    // Completata la registrazione l'utente viene loggato nella sua dashboard
    res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		id: user._id,
		self: '/utenti/' + user._id
	});
});


export default router;