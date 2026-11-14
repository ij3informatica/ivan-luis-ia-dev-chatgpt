# Alterações do Service Desk Acadêmico

## Escopo e versionamento

Foram implementados cinco itens (dois bugfixes e três melhorias) na branch `staging`, com identificadores estáveis. Cada item tem commit próprio; a persistência de alterações de analista foi incluída no `BUGFIX-001`, pois é necessária para salvar a correção de categoria.

| Identificador | Tipo | Commit(s) | Área |
|---|---|---|---|
| BUGFIX-001 | bugfix | `08ba675`, `9d9bbd4` | Painel do analista / persistência |
| BUGFIX-002 | bugfix | `25cc44d` | Painel do analista / layout |
| FEATURE-001 | feature | `3665181` | Abertura de chamados / base de conhecimento |
| FEATURE-002 | feature | `a09bfd9` | Painel do analista / fila |
| FEATURE-003 | feature | `318a7e4` | Histórico |

## BUGFIX-001 — Correção da categoria do chamado

**Descrição:** A categoria informada pelo solicitante pode não refletir o diagnóstico do analista. Um periférico com defeito, por exemplo, pode ter sido classificado inicialmente como Software.

**Comportamento Obtido:** O analista não conseguia alterar a categoria no painel. As alterações realizadas no painel também não eram persistidas no armazenamento local.

**Comportamento Esperado:** O analista deve poder corrigir a categoria após investigar o chamado. A categoria corrigida e as demais atualizações devem continuar disponíveis após recarregar a página.

**Área afetada:** Detalhes do chamado, atualização e histórico de eventos do painel do analista.

**Solução do problema:** Adicionado seletor de categoria com Hardware, Software, Rede, Acesso e Outro; mudanças de categoria são registradas nos eventos. A rotina de atualização agora salva o chamado no `localStorage`.

**Detalhamento da versão corrigida:** `BUGFIX-001`, commits `08ba675` e `9d9bbd4`.

## BUGFIX-002 — Espaçamento entre título e status

**Descrição:** O status do chamado aparecia afastado do título no painel do analista.

**Comportamento Obtido:** O cabeçalho distribuía título e status nas extremidades, deixando um espaço horizontal maior que o necessário.

**Comportamento Esperado:** O status deve ficar visualmente próximo ao título, mantendo o alinhamento e adaptando-se a telas estreitas.

**Área afetada:** Cabeçalho dos detalhes do chamado no painel do analista.

**Solução do problema:** Reorganizado o título e o status em uma linha flexível com espaçamento curto e quebra de linha quando necessário.

**Detalhamento da versão corrigida:** `BUGFIX-002`, commit `25cc44d`.

## FEATURE-001 — Sugestões da base de conhecimento

**Descrição:** O usuário não recebia orientação inicial ao relatar um problema.

**Comportamento Obtido:** A abertura do chamado apenas registrava a descrição; nenhuma solução possível era apresentada.

**Comportamento Esperado:** Ao digitar o título ou a descrição, o sistema sugere orientação relacionada aos artigos da base de exemplo. Quando não há correspondência, informa que não encontrou orientação específica e recomenda procurar a equipe de TI.

**Área afetada:** Formulário de abertura de chamados.

**Solução do problema:** Incluídas sugestões por palavras-chave para Wi-Fi de visitantes, impressão, telefone IP, internet, VPN, áudio de reunião e teclado/mouse. As instruções são exibidas como recomendações, sem substituir o atendimento da TI. A base original `service-desk/base-exemplo.txt` foi preservada sem alterações.

**Detalhamento da versão corrigida:** `FEATURE-001`, commit `3665181`.

## FEATURE-002 — Filtro da fila por status

**Descrição:** Chamados resolvidos permaneciam na fila de atendimento sem opção de filtrar os demais estados.

**Comportamento Obtido:** A fila exibia todos os chamados juntos, inclusive os resolvidos.

**Comportamento Esperado:** Por padrão, mostrar apenas chamados não resolvidos; permitir selecionar todos os status ou um status específico. Um chamado marcado como Resolvido deve sair da fila padrão.

**Área afetada:** Fila no painel do analista.

**Solução do problema:** Adicionado filtro de status com as opções Não resolvidos (padrão), Todos os status, Aberto, Em atendimento, Aguardando usuário e Resolvido. A fila e a contagem respeitam a seleção.

**Detalhamento da versão corrigida:** `FEATURE-002`, commit `a09bfd9`.

## FEATURE-003 — Pesquisa e categoria no histórico

**Descrição:** Era difícil localizar chamados no histórico e restringir os resultados a uma categoria.

**Comportamento Obtido:** O histórico sempre exibia todos os chamados e não tinha controles de pesquisa ou filtro por categoria.

**Comportamento Esperado:** Permitir pesquisar registros e escolher uma categoria; informar quando nenhum chamado corresponder aos filtros.

**Área afetada:** Tela Histórico.

**Solução do problema:** Adicionados pesquisa por ID, título, solicitante, e-mail, status, prioridade e categoria, além de filtro por Hardware, Software, Rede, Acesso ou Outro. A pesquisa ignora diferenças entre maiúsculas e minúsculas e acentos.

**Detalhamento da versão corrigida:** `FEATURE-003`, commit `318a7e4`.

## Verificação

- Sintaxe JavaScript verificada com `node --check service-desk/app.js`.
- Espaços e marcadores de conflito verificados com `git diff --check`.
- Fluxos de interface e persistência verificados no navegador antes da entrega.
