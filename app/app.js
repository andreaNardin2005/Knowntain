import express from 'express';
import Path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

// Determine __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

// Load OpenAPI (Swagger) document
const swaggerDocument = yaml.load(readFileSync(Path.join(__dirname, '..', 'oas3.yaml'), 'utf8'));

// Creazione dell'applicazione Express
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




// Middleware per fare il parsing json
app.use(express.json());

app.get('/', (req,res) => {
    res.send('<h1>HomePage</h1>');
})




export default app;