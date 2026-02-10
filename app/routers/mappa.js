import express from 'express';
import Segnalazione from '../models/segnalazione.js';

const router = express.Router();

/*----------------------------------------
 - GET: TODO (!!!)
------------------------------------------*/
router.get('/', async (req,res) => {
    try {
        // Cerco sul DB tutte le segnalazioni marcate come 'Validate'
        const segnalazioni = await Segnalazione.find({ stato: 'Validata' }).exec();
        /*res.status(200).json({
            success: true,
            segnalazioni
        )};*/
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message 
        });
    }
});


export default router;