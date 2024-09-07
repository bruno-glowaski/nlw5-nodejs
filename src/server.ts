import { http } from "./http";
import './websocket/admin';
import './websocket/client';

http.listen(3333, () => console.log("Servidor está rodando na porta 3333."));
