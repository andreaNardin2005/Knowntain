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


router.post('/',requireBody(['titolo','features']), async(req,res)=> {
    //test
    if (!Array.isArray(req.body.features)) {
        return res.status(400).json({
            success: false,
            message: 'features deve essere un array'
        });
    }

    try{
        for (const e of req.body.features) {
            //test
            if (!e.type) {
                return res.status(400).json({
                    success: false,
                    message: 'Ogni feature deve avere un campo type'
                });
            }

            await Area.create({
                titolo: req.body.titolo,
                posizione: e.geometry
            });
        }
        res.status(201).json({
            success: true,
            message: 'Aree salvate con successo'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Impossibile salvare le aree'
        });
    }
})


export default router;