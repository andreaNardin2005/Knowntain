import jwt from 'jsonwebtoken';

const tokenCheker = (req,res,next) => {
	// Salta l'auth per options
	if (req.method === 'OPTIONS') {
    	return next();
  	}
    // Controlla se il token è inserito nell'header
	const token = req.headers['access-token'];

	// se il token non c'è viene mandato un errore
	if (!token) {
		return res.status(401).send({ 
			success: false,
			message: 'No token provided'
		});
	}

	// Se il token esiste viene decodificato 
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {			
		if (err) {
			return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token'
			});
		} else {
			// Se tutto è andato a buon fine il payload viene aggiunto 
            // alla richiesta per essere usato nelle routes successive
			req.loggedUser = decoded;
			next();
		}
	});
}

export default tokenCheker;