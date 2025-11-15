# Frontend - Next.js

Interface web desenvolvida com Next.js 15 para gerenciamento de usuários.

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 23+
- npm ou yarn

### Instalação

1. **Instale as dependências:**

```bash
npm install
```

2. **Configure as variáveis de ambiente:**

```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` e configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. **Execute o servidor de desenvolvimento:**

```bash
npm run dev
```

4. **Acesse a aplicação:**

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint
```

## 🌐 Variáveis de Ambiente

### `.env.local`

Crie este arquivo na raiz do projeto `frontend/`:

```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Importante**: Variáveis que começam com `NEXT_PUBLIC_` são expostas ao cliente.

### Para Produção (Vercel)

Configure a variável `NEXT_PUBLIC_API_URL` nas configurações do projeto na Vercel.

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                 # App Router (Next.js 15)
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página inicial
│   ├── components/          # Componentes React
│   │   ├── UserModal.tsx   # Modal de usuário
│   │   └── UserForm.tsx    # Formulário de usuário
│   ├── services/           # Serviços de API
│   │   ├── users.service.ts
│   │   └── profiles.service.ts
│   ├── types/              # Tipos TypeScript
│   │   ├── user.types.ts
│   │   └── profile.types.ts
│   ├── hooks/              # Custom hooks
│   │   └── useDebounce.ts
│   └── lib/                # Utilitários
│       └── api.ts           # Configuração Axios
├── .env.local              # Variáveis de ambiente (não versionado)
└── env.example             # Exemplo de variáveis
```

## 🎨 Funcionalidades

### Interface

- ✅ **Listagem de usuários** em cards responsivos
- ✅ **Busca** por nome, email ou perfil com debounce
- ✅ **Filtro por perfil** via dropdown
- ✅ **Busca por ID** direta
- ✅ **Modal de detalhes** com visualização completa
- ✅ **Edição inline** de usuários
- ✅ **Criação de usuários** com formulário validado
- ✅ **Ativação/desativação** de usuários
- ✅ **Exclusão** com confirmação
- ✅ **Tema dark** permanente

### Validações

- ✅ Validação de email com regex
- ✅ Campos obrigatórios marcados com `*`
- ✅ Mensagens de erro contextuais
- ✅ Feedback visual (bordas vermelhas)
- ✅ Validação em tempo real

## 🛠️ Tecnologias

- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Axios**: Cliente HTTP
- **React Hooks**: Gerenciamento de estado

## 📡 Integração com API

A aplicação consome a API do backend através dos serviços:

- `usersService`: Operações CRUD de usuários
- `profilesService`: Operações CRUD de perfis

### Configuração do Axios

O Axios está configurado em `src/lib/api.ts` com:
- Base URL configurável via `NEXT_PUBLIC_API_URL`
- Headers padrão
- Tratamento de erros centralizado

## 🎯 Componentes Principais

### UserModal

Modal que exibe detalhes do usuário e permite:
- Visualização de dados
- Edição inline
- Ativação/desativação
- Exclusão

### UserForm

Formulário reutilizável para:
- Criação de novos usuários
- Edição de usuários existentes
- Validação completa
- Feedback visual

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório à Vercel
2. Configure a variável `NEXT_PUBLIC_API_URL`
3. Deploy automático a cada push

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📝 Notas

- O frontend **não** está containerizado, pois será deployado na Vercel
- Hot reload funciona automaticamente em desenvolvimento
- O tema dark é aplicado permanentemente via classe `dark` no HTML

## 📚 Documentação Adicional

Para mais informações sobre o projeto completo, consulte o [README principal](../README.md).
