# Go Barber

Sistema básico para agendamento de serviços em barbearias.

## Iniciando a aplicação

### Pré-requisitos

Para inciar o projeto será necessário:

- Docker
- Node
- React
- Yarn

### Passos

Antes de seguir os comandos abaixo, lembre-se de:

- Editar o arquivo `ormconfig.json` dentro da pasta `backend` inserindo seu IP nos campos `host` de ambos os bancos (Postgres e Mongo).
- Editar o arquivo `docker-compose.yml` dentro da pasta `backend`, e inserir seu caminho de preferência para os volumes dos serviços.

Dentro do diretório do projeto, execute os comando do passo a passo abaixo.

Subindo as bases de dados:

```sh
cd backend && docker-compose up -d
```

É necessário rodar as migrations para que o TypeORM crie as tabelas necessárias no banco de dados, através do comando:

```sh
yarn typeorm migration:run
```

Com os passos acima, você poderá acessar as rotas do API do projeto através de: http://localhost:3333/ping.

Em seguida, deve-se instalar as dependências da aplicação web:

```sh
cd ../frontend && yarn
```

Para iniciar o projeto Web:

```sh
yarn start
```