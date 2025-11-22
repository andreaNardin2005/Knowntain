import express from 'express';
import Utente from '../models/utente.js';

const router = express.Router();

router.post('/', async (req,res) => {
    const utenti = await Utente.insertMany([{
        nome: 'Gabriele',
        cognome: 'Dinca',
        nickname: 'GD',
        email: 'gabriele.dinca@example.com',
        password: '12345'
    },
    {
        nome: 'Andrea',
        cognome: 'Nardin',
        nickname: 'AN',
        email: 'andrea.nardin@example.com',
        password: 'password!'
    },
    {
        nome: 'Nicolas',
        cognome: 'Aresu',
        nickname: 'NA',
        email: 'nicolas.aresu@example.com',
        password: '54321'
    }]);
    res.send(utenti);
});


export default router;