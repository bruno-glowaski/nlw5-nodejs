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
      connection.admin_id = null;
      await connections.create(connection);
    }

    await messages.create({
      text,
      user_id: user.id,
    });

    const allMessages = await messages.listByUser(user.id);

    socket.emit('client_list_all_messages', allMessages);

    const allUsers = await connections.findAllWithoutAdmin();

    io.emit('admin_list_all_users', allUsers);
  });

  socket.on('client_send_to_admin', async params => {
    const { text, socket_admin } = params;

    const socket_id = socket.id;
    const { user_id } = await connections.findBySocketId(socket_id);

    const message = await messages.create({
      text,
      user_id,
    });

    io.to(socket_admin).emit('admin_receive_message', {
      message,
      socket_id,
    });
  });
});