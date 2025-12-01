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
		expiresIn: 86400 // expires in 24 hours
	}

    // JWT token creation
	return jwt.sign(payload, process.env.JWT_SECRET, options);
}

async function getModel(req) {
    let mod;
    if (req.body.role === 'utente') {
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
    // TODO: Login con Google
    let user = {};
    // Ottiene il model dell'utente guardando la request
    // console.log(req.body);
    let Model = await getModel(req);
    
    user = await Model.findOne(
        {email: req.body.email}
    ).exec();

    // local user not found
    if (!user) {
        res.status(401).json({message: 'Authentication failed. User not found.' });
        return;
    }

    // check if password matches
    if (user.password != req.body.password) {
        res.status(401).json({message: 'Authentication failed. Wrong password.' });
        return;
    }

    // if user is found or created create a token
    
    const token = createToken(user);

    let route = (req.body.role === 'utente') ? '/utenti/' : '/dipendenti/';
	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		id: user._id,
		self: route + user._id
	});
});


router.post('/register', async (req,res,next) => {
    const mod = await import('../models/utente.js');
    const Utente = mod.default;

    if (!req.body.email || !req.body.password || !req.body.name || !req.body.surname || !req.body.nickname) {
        res.status(400).json({message: 'Invalid input data'});
        return;
    }

    const used = await Utente.findOne({
        $or: [
            { email: req.body.email },
            { nickname: req.body.nickname }
        ]
    }).exec();

    if (used) {
        res.status(409).json({message: 'Email or Nickname already in use'});
        return;
    }

    let user = await Utente.create({
        nome: req.body.name,
        cognome: req.body.surname,
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password
    });

    console.log(user);

    const token = createToken(user);

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