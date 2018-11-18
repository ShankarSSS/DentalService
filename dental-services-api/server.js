const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3456;

const server = http.createServer(app);

server.listen(port);

// https://www.youtube.com/watch?v=WDrU305J1yw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=6