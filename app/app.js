import express from 'express';

const app = express();
const port = 3000;

// Middleware per fare il parsing json
app.use(express.json());

app.get('/', (req,res) => {
    res.send('<h1>HomePage</h1>');
})


app.listen(port, () => {
    console.log(`Server is listening on port:${port}`);
});