import { Socket } from "socket.io";
import { Server as SocketIOServer } from 'socket.io';
import { UsuariosLista } from "../classes/usuarios-lista";
import { Usuario } from "../classes/usuario";
import { Mapa } from "../classes/mapa";
import { Marcador } from "../classes/marcador";


export const usuariosConectados = new UsuariosLista();

export const mapa = new Mapa();

//Eventos de mapa
export const mapaSockets = (cliente: Socket, io: SocketIOServer) => {
    cliente.on('marcador-nuevo', (marcador: Marcador) => {
        mapa.agregarMarcador(marcador);
        //emite a los clientes
        cliente.broadcast.emit('marcador-nuevo', marcador);

    });

    cliente.on('marcador-borrar', (id: string) => {
        mapa.borrarMarcador(id);
        cliente.broadcast.emit('marcador-borrar', id);
    });

    cliente.on('marcador-mover', (marcador: Marcador) => {
        mapa.moverMarcador(marcador);
        cliente.broadcast.emit('marcador-mover', marcador);
    });
}






//Conectar cliente
export const conectarCliente = (cliente: Socket, io: SocketIOServer) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

export const desconectar = (cliente: Socket, io: SocketIOServer) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuario(cliente.id);
        console.log('Cliente desconectado', cliente.id);
        //emitimos los usuarios conectados al front
        io.emit('usuarios-activos', usuariosConectados.getLista());
    });
}

//Escuchar mensajes
export const mensaje = (cliente: Socket, io: SocketIOServer) => {
    cliente.on('mensaje', (payload: { de: string, cuerpo: string }) => {
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);

    });
}

//escuchar configurar-usuario
export const configurarUsuario = (cliente: Socket, io: SocketIOServer) => {
    cliente.on('configurar-usuario', (payload: { nombre: string }, callback: Function) => {
        // console.log('Configurando usuario', payload.nombre);
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);

        //callback es la respuesta que retorna a angular
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        });

        //emitimos los usuarios conectados al front
        io.emit('usuarios-activos', usuariosConectados.getLista());

    });
}

//escuchar obtener-usuarios
export const obtenerUsuarios = (cliente: Socket, io: SocketIOServer) => {

    cliente.on('obtener-usuarios', () => {

        //emitimos los usuarios conectados al front
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());


    });



}




