import express, { response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';

import './database';
import { routes } from './routes';

const app = express();

const http = createServer(app); // Protocolo HTTP
const io = new Server(http);    // Protocolo WS

io.on('connection', (socket: Socket) => {
  console.log('Conexão estabelecida.', socket.id);
});

const viewsPath = path.join(__dirname, '..', 'public');
app.use(express.static(viewsPath));
app.set('views', viewsPath)
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (request, response) => {
  return response.render('html/client.html');
});

app.get('/admin', (request, response) => {
  return response.render('html/admin.html');
});

app.use(express.json());        // Parser do corpo da requisição HTTP
app.use(routes);                // Rotas HTTP

export { http, io }