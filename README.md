````markdown
# 🏋️‍♂️ GymPass Style API (Solid Gym)

API RESTful completa para gerenciamento de check-ins em academias, desenvolvida utilizando **Node.js**, **TypeScript** e princípios de **SOLID** e **Clean Architecture**.

A aplicação permite que usuários se cadastrem, busquem academias próximas (por geolocalização), realizem check-ins e acompanhem seu histórico. Também possui funcionalidades administrativas para validação de check-ins e cadastro de academias.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** & **TypeScript**: Base do desenvolvimento.
- **Express**: Framework para gerenciamento de rotas e requisições HTTP.
- **Prisma ORM**: Manipulação do banco de dados.
- **PostgreSQL**: Banco de dados relacional (via Docker).
- **Docker & Docker Compose**: Containerização do ambiente de banco de dados.
- **JWT (JSON Web Token)**: Autenticação segura.
- **Bcryptjs**: Hashing de senhas.
- **Zod**: Validação de dados e schemas.
- **Dayjs**: Manipulação de datas.

---

## ⚙️ Arquitetura e Design Patterns

O projeto foi construído seguindo rigorosamente os princípios de **Clean Architecture** e **SOLID**, visando desacoplamento e testabilidade:

- **Controller**: Responsável apenas pela interface HTTP (Input/Output).
- **Service**: Contém toda a Regra de Negócio (Ex: validação de distância, checagem de check-ins duplicados).
- **Repository Pattern**: Abstração da camada de banco de dados. O Service não conhece o Prisma, apenas o contrato do repositório (Inversão de Dependência).
- **Factory Pattern**: Utilizado para instanciar os Controllers com suas dependências complexas.

---

## 🚀 Regras de Negócio Implementadas

- [x] **Cadastro e Autenticação**: Usuários podem criar conta e fazer login (JWT).
- [x] **Geolocalização**: Busca de academias próximas (Raio de 10km) usando SQL puro e fórmula de Haversine.
- [x] **Check-in**:
    - O usuário não pode fazer check-in se estiver longe da academia (>100m).
    - O usuário não pode fazer 2 check-ins no mesmo dia.
- [x] **Validação (Admin)**: O check-in só pode ser validado por administradores até 20 minutos após a criação.
- [x] **RBAC (Controle de Acesso)**: Apenas administradores podem cadastrar academias e validar check-ins.

---

## 🔧 Como Rodar o Projeto

### Pré-requisitos
- **Node.js** (v18+)
- **Docker** e **Docker Compose** (para o banco de dados)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU-USUARIO/gympass-api-solid.git](https://github.com/SEU-USUARIO/gympass-api-solid.git)
   cd gympass-api-solid
````

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz baseando-se no `.env.example` (se houver) ou use:

    ```env
    NODE_ENV=dev
    # Exemplo de conexão docker local
    DATABASE_URL="postgresql://docker:docker@localhost:5432/gympass_api?schema=public"
    JWT_SECRET="segredo-super-secreto"
    ```

4.  **Suba o Banco de Dados (Docker):**

    ```bash
    docker compose up -d
    ```

5.  **Execute as Migrations do Prisma:**

    ```bash
    npx prisma migrate dev
    ```

6.  **Rode o servidor:**

    ```bash
    npm run dev
    ```

    🚀 O servidor iniciará em `http://localhost:3333`

-----

## 📍 Rotas da API

### 👤 Usuários

  - `POST /users`: Cadastro de usuário.
  - `POST /sessions`: Autenticação (Login).
  - `GET /me`: Perfil do usuário logado.
  - `PATCH /token/refresh`: (Opcional) Atualizar token.

### 🏢 Academias (Gyms)

  - `POST /gyms`: Cadastrar academia (Requer role: **ADMIN**).
  - `GET /gyms/search`: Buscar academias pelo nome.
  - `GET /gyms/nearby`: Buscar academias próximas (Geolocalização).

### ✅ Check-ins

  - `POST /gyms/:gymId/check-ins`: Realizar check-in.
  - `PATCH /check-ins/:checkInId/validate`: Validar check-in (Requer role: **ADMIN**).
  - `GET /check-ins/history`: Histórico de check-ins do usuário.
  - `GET /check-ins/metrics`: Quantidade total de check-ins do usuário.

-----

## 📝 Autor

Desenvolvido por **Jonathan Pires** durante jornada de estudos focada em Back-end Sólido.

-----

````

### 💡 Dicas para deixar ainda melhor:

1.  **Crie o `.env.example`**: Como seu `.env` original não vai para o Git (por segurança), crie um arquivo chamado `.env.example` apenas com as chaves, sem os valores reais, para quem baixar saber o que precisa configurar.
    ```text
    NODE_ENV=dev
    DATABASE_URL=
    JWT_SECRET=
    ```
2.  **Print do Insomnia**: Se quiser, tire um print da sua tela do Insomnia com as pastas organizadas e coloque no README. Isso dá um visual muito legal.
3.  **Link do LinkedIn**: Na sessão "Autor", você pode colocar o link para o seu perfil.

Gostou desse modelo? É só salvar e dar o `git push`! 🚀
````
