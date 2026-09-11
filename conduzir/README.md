# Modo Conduzir V3 — conectado à API

Protótipo mobile do Modo Conduzir conectado ao endpoint real do Apps Script.

## API

O app usa o endpoint da Agenda Sacramental e aceita uma data pela URL:

`?data=AAAA-MM-DD`

Exemplo:

`index.html?data=2026-08-30`

Sem parâmetro, a API é chamada sem data e usa o comportamento padrão dela.

## Estrutura

O app transforma o JSON da API nos quatro blocos físicos da reunião:

1. Boas-vindas
2. Apoios e Sacramento
3. Primeiro e segundo oradores
4. Encerramento

## Observação

O frontend não reproduz fórmulas da planilha. Ele consome somente o JSON já resolvido pela API.
