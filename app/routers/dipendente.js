import express from 'express';
import Dipendente from '../models/dipendente.js';
import requireBody from '../middlewares/requireBody.js';

const router = express.Router();

// Creazione di un nuovo account dipendente

router.post('/create', requireBody(['nome','cognome','email','password','isAdmin']), (req,res) => {
    
    console.log(req.loggedUser);
    if (req.loggedUser.isAdmin) {
        console.log('isAdmin my friend!')
    }
    res.send('ok');
});


export default router;