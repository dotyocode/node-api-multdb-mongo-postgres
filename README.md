## ------------------POSTGRES-------------------------- ##

## --RODANDO COM POSTGRES
docker run --name postgres -e POSTGRES_USER=usuario -e POSTGRES_PASSWORD=suasenha -e POSTGRES_DB=nomeDb -p 5432:5432 -d postgres 

## -- visualizando algo que está rodando
docker ps

## -- executando o postgress e entrando no bin/bash
docker exec -it postgres /bin/bash

## -- painel adm
docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer

## ------------------MONGO DB-------------------------- ##

## --RODANDO COM MONGODB
docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=userAdmin -e MONGO_INITDB_ROOT_PASSWORD=senhaAdmin -d mongo:4

## --RODANDO COM MONGOCLIENT
docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient

## --CRIANDO USUARIO MONGODB
docker exec -it mongodb mongo --host localhost -u userAdmin -p senhaAdmin --authenticationDatabase admin --eval "db.getSiblingDB('herois').createUser({user: usuarioTeste, pwd: 'senhaTeste', roles: [{role: 'readWrite', db: 'herois'}]})"

## -- PARA CONECTAR NO BANCO DE DADOS DO MONGO
1 - Pega e roda docker ps e pega o ID HASH do mongo:4
2 - rode o comando docker exec -it ID_HASH_DO_MONGO mongo -u _USUARIO_ -p _SENHA_SECRETA_ --authenticationDatabase herois

## -- Comandos mongo
1 - show dbs [mostra todos os bancos que podem ser usados]
2 - use nomeDoBanco [seleciona o banco que quer usar]
3 - show collections [para visualizar as tabelas(coleções) disponiveis do banco]
4 - db.herois.insert({nome: 'Agumon', poder: 'Bola de fogo', tipo: 'Reptil', dataNascimento: '1995-18-01'}) [comando para inserir itens na tabela]
5 - db.herois.find().pretty() [lista todos os itens disponiveis na database, o pretty tras o resultado formatado]

