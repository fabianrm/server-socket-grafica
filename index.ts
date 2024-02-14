import Server from "./classes/server";
import router from "./routes/router";
import bodyParser from "body-parser";
import cors from 'cors';

const server = Server.instance;

//BodyParser => convierte lo que llega por la url a objeto de JavaScript
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());


//CORS
server.app.use(cors({ origin: true, credentials: true }));
//server.app.use(cors({ origin: 'http://localhost:4200', credentials: true }));


//Rutas de servicios
server.app.use('/', router)

server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});

