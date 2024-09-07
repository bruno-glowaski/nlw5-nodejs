# Chat de atendimento - NLW05

Projeto desenvolvido durante o evento Next Level Week #5, realizada pela RocketSeat, módulo Node.JS.
Feito utilizando Node.JS, TypeScript e SQLite.

## Dependências

- Express;
- Socket.IO;
- Socket.IO-Client;
- TypeORM;
- SQLite3;
- UUID;
- EJS;
- reflect-metadata.

### Dependências de Desenvolvimento

- TypeScript
- ts-node-dev

## Utilização

```
yarn dev
```

Por padrão, o site é hospedado na porta 3333.

### Rotas

- `/`: Página de atendimento de cliente.
- `/admin`: Página de administrador.

#### APIs

- `/settings`
  - **POST**: Cria uma nova configuração. Se o nome de usuário já existir, um erro de código 400 será retornado.
    - Corpo de entrada(JSON):
      - *username*: Nome do usuário;
      - *chat*: Se verdadeiro, o acesso ao chat será liberado.
    - Corpo de retorno(JSON):
      - *id*: Identificador único da configuração;
      - *username*: Nome do usuário;
      - *chat*: Se verdadeiro, o acesso ao chat será liberado;
      - *created_at*: Data da criação das configurações do usuário;
      - *updated_at*: Data da ultima atualização das configurações do usuário.

  - **GET**: Recupera a configuração para um nome de usuário específico.
    - Parâmetros de URL: `/settings/:username`
    - Corpo de retorno(JSON):
      - *id*: Identificador único da configuração;
      - *username*: Nome do usuário;
      - *chat*: Se verdadeiro, o acesso ao chat será liberado;
      - *created_at*: Data da criação das configurações do usuário;
      - *updated_at*: Data da ultima atualização das configurações do usuário.

  - **PUT**: Atualiza as configurações para um nome de usuário específico.
    - Parâmetros de URL: `/settings/:username`
    - Corpo de entrada(JSON):
      - *chat*: Se verdadeiro, o acesso ao chat será liberado.
    - Sem retorno.

- `/users`
  - **POST**: Cria um novo usuário.
    - Corpo de entrada(JSON):
      - *email*: E-mail que identifica o usuário.
    - Corpo de retorno(JSON):
      - *id*: UUID que identifica o usuário;
      - *email*: E-mail que identifica o usuário;
      - *created_at*: Data em que o usuário foi criado.
  
- `/messages`
  - **POST**: Envia uma nova mensagem.
    - Corpo de entrada(JSON):
      - *admin_id*: Se a mensagem vier de um administrador, este será o id do socket do administrador que a enviou. Será nulo se a mensagem vem do usuário;
      - *user_id*: UUID do usuário remetente/receptor da mensagem;
      - *text*: Conteúdo da mensagem.
    - Corpo de retorno(JSON):
      - *id*: Identificador único da mensagem;
      - *admin_id*: Se a mensagem vier de um administrador, este será o id do socket do administrador que a enviou;
      - *user_id*: UUID do usuário remetente/receptor da mensagem;
      - *text*: Conteúdo da mensagem.
      - *created_at*: Data em que a mensagem foi enviada.
  - **GET**: Recupera uma mensagem previamente enviada.
    - Parâmetros de URL: `/messages/:id`
    - Corpo de retorno(JSON):
      - *id*: Identificador único da mensagem;
      - *admin_id*: Se a mensagem vier de um administrador, este será o id do socket do administrador que a enviou;
      - *user_id*: UUID do usuário remetente/receptor da mensagem;
      - *text*: Conteúdo da mensagem.
      - *created_at*: Data em que a mensagem foi enviada.
