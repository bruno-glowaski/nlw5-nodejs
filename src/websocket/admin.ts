import { io } from '../http';
import { ConnectionsService } from '../services/ConnectionsService';
import { MessagesService } from '../services/MessagesService';

io.on('connect', async (socket) => {
  const connections = new ConnectionsService();
  const messages = new MessagesService();

  const allConnections = await connections.findAllWithoutAdmin();

  io.emit('admin_list_all_users', allConnections);

  socket.on('admin_list_messages_by_user', async (params, callback) => {
    const { user_id } = params;

    const allMessages = await messages.listByUser(user_id);

    callback(allMessages);
  });

  socket.on('admin_send_message', async (params, callback) => {
    const { user_id, text } = params;

    await messages.create({
      text,
      user_id,
      admin_id: socket.id,
    });

    const { socket_id } = await connections.findByUserId(user_id);

    io.to(socket_id).emit('admin_send_to_client', {
      text,
      socket_id: socket.id,
    });
  });

  socket.on('admin_user_in_support', async params => {
    const { user_id } = params;
    const connection = await connections.updateAdminID(user_id, socket.id);

    const allConnections = await connections.findAllWithoutAdmin();
    io.emit('admin_list_all_users', allConnections);
  });
});