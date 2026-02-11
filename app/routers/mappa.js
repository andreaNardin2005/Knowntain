import express from 'express';
import Segnalazione from '../models/segnalazione.js';
import Area from '../models/area.js';

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


export default router;