# Deploy na Vercel

## Configuração da URL do Backend

### 1. Variável de Ambiente

Configure a variável de ambiente `NEXT_PUBLIC_API_URL` na Vercel:

1. Acesse o projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://desafio-fullstack-mr4g.onrender.com`
   - **Environment**: Production, Preview, Development (conforme necessário)

**Importante**: Após adicionar a variável, você precisa fazer um novo deploy para que as alterações tenham efeito.

### 2. Para Desenvolvimento Local

Crie um arquivo `.env.local` na pasta `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Nota**: O arquivo `.env.local` não deve ser commitado (já está no .gitignore).

### 3. Exemplo de Arquivo

Veja o arquivo `env.example` como referência.

## Deploy

A Vercel detecta automaticamente projetos Next.js e faz o deploy automaticamente quando você faz push para o repositório conectado.

