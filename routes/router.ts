import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';

const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: "Todo está bien!!"
    })

});


//Recuperamos datos del x-www-form-urlencoded
router.post('/mensajes', (req: Request, res: Response) => {

    //parametros del postman
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;


    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;
    //Enviamos mensaje a un usuario(id) en especifico
    server.io.emit('mensaje-nuevo', payload);


    res.json({
        ok: true,
        cuerpo: cuerpo,
        de: de
    })

});


//Recuperando un parámetro de la ruta (url) y form
router.post('/mensajes/:id', (req: Request, res: Response) => {

    //parametros del postman
    const cuerpo = req.body.cuerpo; //recupera del form
    const de = req.body.de;
    const id = req.params.id; //recupera el parámetro de la url


    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    //Enviamos mensaje a un usuario(id) en especifico
    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        cuerpo: cuerpo,
        de: de,
        id: id
    })

});

//Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', async (req: Request, res: Response) => {
    const server = Server.instance;

    const count = server.io.engine.clientsCount;

    const clients = await server.io.fetchSockets();

    const listClients: string[] = [];

    for (const socket of clients) {
        // console.log(`El cliente es ${socket.id}`);
        listClients.push(socket.id);
    }

    res.json({
        ok: true,
        total: count,
        clientes: listClients
    });

});

//Servicio para obtener todos los IDs de los usuarios y sus nombres
router.get('/usuarios/detalle', async (req: Request, res: Response) => {

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

});




//Exportamos el router por defecto
export default router;