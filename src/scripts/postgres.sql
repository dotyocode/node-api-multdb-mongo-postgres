-- Se a tabela existir ele vai remover com esse comando
DROP TABLE IF EXISTS TB_HEROIS;
-- criar tabela
CREATE TABLE TB_HEROIS (
    ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    NOME TEXT NOT NULL,
    PODER TEXT NOT NULL,
    TIPO TEXT NOT NULL
)

-- inserir um item na tabela
INSERT INTO TB_HEROIS (
    NOME, PODER
)
VALUES ('Agumon', 'Bola de Fogo', 'Reptil'), ('Garuromon', 'Nevasca', 'Lobo'), ('Angelmon', 'Eletric ball', 'Humanoide');

-- listar os itens
SELECT * FROM TB_HEROIS
-- listar pelo nome
SELECT * FROM TB_HEROIS WHERE NOME = 'Agumon'

-- atualizando os itens
UPDATE TB_HEROIS
SET NOME = 'Tentomon', PODER = 'Terra Eletrica', TIPO = 'Inseto'
WHERE ID = 4

-- deletando item
DELETE FROM TB_HEROIS WHERE ID = 4