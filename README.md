# API SNX

Este projeto foi desenvolvido como parte do desafio técnico para a vaga de Full Stack Developer Jr na Smart NX. Ele consiste em uma API para gerenciamento de posts, utilizando Node.js, Express, PostgreSQL e Sequelize.

## Executando o Projeto

Siga estas etapas para configurar e rodar o projeto na sua máquina local:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/K010TE/projeto-snx.git
   cd projeto-snx
   ```

2. **O arquivo `.env` já está configurado no repositório:**

   ```env
   POSTGRES_URL=postgresql://public_user:public_password@host_do_banco:5432/api_snx
   PORT=3333
   ```

   As credenciais já estão prontas para uso com um banco público configurado para este projeto. Como não há dados sensíveis e o projeto é apenas para fins de avaliação tecnica, escolhi essa abordagem por ser mais fácil de ser testada e avaliada.

3. **Instale as dependências:**

   ```bash
   npm install
   ```

4. **Inicie o servidor:**

   ```bash
   npm start
   ```

   O servidor será iniciado em `http://localhost:3333`.

## Endpoints da API

### Criar Post

- **Método:** POST
- **URL:** `/posts`
- **Body:**
  ```json
  {
    "title": "Título do Post",
    "content": "Conteúdo do Post"
  }
  ```
- **Resposta:**
  ```json
  {
    "id": 1,
    "title": "Título do Post",
    "content": "Conteúdo do Post",
    "created_at": "2025-01-12T12:00:00.000Z",
    "updated_at": "2025-01-12T12:00:00.000Z"
  }
  ```

### Listar Posts

- **Método:** GET
- **URL:** `/posts`
- **Resposta:**
  ```json
  [
    {
      "id": 1,
      "title": "Título do Post",
      "content": "Conteúdo do Post",
      "created_at": "2025-01-12T12:00:00.000Z",
      "updated_at": "2025-01-12T12:00:00.000Z"
    }
  ]
  ```

### Atualizar Post

- **Método:** PUT
- **URL:** `/posts/:id`
- **Body:**
  ```json
  {
    "title": "Novo Título",
    "content": "Novo Conteúdo"
  }
  ```
- **Resposta:**
  ```json
  {
    "id": 1,
    "title": "Novo Título",
    "content": "Novo Conteúdo",
    "created_at": "2025-01-12T12:00:00.000Z",
    "updated_at": "2025-01-12T12:30:00.000Z"
  }
  ```

### Deletar Post

- **Método:** DELETE
- **URL:** `/posts/:id`
- **Resposta:**
  ```json
  {
    "message": "Post deletado com sucesso"
  }
  ```

## Notas Importantes

- O arquivo `.env` já contém as credenciais públicas para acesso ao banco configurado para este projeto.
- Este projeto foi desenvolvido para fins de avaliação técnica.

## Contato

- **Nome:** Itagiba Neto
- **E-mail:** itagiba.net@gmail.com
- **LinkedIn:** linkedin.com/in/itagiba-neto

---
