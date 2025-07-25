-----

# Vylex Task Control

## Visão Geral do Projeto

O Vylex Task Control é uma aplicação full-stack projetada para o gerenciamento de tarefas. O sistema é composto por um backend robusto desenvolvido com NestJS, aplicando os princípios do Domain-Driven Design (DDD), e um frontend moderno e escalável construído com React, utilizando a metodologia Feature-Sliced Design (FSD). A comunicação entre o frontend e o backend é realizada através de uma API RESTful, e a persistência de dados é gerenciada pelo Prisma ORM com um banco de dados MySQL. Todo o ambiente de desenvolvimento e produção é orquestrado com Docker, facilitando a configuração e a execução.

## Tech Stack

  - **Backend:**
      - [NestJS](https://nestjs.com/): Um framework Node.js progressivo para a construção de aplicações server-side eficientes e escaláveis.
      - [Prisma ORM](https://www.prisma.io/): Um ORM de última geração para Node.js e TypeScript.
      - [MySQL](https://www.mysql.com/): Sistema de gerenciamento de banco de dados relacional.
      - [TypeScript](https://www.typescriptlang.org/): Superset de JavaScript que adiciona tipagem estática.
  - **Frontend:**
      - [React](https://reactjs.org/): Uma biblioteca JavaScript para a construção de interfaces de usuário.
      - [TypeScript](https://www.typescriptlang.org/): Superset de JavaScript que adiciona tipagem estática.
  - **DevOps:**
      - [Docker](https://www.docker.com/): Plataforma de contêineres para desenvolver, enviar e executar aplicações.
      - [Docker Compose](https://docs.docker.com/compose/): Ferramenta para definir e executar aplicações Docker multi-contêiner.

-----

## Arquitetura do Projeto

A arquitetura do projeto foi cuidadosamente planejada para garantir escalabilidade, manutenibilidade e principalmente um claro desacoplamento de responsabilidades, tanto no backend quanto no frontend.

### Backend: Domain-Driven Design (DDD) com NestJS

O backend segue os princípios do **Domain-Driven Design (DDD)** para organizar a lógica de negócio de forma complexa e centrada no domínio. A estrutura de diretórios reflete as camadas do DDD:

  - **/src/@core/**: Este é o coração da aplicação, onde reside toda a lógica de negócio. Ele é subdividido em duas camadas principais: `domain` e `application`.
      - **`domain`**: Contém a lógica de negócio mais pura e central. É organizado por contexto de negócio (`task`, `user`).
          - `*.entity.ts` (ex: `task.entity.ts`): Representa os objetos centrais do domínio, com sua identidade, estado e comportamento.
          - `*.repository.ts` (ex: `user.repository.ts`): São as interfaces (contratos) que definem como os dados das entidades devem ser persistidos. A implementação concreta que utiliza o Prisma ORM reside na camada de `infra`.
          - Outros arquivos (`*.type.ts`, `*.enum.ts`): Definições de tipos, enums e objetos de valor específicos daquele domínio.
      - **`application`**: Orquestra os fluxos de trabalho e os casos de uso da aplicação.
          - `use-cases`: Contém a lógica para cada operação que a aplicação pode realizar (ex: `create-task`, `find-all-tasks`). Eles coordenam as entidades e repositórios do domínio para executar as regras de negócio.
          - `contracts`: Define os DTOs (Data Transfer Objects), que são os contratos de dados para a entrada e saída dos casos de uso (ex: `create-task.dto.ts`, `task-output.dto.ts`).
      - **`errors`**: Centraliza as classes de erro customizadas, permitindo um tratamento de erros padronizado em toda a aplicação.
      

  - **/src/infra/**: Contém as implementações das interfaces definidas no domínio, como repositórios e serviços de terceiros. É a camada que lida com os detalhes técnicos.

      - **`/adapters`**: Implementação dos repositórios usando o Prisma ORM.
      - **`/controllers`**: Módulos e controladores do NestJS que expõem a API.
      - **`/auth`**: Lógica de autenticação e autorização, como estratégias do Passport.js.

  * **/src/modules/**: Como ilustrado na imagem, este diretório contém os módulos de funcionalidades da aplicação (ex: `auth.module.ts`, `users.module.ts`, `tasks.module.ts`). Cada módulo encapsula um conjunto coeso de funcionalidades, agrupando controladores, provedores de serviço e importações relacionadas, promovendo uma organização clara e de baixo acoplamento.

  * **/src/app.module.ts**: Este é o ponto central de orquestração para a arquitetura modular do NestJS. Sua principal responsabilidade é importar e agregar todos os outros módulos de funcionalidades (`UsersModule`, `TasksModule`, `AuthModule`, etc.), configurando o gráfico de dependências e unindo todas as partes da aplicação.

  * **/src/main/**: Ponto de entrada da aplicação, onde o NestJS é inicializado e as configurações principais são carregadas.

### Frontend: Feature-Sliced Design (FSD) com React

O frontend adota a metodologia **Feature-Sliced Design (FSD)** para organizar o código de forma modular e escalável. A estrutura de pastas é dividida em "slices" (fatias), que promovem baixo acoplamento e alta coesão.

  - **/src/app/**: A fatia mais alta na hierarquia. Inicializa a aplicação, configurando roteadores, provedores de estado global (Context API) e estilos globais.

  - **/src/pages/**: Compõe páginas completas a partir das fatias de nível inferior (`widgets`, `features`, `entities`). Cada página representa uma rota da aplicação (ex: `HomePage`, `LoginPage`).

  - **/src/widgets/**: Seções complexas e independentes de uma página, como um `Header`, `Sidebar` ou `TaskList`. São compostos por `features` e `entities`.

  - **/src/features/**: Funcionalidades que entregam valor ao usuário, contendo a lógica de interação. Exemplos incluem `CreateTaskForm`, `UserLogin` ou `FilterTasks`.

  - **/src/entities/**: Unidades de negócio ou objetos de domínio do frontend, como `User` ou `Task`. Geralmente, contêm componentes para exibir os dados da entidade e a lógica de estado relacionada.

  - **/src/shared/**: A fatia de nível mais baixo. Contém código que pode ser reutilizado em qualquer parte da aplicação, como componentes de UI (botões, inputs), hooks, constantes e funções utilitárias. Não possui dependências de outras fatias.

-----

## Configuração e Execução

Existem duas maneiras de configurar o ambiente: utilizando Docker (recomendado para uma configuração rápida e consistente) ou manualmente (ideal para desenvolvimento focado em uma parte específica da aplicação).

### Método 1: Com Docker (Recomendado)

Este método orquestra todos os serviços necessários (backend, frontend e banco de dados) de forma automática.

**Requisitos:**

  - [Docker](https://www.docker.com/get-started)
  - [Docker Compose](https://docs.docker.com/compose/install/)

**Passos:**

1.  **Clone o Repositório:**

    ```bash
    git clone https://github.com/Daniel-Brd/vylex_task_control.git
    ```

2.  **Navegue até o Diretório Raiz:**

    ```bash
    cd vylex_task_control
    ```

3.  **Execute o Docker Compose:**
    Este comando irá construir as imagens, iniciar os contêineres e popular o banco de dados com dados iniciais (seed).

    ```bash
    docker compose up --build -d
    ```

4.  **Acesse a Aplicação:**

      - **Frontend:** [http://localhost](http://localhost)

5.  **Usuário de Demonstração:**
    O banco de dados já vem populado com um usuário de exemplo. Você pode acessá-lo com as seguintes credenciais:

      - **Email:** `Jose@exemplo.com`
      - **Senha:** `Senha123*`

### Método 2: Manualmente (Para Desenvolvimento)

Este método permite executar o frontend e o backend como processos separados, oferecendo mais flexibilidade durante o desenvolvimento.

**Requisitos:**

  - [Node.js](https://nodejs.org/en/) (com `pnpm`)
  - Uma instância de um banco de dados SQL (o projeto está configurado para **MySQL**).

**1. Backend (`vylex_task_control/api`)**

```bash
# Navegue até o diretório da API
cd vylex_task_control/api

# Crie seu arquivo de variáveis de ambiente a partir do exemplo
cp .env.example .env

# **Atenção:** Edite o arquivo .env e preencha a DATABASE_URL
# com a string de conexão do seu banco de dados MySQL.

# Instale as dependências
pnpm install

# Compile o código TypeScript
pnpm build

# Rode o seed (opcional)
./dist/prisma/seeds/seed.js

# Inicie o servidor
pnpm start
```

O backend estará em execução, geralmente em `http://localhost:3000`.

**2. Frontend (`vylex_task_control/web`)**

```bash
# Em um novo terminal, navegue até o diretório do frontend
cd vylex_task_control/web

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

O frontend estará acessível, geralmente em `http://localhost:5173`.
