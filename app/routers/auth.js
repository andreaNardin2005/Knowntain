import express from 'express';
import jwt from 'jsonwebtoken';
import requireBody from '../middlewares/requireBody.js';
import { isStrongPassword, isValidEmail } from '../utils/validators.js';

const router = express.Router();

const roleToRoute = {
    utente: 'utenti',
    dipendente: 'dipendenti'
};

function createToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        ruolo: user.ruolo,
    };

    // scade dopo 24h
	const options = { expiresIn: 86400 };

    // creazione JWT token
	return jwt.sign(payload, process.env.JWT_SECRET, options);
}


// ***************** LOGIN UTENTE-DIPENDENTE ***************************
router.post('/login', requireBody(['email','password','ruolo']), async (req,res) => {

    const { email, password, ruolo } = req.body;

    // Importo la Collection corretta in base al ruolo
    const Collection = (ruolo === 'utente') ? 
    (await import('../models/utente.js')).default : 
    (await import('../models/dipendente.js')).default;

    // Cerco l'utente nella Collection importata
    const user = await Collection.findOne({ email });

    // Se utente non trovato, errore
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Autenticazione fallita. Utente non trovato' 
        });
    }

    // Controlla se la password matcha (aggiungere bcrypt)
    if (user.password != password) {
        res.status(401).json({success: false, message: 'Autenticazione fallita' });
        return;
    }

    // Se l'utente ha passato i controlli sopra sopra viene creato un token
    const token = createToken(user);

    let userProfile = {};
    if (user.ruolo === 'utente') {
        userProfile = {
            nickname: user.nickname,
            punti: user.punti,
            puntiTot: user.puntiTot
        }
    } else {
        userProfile = {
            isAdmin: user.isAdmin
        }
    }

	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
        role: user.ruolo,
        profile: userProfile,
		id: user._id,
		self: `/${roleToRoute[user.ruolo]}/${user._id}`
	});
});

// ***************** REGISTRAZIONE UTENTI ***************************
router.post('/register', requireBody(['email','password','nome','cognome','nickname']), async (req,res) => {

    // importa model utente, dal momento che la registrazione è solo per gli utenti
    const Utente = (await import('../models/utente.js')).default;

    // Spacchetto i campi della richiesta
    const { email, password, nome, cognome, nickname } = req.body;

    // Controlla se il formato della mail è corretto
    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Email non valida'
        });
    }

    // Cerca l'estistenza di un utente con lo stesso nickname o email
    const isUsed = await Utente.findOne({
        $or: [
            { email: email },
            { nickname: nickname }
        ]
    }).exec();

    // Se esiste viene segnalato un errore di conflitto
    if (isUsed) {
        return res.status(409).json({
            success: false, 
            message: 'Email o Nickname già utilizzati'
        });
    }

    // Controlla i requisiti minimi della password
    if (!isStrongPassword(password)) {
        return res.status(400).json({
            success: false, 
            message: 'Password debole. La password deve essere lunga almeno 8 caratteri e contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale.'
        });
    }

    // Crea un nuovo documento nella collection Utente e lo salva sul DB
    const user = await Utente.create({
        nome: nome,
        cognome: cognome,
        nickname: nickname,
        email: email,
        password: password
    });

    // Crea il token per il nuovo utente
    const token = createToken(user);

    // Completata la registrazione l'utente viene loggato nella sua dashboard
    res.status(201).json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
        role: user.ruolo,
        profile: {
            nickname: user.nickname,
            punti: user.punti,
            puntiTot: user.puntiTot
        }
		id: user._id,
		self: `/${roleToRoute[user.ruolo]}/${user._id}`
	});
});


export default router;