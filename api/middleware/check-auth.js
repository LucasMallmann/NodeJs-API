const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        // verifica e valida o token
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.body.userData = decoded;
        // chame o next se a autorização funcionar
        next();

    } catch (error) {
        return res.status(401).json({
          message: 'Token not valid'
        });
    }
}