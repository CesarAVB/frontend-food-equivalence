# Lista de Substituição — Frontend

Interface web em Angular 20 para o sistema de equivalências nutricionais, integrada à API REST do backend Spring Boot. Permite consultar substituições alimentares, gerenciar alimentos, equivalências e usuários com controle de acesso por papel.

![Angular](https://img.shields.io/badge/Angular-20-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)

<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/f2e0992f-bd70-4561-9112-5faab8d4390d" />

<img width="1919" height="867" alt="image" src="https://github.com/user-attachments/assets/33ed8f3f-5206-4172-a339-827b5c0d195b" />

<img width="1919" height="871" alt="image" src="https://github.com/user-attachments/assets/94348fdb-85c2-4916-b975-c68e9492fa3b" />

<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/c9cd79c5-b702-46f9-936f-c9dc40f7e8d5" />

---

## Sumário

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar localmente](#como-rodar-localmente)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Autenticação e segurança](#autenticação-e-segurança)
- [Controle de acesso por papel](#controle-de-acesso-por-papel)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Páginas de gestão (admin)](#páginas-de-gestão-admin)
- [Variáveis de ambiente](#variáveis-de-ambiente)

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| Angular | 20 |
| TypeScript | ~5.9 |
| Bootstrap | 5.3.8 |
| Font Awesome | 7.2.0 |
| RxJS | ~7.8 |
| Zone.js | ~0.15 |

> Todos os componentes são standalone. Não há NgModules.

---

## Pré-requisitos

- Node.js 18+ (LTS recomendado)
- npm 9+
- Backend Spring Boot rodando em `http://localhost:8080`

---

## Como rodar localmente

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```

2. Confirme a URL da API no arquivo de ambiente:
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api/v1'
   };
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

4. Acesse em: `http://localhost:4200`

> O backend deve estar em execução antes de iniciar o frontend. Consulte o README do backend para configuração.

### Build de produção

```bash
npm run build
```

Os arquivos são gerados em `dist/frontend-food-equivalence/`.

---

## Estrutura do projeto

```
src/
├── app/
│   ├── components/
│   │   ├── equivalencia-form/   → Formulário de seleção de alimento e busca de equivalências
│   │   ├── resultado/           → Tabela de substitutos com ordenação e exportação CSV
│   │   ├── header/              → Cabeçalho com navegação por papel
│   │   └── footer/              → Rodapé com links de contato
│   ├── guards/
│   │   ├── auth.guard.ts        → Protege rotas autenticadas
│   │   ├── guest.guard.ts       → Redireciona usuários já logados
│   │   └── role.guard.ts        → adminGuard (ADMIN) e gestorGuard (ADMIN/NUTRICIONISTA)
│   ├── interceptors/
│   │   ├── jwt.interceptor.ts   → Injeta o header Authorization em todas as requisições
│   │   └── error-interceptor.ts → Redireciona para /login em respostas 401
│   ├── models/
│   │   ├── alimento.ts          → Interface Alimento, GrupoAlimentar e GRUPOS_ALIMENTARES
│   │   ├── auth-response.ts     → Resposta do endpoint de login
│   │   ├── equivalencia-response.ts → Equivalencia e EquivalenciaDetalhada
│   │   ├── page.ts              → Page<T> para respostas paginadas
│   │   └── usuario.ts           → Usuario, UsuarioSessao, UsuarioTipo, PlanoTipo
│   ├── pages/
│   │   ├── home/                → Página de consulta de equivalências
│   │   ├── login/               → Formulário de autenticação
│   │   └── admin/
│   │       ├── dashboard/       → Painel com totais e atalhos
│   │       ├── alimentos/       → CRUD de alimentos (paginado)
│   │       ├── equivalencias/   → CRUD de equivalências (paginado)
│   │       └── usuarios/        → CRUD de usuários (somente ADMIN)
│   └── services/
│       ├── auth.service.ts      → Login JWT, logout, estado do usuário
│       ├── alimento.service.ts  → CRUD e listagem de alimentos
│       ├── equivalencia.service.ts → CRUD e busca por alimento
│       ├── usuario.service.ts   → CRUD com ativar/desativar
│       └── notification.service.ts → Toasts de feedback
└── environments/
    ├── environment.ts           → API local (http://localhost:8080)
    └── environment.prod.ts      → API de produção
```

---

## Autenticação e segurança

O frontend utiliza autenticação JWT integrada ao backend:

1. O usuário faz login em `POST /api/v1/auth/login`
2. O token JWT retornado é salvo no `localStorage` (`auth_token`)
3. Os dados da sessão (nome, e-mail, tipo) são salvos no `sessionStorage`
4. O `JwtInterceptor` injeta `Authorization: Bearer <token>` em todas as requisições HTTP
5. O `ErrorInterceptor` redireciona para `/login` quando o backend retorna `401`
6. O logout limpa ambos os storages e invalida a sessão

---

## Controle de acesso por papel

| Papel | Permissões no frontend |
|---|---|
| `ADMIN` | Acesso total: consulta, alimentos, equivalências e usuários |
| `NUTRICIONISTA` | Consulta, criar/editar alimentos e equivalências |
| `PACIENTE` | Apenas consulta de equivalências na tela inicial |

A navegação no cabeçalho é renderizada condicionalmente de acordo com o papel do usuário logado.

---

## Rotas da aplicação

| Rota | Componente | Guard |
|---|---|---|
| `/` | → redireciona para `/home` | — |
| `/login` | `LoginComponent` | `guestGuard` |
| `/home` | `HomeComponent` | `authGuard` |
| `/admin/dashboard` | `DashboardComponent` | `authGuard` + `gestorGuard` |
| `/admin/alimentos` | `AlimentosListComponent` | `authGuard` + `gestorGuard` |
| `/admin/equivalencias` | `EquivalenciasListComponent` | `authGuard` + `gestorGuard` |
| `/admin/usuarios` | `UsuariosListComponent` | `authGuard` + `adminGuard` |

---

## Páginas de gestão (admin)

Todas as páginas admin utilizam Bootstrap modais para criar e editar registros sem sair da tela.

### Dashboard (`/admin/dashboard`)
- Totais de alimentos, equivalências e usuários (via API)
- Atalhos de navegação para cada área de gestão

### Alimentos (`/admin/alimentos`)
- Listagem paginada com filtros por descrição e grupo
- Criar e editar: código de substituição, grupo, descrição, energia (kcal)
- Remover (somente ADMIN)
- Paginação com navegação por página

### Equivalências (`/admin/equivalencias`)
- Listagem paginada com alimento de origem, substituto, fator e observação
- Criar e editar: selecionar alimento origem, substituto, fator de equivalência e observação
- Remover com confirmação

### Usuários (`/admin/usuarios`) — somente ADMIN
- Listagem com nome, e-mail, CPF, tipo, status (ativo/inativo) e plano
- Criar: nome, e-mail, CPF, tipo e senha
- Editar: todos os campos (senha opcional)
- Ativar / desativar sem excluir
- Remover com confirmação

---

## Variáveis de ambiente

| Arquivo | `apiUrl` | Uso |
|---|---|---|
| `environment.ts` | `http://localhost:8080/api/v1` | Desenvolvimento local |
| `environment.prod.ts` | `https://foods-api.nutriandrereis.com.br/api/v1` | Produção |

---

## Contato

Desenvolvido por **César Augusto Vieira Bezerra**.

---

© 2026 Desenvolvido por César Augusto Vieira Bezerra — Todos os direitos reservados.
