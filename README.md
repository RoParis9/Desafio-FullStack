# Desafio Técnico Fullstack

Sistema de gerenciamento de usuários desenvolvido com NestJS (backend) e Next.js (frontend).

## 📋 Índice

- [Como Rodar a Aplicação](#-como-rodar-a-aplicação)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Decisões Técnicas](#-decisões-técnicas)
- [Pontos de Melhoria](#-pontos-de-melhoria)

## 🚀 Como Rodar a Aplicação

### Pré-requisitos

- Docker e Docker Compose
- Node.js 23+ (para desenvolvimento local do frontend)

### Usando Docker Compose (Recomendado)

O backend pode ser executado com Docker Compose, que inclui hot reload automático:

```bash
docker-compose up
```

O backend estará disponível em `http://localhost:3001`

**Hot Reload**: Qualquer alteração nos arquivos `backend/src/` será refletida automaticamente sem necessidade de rebuild.

Para executar em background:

```bash
docker-compose up -d
```

Para parar os containers:

```bash
docker-compose down
```

Para ver os logs:

```bash
docker-compose logs -f
```

### Frontend (Desenvolvimento Local)

O frontend deve ser executado localmente (não está no Docker Compose, pois será deployado na Vercel):

```bash
cd frontend
npm install
cp env.example .env.local
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

**Nota**: O arquivo `.env.local` deve conter:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Variáveis de Ambiente

#### Backend (Docker Compose)

Configure no `docker-compose.yml`:

- `PORT`: Porta do servidor (padrão: 3001)
- `NODE_ENV`: Ambiente de execução (development/production)
- `FRONTEND_URL`: URL do frontend para CORS (opcional, aceita múltiplas URLs separadas por vírgula)

#### Frontend

Configure no arquivo `.env.local` (criar a partir de `env.example`):

- `NEXT_PUBLIC_API_URL`: URL do backend (padrão: http://localhost:3001)

**Para produção (Vercel)**: Configure `NEXT_PUBLIC_API_URL` nas variáveis de ambiente do projeto na Vercel.

## ✨ Funcionalidades Implementadas

### Backend (NestJS)

- ✅ **CRUD completo de usuários**
  - Criar, listar, buscar, atualizar e deletar usuários
  - Soft delete implementado
  - IDs incrementais automáticos

- ✅ **CRUD completo de perfis**
  - Criar, listar, buscar, atualizar e deletar perfis

- ✅ **Gerenciamento de status de usuários**
  - Ativar/desativar usuários
  - Endpoints dedicados: `PUT /users/:id/activate` e `PUT /users/:id/deactivate`

- ✅ **Filtros e buscas**
  - Buscar usuário por ID: `GET /users/:id`
  - Filtrar usuários por perfil: `GET /users/profile/:profileId`
  - Listar todos os usuários: `GET /users`

- ✅ **Validações**
  - Validação de email com `class-validator`
  - Validação de campos obrigatórios
  - Mensagens de erro personalizadas

- ✅ **CORS configurado**
  - Suporte para múltiplas origens
  - Configuração flexível via variáveis de ambiente

- ✅ **Testes unitários**
  - Testes para `UsersService` e `ProfilesService`
  - Cobertura de casos de sucesso e erro

### Frontend (Next.js)

- ✅ **Interface de gerenciamento de usuários**
  - Listagem de usuários em cards responsivos
  - Tema dark permanente
  - Design moderno com Tailwind CSS

- ✅ **Busca e filtros**
  - Busca por nome, email ou perfil com debounce
  - Filtro por perfil via dropdown
  - Busca direta por ID de usuário

- ✅ **Modal de detalhes do usuário**
  - Visualização completa dos dados
  - Edição inline de usuários
  - Ativação/desativação de usuários
  - Exclusão com confirmação

- ✅ **Criação de usuários**
  - Formulário completo com validação
  - Feedback visual de erros
  - Validação de email em tempo real

- ✅ **Validações no frontend**
  - Validação de email com regex
  - Campos obrigatórios marcados com asterisco
  - Mensagens de erro contextuais
  - Feedback visual (bordas vermelhas)

- ✅ **Integração com API**
  - Serviços organizados com Axios
  - Tratamento de erros
  - Loading states

## 🎯 Decisões Técnicas

### Backend

**NestJS como framework:**
- Arquitetura modular e escalável
- Suporte nativo a TypeScript
- Injeção de dependências
- Facilita testes e manutenção

**Dados em memória:**
- Escolhido para simplicidade e rapidez de desenvolvimento
- Facilita testes e demonstração
- Pode ser facilmente migrado para banco de dados

**Validação com class-validator:**
- Validação declarativa e reutilizável
- Mensagens de erro personalizadas
- Integração nativa com NestJS

**Soft delete:**
- Preserva histórico de dados
- Permite recuperação de usuários deletados
- Melhor para auditoria

**IDs incrementais:**
- Simples e previsível
- Facilita testes e debugging
- Em produção, considerar UUIDs

### Frontend

**Next.js 15 com App Router:**
- Renderização no servidor (SSR)
- Roteamento moderno e performático
- Suporte nativo a TypeScript

**Tailwind CSS:**
- Estilização rápida e consistente
- Design system coeso
- Responsividade facilitada

**Axios para requisições:**
- Interceptors para tratamento global de erros
- Configuração centralizada
- Suporte a cancelamento de requisições

**Validação no frontend:**
- Melhor experiência do usuário
- Feedback imediato
- Reduz requisições desnecessárias ao backend

**Debounce na busca:**
- Reduz carga no servidor
- Melhora performance
- Experiência mais fluida

### Arquitetura

**Separação de responsabilidades:**
- Services para lógica de negócio
- Controllers para endpoints HTTP
- DTOs para validação e transferência de dados
- Entities para modelos de domínio

**Modularidade:**
- Módulos independentes (Users, Profiles)
- Fácil adicionar novos recursos
- Testes isolados

## 🔮 Pontos de Melhoria

### Observabilidade

- **Logging estruturado**: Implementar Winston ou Pino com níveis de log apropriados
- **Métricas**: Adicionar Prometheus para coleta de métricas (latência, throughput, erros)
- **Tracing distribuído**: Integrar OpenTelemetry para rastreamento de requisições
- **Health checks**: Endpoints `/health` e `/ready` para monitoramento
- **Alertas**: Configurar alertas para erros críticos e degradação de performance
- **Dashboards**: Criar dashboards no Grafana para visualização de métricas

### Persistência em Banco de Dados

- **Migração para PostgreSQL ou MySQL**: Substituir dados em memória por banco relacional
- **ORM/Query Builder**: Implementar TypeORM, Prisma ou Sequelize
- **Migrations**: Sistema de migrações para versionamento do schema
- **Seeding**: Scripts para popular banco com dados iniciais
- **Backup e restore**: Estratégia de backup automatizado
- **Índices**: Otimizar queries com índices apropriados
- **Transações**: Garantir consistência em operações complexas

### Arquitetura Escalável

- **Microserviços**: Dividir em serviços menores e independentes
- **Message Queue**: Implementar RabbitMQ ou Kafka para comunicação assíncrona
- **API Gateway**: Centralizar roteamento e autenticação
- **Cache distribuído**: Redis para cache de dados frequentes
- **Load balancing**: Distribuir carga entre múltiplas instâncias
- **CDN**: Servir assets estáticos via CDN
- **Containerização**: Otimizar Dockerfiles para produção
- **Orquestração**: Kubernetes para gerenciamento de containers

### Domain-Driven Design (DDD)

- **Agregados**: Definir agregados de domínio (User, Profile)
- **Value Objects**: Criar objetos de valor para Email, Name, etc.
- **Domain Services**: Lógica de negócio complexa em serviços de domínio
- **Repositories**: Abstrair acesso a dados com padrão Repository
- **Domain Events**: Eventos de domínio para comunicação entre agregados
- **Bounded Contexts**: Separar contextos delimitados
- **Ubiquitous Language**: Glossário de termos do domínio

### CI/CD Mais Robusto

- **Pipeline multi-estágio**: Desenvolvimento → Staging → Produção
- **Testes automatizados**: Unitários, integração e E2E
- **Code quality**: SonarQube ou CodeClimate para análise de código
- **Security scanning**: Verificação de vulnerabilidades (Snyk, Dependabot)
- **Deploy automatizado**: Deploy automático após aprovação
- **Rollback automático**: Reversão em caso de falha
- **Feature flags**: Deploy gradual de funcionalidades
- **Blue-green deployment**: Reduzir downtime em deploys

### Testes

- **Cobertura de testes**: Aumentar para 80%+ de cobertura
- **Testes de integração**: Testar fluxos completos end-to-end
- **Testes E2E**: Cypress ou Playwright para testes de interface
- **Testes de carga**: K6 ou Artillery para validar performance
- **Testes de segurança**: OWASP ZAP para vulnerabilidades
- **Mocks e fixtures**: Dados de teste reutilizáveis
- **Testes de contrato**: Pact para garantir contratos entre serviços

### Outras Melhorias

- **Autenticação e autorização**: JWT, OAuth2, RBAC
- **Rate limiting**: Proteção contra abuso de API
- **Documentação de API**: Swagger/OpenAPI completo
- **Versionamento de API**: Estratégia de versionamento (v1, v2)
- **Internacionalização (i18n)**: Suporte a múltiplos idiomas
- **Acessibilidade (a11y)**: WCAG 2.1 compliance
- **PWA**: Transformar em Progressive Web App
- **Otimização de performance**: Code splitting, lazy loading
- **SEO**: Meta tags, sitemap, structured data
- **WebSockets**: Comunicação em tempo real
- **Paginação**: Implementar paginação em listagens
- **Exportação de dados**: CSV, PDF, Excel
- **Notificações**: Sistema de notificações em tempo real

## 📚 Estrutura do Projeto

```
Desafio-FullStack/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── users/   # Módulo de usuários
│   │   ├── profiles/# Módulo de perfis
│   │   └── main.ts  # Entry point
│   ├── dockerfile    # Dockerfile de produção
│   └── dockerfile.dev # Dockerfile de desenvolvimento
├── frontend/        # Aplicação Next.js
│   ├── src/
│   │   ├── app/     # App Router
│   │   ├── components/
│   │   └── services/
│   └── .env.local   # Variáveis de ambiente (não commitado)
├── docker-compose.yml # Configuração Docker Compose
└── README.md        # Este arquivo
```

## 🧪 Testes

### Backend

```bash
cd backend
npm test
npm run test:cov  # Com cobertura
```

### Frontend

```bash
cd frontend
npm test
```

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 👤 Autor

Desenvolvido como parte do desafio técnico fullstack.
