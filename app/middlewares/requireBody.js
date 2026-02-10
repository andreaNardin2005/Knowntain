/* 
  Middleware per controllare che il body sia definito e completo
  Prende in input un Array 'fields' che contiene i campi obbigatori della richiesta
  e controlla che il req.body li contenga.
*/

function requireBody(fields) {
  return (req, res, next) => {

    // Se il body è undifined, ritorno un errore
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Body mancante"
      });
    }

    // Se il uno dei campi obbligatori manca, ritorno un errore
    for (const f of fields) {
      if (req.body[f] === undefined) {
        return res.status(400).json({
          success: false,
          message: `Campo richiesto mancante: ${f}`
        });
      }
    }

    // Se tutto è valido, passa al prossimo middleware / handler
    next();
  };
}


export default requireBody;