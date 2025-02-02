Sumário
=======

<!--ts-->
   * [Introdução](#Introdução)
   * [Pré-requisitos](#Pré-requisitos)
   * [Build](#Build)
   * [Instalação e execução](#Instalação_e_execução)
   * [Requisição](#Requisição)
   * [Testes](#Testes)
   * [Documentação](#Documentação)
<!--te-->

Introdução
==========

Services Billing - Aplicação responsável por processar boletos e enviar e-mails aos para os titulares.

Pré-requisitos
==============

- NodeJS 22+
- Redis
- Docker
- docker-compose

Build
=====

Este serviço foi criado com a utilização das seguintes ferramentas:

- NestJS 11
- Typescript
- Jest
- Throttler (Rate limiting)
- Redis
- Docker
- docker-compose
- Arquitetura Hexagonal

Instalação e execução
==========

Para instalar as dependências e executar a aplicação, execute o seguinte comando:

```
docker-compose up -d

```

Requisição
========

Segue abaixo payload para teste via Postman ou Insomnia por exemplo:

`POST http://localhost:3333/api/process/charges/customer/bccca61e-0b00-492c-bf01-182c0bbe2e1c`

```
{
	"file": <CSV File>
}
```

Testes
======

Para esta aplicação foram criados testes unitários, de integração e um teste e2e. Para executar os testes execute o seguinte comando:


```
yarn test

ou

npm run test
```

Documentação
======

A documentação foi elaborada utilizando Swagger e está disponível no endereço abaixo:

`POST http://localhost:3333/api/docs`
