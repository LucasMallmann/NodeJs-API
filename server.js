const http = require('http');
const app = require('./app');

// Variável de ambiente para acessar a porta.
// Se não estiver setada, use a porta 3000
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

console.log('Server is running on port ' + port);
