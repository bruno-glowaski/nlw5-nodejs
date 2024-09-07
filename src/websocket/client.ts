import { io } from '../http';
import { ConnectionsService } from '../services/ConnectionsService';
import { MessagesService } from '../services/MessagesService';
import { UsersService } from '../services/UsersService';

interface IParams {
  text: string;
  email: string;
}

io.on('connect', (socket) => {
  const connections = new ConnectionsService();
  const users = new UsersService();
  const messages = new MessagesService();

  socket.on('client_first_access', async params => {
    const socket_id = socket.id;
    const { text, email } = params as IParams;

    const user = await users.create(email);

    const connection = await connections.findByUserId(user.id);

    if (!connection) {
      await connections.create({
        socket_id,
        user_id: user.id,
      })
    } else {
      connection.socket_id = socket_id;
      await connections.create(connection);
    }

    await messages.create({
      text,
      user_id: user.id,
    })
  })
});