document.querySelector("#start_chat").addEventListener("click", (event) => {
  const chat_help = document.getElementById("chat_help");
  chat_help.style.display = "none";

  const chat_in_support = document.getElementById("chat_in_support");
  chat_in_support.style.display = "block";

  const email = document.getElementById("email").value;
  const text = document.getElementById("txt_help").value;

  const socket = io();
  let socket_admin = null;

  socket.on("connect", () => {
    const params = {
      email,
      text,
    };

    socket.emit("client_first_access", params, (call, err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(call);
      }
    });
  });

  socket.on('client_list_all_messages', messages => {
    var template_client = document.getElementById('message-user-template').innerHTML;
    var template_admin = document.getElementById('admin-template').innerHTML;

    messages.forEach(message => {
      if (message.admin_id === null) {
        const rendered = Mustache.render(template_client, {
          message: message.text,
          email: message.user.email,
        });

        document.getElementById('messages').innerHTML += rendered;
      }
      else {
        const rendered = Mustache.render(template_admin, {
          message_admin: message.text,
        });

        document.getElementById('messages').innerHTML += rendered;
      }
    });
  });

  socket.on('admin_send_to_client', (message) => {
    socket_admin = message.socket_id;

    var template_admin = document.getElementById('admin-template').innerHTML;
    const rendered = Mustache.render(template_admin, {
      message_admin: message.text,
    });
    document.getElementById('messages').innerHTML += rendered;
  });

  document.querySelector('#send_message_button').addEventListener('click', (event) => {
    const textField = document.getElementById('message_user');
  
    const params = {
      text: textField.value,
      socket_admin
    };
  
    socket.emit('client_send_to_admin', params);
  
    const template_client = document.getElementById('message-user-template').innerHTML;
    const rendered = Mustache.render(template_client, {
      message: textField.value,
      email: email,
    });

    document.getElementById('messages').innerHTML += rendered;

    textField.value = '';
  });
});