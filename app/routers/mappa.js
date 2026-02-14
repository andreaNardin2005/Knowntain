import express from 'express';
import Segnalazione from '../models/segnalazione.js';
import Area from '../models/area.js';
import requireBody from '../middlewares/requireBody.js';


const router = express.Router();

/*----------------------------------------
 - GET: Get delle aree e delle segnalazioni
------------------------------------------*/
router.get('/', async (req,res) => {
    try {
        // Cerco sul DB tutte le segnalazioni marcate come 'Validate'
        const segnalazioni = await Segnalazione.find({ stato: 'Validata' }).exec();

        const aree = await Area.find({}).exec();

        return res.status(200).json({
            success: true,
            segnalazioni,
            aree
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message 
        });
    }
});

/*-----------------------------
 - POST: Creazione nuove aree
-------------------------------*/
router.post('/',requireBody(['nome','descrizione','tipo','features']), async(req,res) => {

    const { nome, descrizione, tipo, features } = req.body;

    if (!Array.isArray(features)) {
        return res.status(400).json({
            success: false,
            message: 'features deve essere un array'
        });
    }

    try {
        for (const e of features) {
            
            if (!e.type) {
                return res.status(400).json({
                    success: false,
                    message: 'Ogni feature deve avere un campo type'
                });
            }

            await Area.create({
                titolo: nome,
                descrizione: descrizione,
                tipo: tipo,
                posizione: e.geometry
            });
        }
        
        return res.status(201).json({
            success: true,
            message: 'Aree salvate con successo'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Impossibile salvare le nuove aree: ${err}`
        });
    }
});


export default router;