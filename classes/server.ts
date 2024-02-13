import express from 'express';
import { SERVER_PORT } from '../global/environment';
import { createServer } from 'http'; // Cambio en la importación
import { Server as SocketIOServer } from 'socket.io'; // Cambio en la importación

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: SocketIOServer; // Cambio en el tipo de variable
    private httpServer: any; // Cambio en el tipo de variable

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = createServer(this.app); // Crear el servidor HTTP con createServer
        this.io = new SocketIOServer(this.httpServer); // Inicializar el servidor Socket.IO
        this.escucharSockets();

    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }


    private escucharSockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', cliente => {
            console.log('Cliente conectado');

        })

    }


    start(callback: Function) {
        this.httpServer.listen(this.port, callback);
    }
}