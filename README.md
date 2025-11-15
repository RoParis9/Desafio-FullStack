# Desafio FullStack

Monorepo usando npm workspaces com **Next.js** (frontend) e **NestJS** (backend).

## 🚀 Tecnologias

- **Frontend**: Next.js 14 com TypeScript e App Router
- **Backend**: NestJS com TypeScript
- **Gerenciamento**: npm workspaces

## 📁 Estrutura do Projeto

```
.
├── frontend/          # Next.js App Router
│   ├── app/          # Páginas e rotas
│   ├── next.config.js
│   └── package.json
├── backend/          # NestJS API
│   ├── src/          # Código fonte
│   ├── nest-cli.json
│   └── package.json
└── package.json      # Configuração do workspace raiz
```

## 📦 Instalação

Instale todas as dependências dos workspaces:

```bash
npm install
```

Isso instalará as dependências de todos os workspaces (frontend e backend) e criará um `node_modules` na raiz com dependências compartilhadas.

## 🛠️ Scripts Disponíveis

### Na raiz do projeto:

- `npm run dev` - Inicia frontend (porta 3000) e backend (porta 3001) em paralelo
- `npm run dev:frontend` - Inicia apenas o frontend (Next.js)
- `npm run dev:backend` - Inicia apenas o backend (NestJS)
- `npm run build` - Builda todos os workspaces
- `npm run build:frontend` - Builda apenas o frontend
- `npm run build:backend` - Builda apenas o backend
- `npm run start:frontend` - Inicia o frontend em modo produção
- `npm run start:backend` - Inicia o backend em modo produção
- `npm run lint` - Executa lint em todos os workspaces

### Em cada workspace:

Você pode executar scripts diretamente em cada workspace:

```bash
# Frontend
npm run dev --workspace=frontend
# ou
cd frontend && npm run dev

# Backend
npm run dev --workspace=backend
# ou
cd backend && npm run dev
```

## 🌐 URLs de Desenvolvimento

- **Frontend (Next.js)**: http://localhost:3000
- **Backend (NestJS)**: http://localhost:3001
- **Backend Health Check**: http://localhost:3001/health

## 📝 Adicionando Dependências

### Adicionar dependência a um workspace específico:

```bash
# Frontend
npm install axios --workspace=frontend

# Backend
npm install @nestjs/typeorm typeorm --workspace=backend
```

### Adicionar dependência compartilhada (raiz):

```bash
npm install -w <nome-do-pacote>
```

## 🎯 Próximos Passos

### Frontend (Next.js):
- Adicione componentes em `frontend/app/`
- Configure API routes se necessário
- Adicione estilos (Tailwind CSS, CSS Modules, etc)

### Backend (NestJS):
- Crie módulos, controllers e services
- Configure banco de dados (TypeORM, Prisma, etc)
- Adicione autenticação e validação
- Configure variáveis de ambiente

## ✨ Vantagens do npm workspaces

- **Dependências compartilhadas**: Pacotes comuns são instalados uma vez na raiz
- **Gerenciamento centralizado**: Um único `package.json` na raiz gerencia tudo
- **Scripts unificados**: Execute comandos em todos os workspaces ou em específicos
- **Desenvolvimento simplificado**: Desenvolva frontend e backend no mesmo repositório
- **TypeScript**: Ambos os projetos já estão configurados com TypeScript

