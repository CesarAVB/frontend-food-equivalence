# Lista de Substituição

Aplicativo frontend em Angular para calcular equivalências e sugerir substituições alimentares.

## Descrição
Projeto para auxiliar pacientes com um guia de substituições alimentares. Inclui formulário de cálculo de equivalências, resultados com exportação e uma interface focada em simplicidade e usabilidade.

## Tecnologias
- Angular 20 (standalone components)
- TypeScript
- SCSS
- Bootstrap 5 (carregado como CSS compilado em `angular.json`)
- FontAwesome

## Pré-requisitos
- Node.js 18+ (ou LTS atual)
- npm

## Instalação
1. Abra o terminal na raiz do projeto
2. Instale dependências:

```bash
npm install
```

## Execução (desenvolvimento)
Inicie a aplicação em modo de desenvolvimento:

```bash
npm start
```

O script `start` é configurado no `package.json` e iniciará o servidor de desenvolvimento.

## Build
Para gerar a versão de produção (se configurado):

```bash
npm run build
```

## Estrutura principal
- `src/app/components` — componentes reutilizáveis (header, footer, formulário, resultado)
- `src/app/pages/home` — página inicial e hero
- `src/app/services` — serviços e lógica de cálculo
- `public/images` — logos e imagens usadas

## Observações importantes
- O projeto carrega o CSS compilado do Bootstrap (`node_modules/bootstrap/dist/css/bootstrap.min.css`) para evitar warnings de deprecação do Sass do Bootstrap.
- O `header` e o `footer` foram simplificados: o status "Online" e o link do Instagram foram removidos conforme personalização do projeto.

## Contato
Desenvolvido por César Augusto Vieira Bezerra.

---
© 2026 Desenvolvido por César Augusto Vieira Bezerra — Todos os direitos reservados.
