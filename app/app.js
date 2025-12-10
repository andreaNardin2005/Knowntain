import express from 'express';
import Path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import cors from 'cors';
import tokenCheker from './middlewares/tokenChecker.js';

// Routers
import auth from './routers/auth.js';
import utente from './routers/utente.js';
import dipendente from './routers/dipendente.js';
import segnalazione from './routers/segnalazione.js';
import iniziativa from './routers/iniziativa.js';
import classifica from './routers/classifica.js';

// Determina __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

// Carica OpenAPI (Swagger) document
const swaggerDocument = yaml.load(readFileSync(Path.join(__dirname, '..', './docs/oas3.yaml'), 'utf8'));
// *******************************


// Creazione dell'applicazione Express
const app = express();

// Middleware per fare il parsing json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 
app.use(cors());

// Middleware che logga in console le richieste effettuate
app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url);
    next();
})

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Authentication routing and middleware
app.use('/auth', auth);

app.use('/utenti', tokenCheker, utente);
app.use('/dipendenti', tokenCheker, dipendente);
app.use('/segnalazioni', tokenCheker, segnalazione);
app.use('/iniziative', tokenCheker, iniziativa);
app.use('/classifica', tokenCheker, classifica);







// Default 404 handler
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Route Not found' });
});


// Default error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});


export default app;