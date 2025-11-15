# Backend - API NestJS

API REST desenvolvida com NestJS para gerenciamento de usuários e perfis.

## 🚀 Como Rodar com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Executando

1. **Inicie o container:**

```bash
docker-compose up
```

2. **Para executar em background:**

```bash
docker-compose up -d
```

3. **Para parar o container:**

```bash
docker-compose down
```

4. **Para ver os logs:**

```bash
docker-compose logs -f
```

### Hot Reload

O Docker está configurado com hot reload. Qualquer alteração nos arquivos `src/` será refletida automaticamente sem necessidade de rebuild.

### Portas

- **API**: `http://localhost:3001`

### Variáveis de Ambiente

Configure no `docker-compose.yml`:

- `PORT`: Porta do servidor (padrão: 3001)
- `NODE_ENV`: Ambiente de execução (development/production)
- `FRONTEND_URL`: URL do frontend para CORS

## 🛠️ Como Rodar Localmente

### Pré-requisitos

- Node.js 23+
- npm ou yarn

### Instalação

```bash
npm install
```

### Executando

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

### Testes

```bash
# Executar testes
npm test

# Testes com cobertura
npm run test:cov

# Testes em modo watch
npm test -- --watch
```

### Linting

```bash
npm run lint
```

## 📡 Endpoints da API

### Usuários

- `GET /users` - Listar todos os usuários
- `GET /users/:id` - Buscar usuário por ID
- `GET /users/profile/:profileId` - Filtrar usuários por perfil
- `POST /users` - Criar novo usuário
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário (soft delete)
- `PUT /users/:id/activate` - Ativar usuário
- `PUT /users/:id/deactivate` - Desativar usuário

### Perfis

- `GET /profiles` - Listar todos os perfis
- `GET /profiles/:id` - Buscar perfil por ID
- `POST /profiles` - Criar novo perfil
- `PATCH /profiles/:id` - Atualizar perfil
- `DELETE /profiles/:id` - Deletar perfil

## 📦 Estrutura do Projeto

```
backend/
├── src/
│   ├── users/              # Módulo de usuários
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entities/       # Entidades de domínio
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── profiles/           # Módulo de perfis
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── profiles.controller.ts
│   │   ├── profiles.service.ts
│   │   └── profiles.module.ts
│   ├── app.module.ts       # Módulo raiz
│   └── main.ts             # Entry point
├── dockerfile.dev          # Dockerfile para desenvolvimento
├── docker-compose.yml      # Configuração Docker Compose
└── package.json
```

## 🔧 Tecnologias

- **NestJS**: Framework Node.js
- **TypeScript**: Linguagem de programação
- **class-validator**: Validação de DTOs
- **class-transformer**: Transformação de objetos
- **Jest**: Framework de testes

## 📝 Validações

A API utiliza `class-validator` para validação de dados:

- **Email**: Validação de formato de email
- **Campos obrigatórios**: Nome, sobrenome, email e perfil são obrigatórios
- **Mensagens personalizadas**: Mensagens de erro em português

## 🔒 CORS

CORS está configurado para permitir requisições de:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`
- URL configurada em `FRONTEND_URL`

## 📊 Dados

Atualmente, os dados são armazenados em memória. Os dados mockados incluem:

- **Usuários**: 3 usuários de exemplo
- **Perfis**: 3 perfis (Administrador, Usuário, Moderador)

IDs são gerados incrementalmente a partir do maior ID existente.

## 🐳 Docker

### Dockerfile de Desenvolvimento

O `dockerfile.dev` está configurado para:
- Hot reload automático
- Volume mounting para código fonte
- Instalação de dependências

### Docker Compose

O `docker-compose.yml` configura:
- Porta 3001 exposta
- Volumes para hot reload
- Variáveis de ambiente

## 🧪 Testes

Testes unitários estão implementados para:
- `UsersService`: Criação, busca, ativação/desativação
- `ProfilesService`: Criação e busca

Para adicionar mais testes, consulte os arquivos `*.spec.ts`.

## 📚 Documentação Adicional

Para mais informações sobre o projeto completo, consulte o [README principal](../README.md).
