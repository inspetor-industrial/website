## Installation

Antes de qualquer comando, precisamos verificar se temos os seguintes requisitos: 
- [ ] [NodeJS](https://nodejs.org/en)
- [ ] [Docker](https://www.docker.com/)
- [ ] [VSCode](https://code.visualstudio.com/)
	- [ ] Opcional - [VSCode Insider](https://code.visualstudio.com/insiders/)

Depois das ferramentas instaladas, vamos instalar as dependências do projeto:

#### `With npm`

Esse gerenciador de pacotes já vem por padrão no `NodeJS`.

```shell
> npm install
```

#### `With yarn`

Esse gerenciador de pacotes não vem instalado por padrão junto ao `NodeJS`, porém podemos utilizar ele seguindo o seguinte [tutorial de instalação](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) e executar o comando abaixo.

```shell
> yarn
```

#### `With pnpm`

Esse gerenciador de pacotes não vem instalado por padrão junto ao `NodeJS`, porém podemos utilizar ele seguindo o seguinte [tutorial de instalação](https://pnpm.io/installation) e executar o comando abaixo.

```shell
> pnpm install
```


Depois da instalação das dependências, precisamos rodar o banco de dados local, para isso abra o terminal e rode o seguinte comando para criação do banco.

```shell
> docker-compose up -d
```

Após a criação do container execute o seguinte comando para aplicar as migrações no banco:

```shell
# with npm
> npx prisma migrate dev

# with yarn
> yarn prisma migrate dev

# with pnpm
> pnpm prisma migrate dev
```

## Criação do usuário para acesso ao sistema

Para poder acessar o sistema precisamos executar um comando que irá finalizar a preparação do nosso ambiente de desenvolvimento, para tal execute o seguinte comando: 

```shell
# with npm
> npx prisma db seed

# with yarn
> yarn prisma db seed

# with pnpm
> pnpm prisma db seed
```

Depois disso feito o ambiente está configurado e pronto para poder ser executado 🚀🚀🚀


## Rodando o Projeto

Para poder rodar o projeto é bem simples, basta executar o comando:

```shell
# with npm
> npm run dev

# with yarn
> yarn dev

# with pnpm
> pnpm dev
```

Depois disso acesso o [`http://localhost:3000`](http://localhost:3000).

O projeto está utilizando a nova versão do [NextJS](https://nextjs.org/), com o uso de server components, server actions, layouts, loading screens, entre outras funcionalidades... Segue o link para a documentação da versão nova: [NextJS](https://nextjs.org/docs/app)
