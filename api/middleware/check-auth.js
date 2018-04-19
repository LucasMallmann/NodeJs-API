const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        // preciso pegar a token do header, e não do Body
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        // verifica e valida o token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.body.userData = decoded;
        // chame o next se a autorização funcionar
        next();

    } catch (error) {
        return res.status(401).json({
          message: 'Auth failed'
        });
    }
}