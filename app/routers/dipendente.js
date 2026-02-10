import express from 'express';
import Dipendente from '../models/dipendente.js';
import requireBody from '../middlewares/requireBody.js';

const router = express.Router();


router.get('/me', async (req, res) => {
  try {
    // tokenChecker aggiunge req.loggedUser
    // cerco il dipendente per id escludendo password e versione
    const user = await Dipendente.findById(req.loggedUser.id).select('-password -__v');

    // Se non trovo l'utente ritorno un errore
    if (!user) return res.status(404).json({ 
        success: false,
        message: 'Dipendente non trovato' 
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
        success: false,
        message: err.message 
    });
  }
});

// Creazione di un nuovo account dipendente
router.post('/create', requireBody(['nome','cognome','email','password','isAdmin']), async (req,res) => {

    // Controllo che il dipendente sia un admin
    const dipendente = await Dipendente.findById(req.loggedUser.id);
    if (!dipendente.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Dipendente non autorizzato a creare nuovi dipendenti'
        });
    }
    
    // Spacchetto i campi della richiesta
    const { email, password, nome, cognome, isAdmin } = req.body;

    // Controlla se il formato della mail è corretto
    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Email non valida'
        });
    }

    // Cerca l'estistenza di un dipendente con lo stesso nickname o email
    const isUsed = await Dipendente.findOne({
        $or: [{ email: email },]
    }).exec();

    // Se esiste viene segnalato un errore di conflitto
    if (isUsed) {
        return res.status(409).json({
            success: false, 
            message: 'Email già utilizzata'
        });
    }

    // Controlla i requisiti minimi della password
    if (!isStrongPassword(password)) {
        return res.status(400).json({
            success: false, 
            message: 'Password debole. La password deve essere lunga almeno 8 caratteri e contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale.'
        });
    }

    // Crea un nuovo documento nella collection Dipendente e lo salva sul DB
    const user = await Dipendente.create({
        nome: nome,
        cognome: cognome,
        isAdmin: isAdmin,
        email: email,
        password: password
    });


    return res.status(201).json({
        success: true,
        user: {
            email: user.email,
            nome: user.nome,
            cognome: user.cognome,
            isAdmin: user.isAdmin
        }
    });
});


export default router;