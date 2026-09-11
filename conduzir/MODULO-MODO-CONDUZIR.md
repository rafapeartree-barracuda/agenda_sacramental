# Módulo: Modo Conduzir

**Versão:** 0.2  
**Status:** Especificação funcional inicial

## 1. Objetivo

O Modo Conduzir é uma visualização operacional da Agenda Sacramental destinada à pessoa que dirige a reunião.

A finalidade não é reproduzir toda a agenda. É apresentar, em sequência clara e com leitura rápida, aquilo que o dirigente precisa saber ou executar naquele momento.

## 2. Princípio central

A reunião é conduzida em quatro blocos físicos. Cada bloco concentra atividades que podem ser realizadas sem que o dirigente precise retornar à frente da capela várias vezes.

O aplicativo deve refletir essa organização física.

## 3. Estrutura

### Bloco 1 — Boas-vindas

- Presidência e direção
- Reconhecimentos
- Visitantes / autoridades
- Recepção e música
- Anúncios
- Hino inicial
- Oração inicial

### Bloco 2 — Apoios e Sacramento

- Apoios / chamados / ordenanças
- Hino sacramental

### Bloco 3 — Primeiro e segundo oradores

- Primeiro orador
- Segundo orador
- Hino intermediário

### Bloco 4 — Encerramento

- Último orador
- Hino de encerramento
- Oração de encerramento
- Recados finais

## 4. Navegação

O usuário visualiza um item por vez.

Ações principais:

- **Anterior:** retorna ao item anterior.
- **Próximo:** avança para o próximo item.
- **Concluir bloco:** aparece ao terminar o último item de cada bloco intermediário.
- **Concluir reunião:** aparece ao terminar o último item do quarto bloco.
- **Seletor de blocos:** permite retornar diretamente ao início de qualquer bloco.

Atalhos de teclado do protótipo:

- `→` ou `Espaço`: próximo
- `←`: anterior

## 5. Estados

Cada bloco pode estar:

- não iniciado;
- em andamento;
- concluído.

Um item também pode indicar informação ausente.

Informação ausente deve ser explicitamente sinalizada. O sistema não deve inventar conteúdo para preencher campos vazios.

## 6. Hierarquia visual

A tela deve priorizar:

1. ação ou informação atual;
2. nome da pessoa, quando aplicável;
3. tema ou instrução;
4. informação auxiliar.

Requisitos:

- mobile-first;
- texto grande;
- alto contraste;
- poucos elementos por tela;
- botões grandes;
- leitura sem necessidade de zoom;
- pequenos ícones apenas quando ajudarem a compreensão.

## 7. Relação com a Agenda completa

O Modo Conduzir não substitui a Agenda completa.

A Agenda completa continua sendo a visão de consulta e preparação. O Modo Conduzir é uma visão operacional para o momento da reunião.

As duas visões devem consumir a mesma fonte de dados.

## 8. Dados

O Modo Conduzir deve receber dados já consolidados.

A interface não deve reproduzir fórmulas, VLOOKUPs ou regras internas da planilha.

Campos vazios ou erros provenientes da fonte devem ser normalizados antes de chegar à interface.

## 9. Caso de informação não definida

Quando um item necessário ainda não estiver definido, a interface deve informar claramente a situação.

Exemplo:

> Hino ainda não designado.

Não utilizar apenas `-`, `#N/A` ou outro valor técnico.

## 10. Critério de aceite

O Modo Conduzir será considerado funcional quando uma pessoa puder:

1. abrir a reunião;
2. identificar claramente em qual dos quatro blocos está;
3. saber qual é o item atual;
4. avançar sem consultar a planilha original;
5. voltar quando necessário;
6. identificar informações ausentes;
7. concluir os quatro blocos sem perder a sequência.

## 11. Próxima evolução

Após a validação da experiência, o próximo passo é substituir o `data.json` estático por dados vindos da fonte consolidada da Agenda Sacramental, mantendo a interface desacoplada da estrutura da planilha.
