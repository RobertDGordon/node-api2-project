const server = require('express').server

server.use(express.json());

const router = require('./router/router');

server.use('/api', router)

const port = 4000;
const hostname = '127.0.0.1'; 

server.listen(port, hostname, ()=> {
    console.log(`\n *** Server running at http://${hostname}:${port}/ *** \n`)
});