# Agenda Sacramental Web App V2

Web app mobile-first da Agenda Sacramental da Ala Jardim Celeste.

## Estrutura

- `index.html` — tela inicial, seleção de reunião e Agenda Completa
- `app.js` — integração com a API e renderização da agenda
- `styles.css` — layout mobile-first
- `conduzir/index.html` — Modo Conduzir

## Fonte de dados

O app usa uma única API Apps Script:

`https://script.google.com/macros/s/AKfycbyeZQCURSyjEe8cDKJinv3SarRgOS1sNjvKrVu4nMixh8gneS2wDgvpiDJG5dAUbVz7YA/exec`

### Endpoints usados

- `?acao=datas` — lista de datas de reuniões
- `?data=AAAA-MM-DD` — carrega uma reunião específica

## Navegação

A tela inicial destaca a próxima reunião e oferece um único dropdown com os próximos domingos e domingos anteriores.

Ao abrir uma reunião, a Agenda Completa mostra os cards lineares. O botão **Modo Conduzir** abre:

`conduzir/index.html?data=AAAA-MM-DD`

O Modo Conduzir usa a mesma API e o mesmo parâmetro de data.
