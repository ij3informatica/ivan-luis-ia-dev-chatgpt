# Escola SENAI Almirante Tamandaré

# Documento de correções e melhorias — Service Desk Acadêmico

**Objetivo:** Registrar os problemas identificados no Service Desk Acadêmico, as melhorias solicitadas e as respectivas soluções implementadas.

## Identificação dos problemas e melhorias

| ID | Tipo | Problema | Área / arquivos | Solução aplicada |
|---|---|---|---|---|
| BUGFIX-001 | Correção | O analista não conseguia ajustar uma categoria inicialmente informada incorretamente; alterações do painel não eram salvas. | Painel do analista — `service-desk/app.js` | Permite alterar a categoria, registra a mudança no histórico e persiste as atualizações no armazenamento local. |
| BUGFIX-002 | Correção | O status ficava visualmente distante do título do chamado. | Painel do analista — `service-desk/app.js`, `service-desk/styles.css` | Reorganiza o título e o status lado a lado, com espaçamento compacto e adaptação a telas estreitas. |
| FEATURE-001 | Melhoria | Ao relatar um problema, o usuário não recebia uma possível orientação para resolvê-lo. | Abertura de chamado — `service-desk/index.html`, `service-desk/app.js`, `service-desk/styles.css` | Apresenta sugestões da base de conhecimento conforme o título e a descrição, encaminhando à TI quando necessário. |
| FEATURE-002 | Melhoria | Chamados resolvidos permaneciam na fila, sem filtro por status. | Fila do analista — `service-desk/index.html`, `service-desk/app.js`, `service-desk/styles.css` | Oculta resolvidos por padrão e oferece filtro para chamados ativos, todos os status ou um status específico. |
| FEATURE-003 | Melhoria | O histórico não tinha pesquisa nem filtro por categoria. | Histórico — `service-desk/index.html`, `service-desk/app.js`, `service-desk/styles.css` | Pesquisa os chamados por texto e restringe os resultados pela categoria escolhida. |

## Registro detalhado

### BUGFIX-001 — Correção e persistência da categoria

**Descrição:** A categoria indicada pelo solicitante pode não corresponder ao diagnóstico do analista. Por exemplo, um mouse com defeito pode ter sido aberto como Software.

**Comportamento Obtido:** Não havia opção de alterar a categoria nos detalhes do chamado. Além disso, as alterações feitas pelo analista não eram gravadas no armazenamento local.

**Comportamento Esperado:** O analista pode classificar corretamente o chamado após investigá-lo, e a categoria e as demais atualizações permanecem após recarregar a página.

**Área afetada:** Detalhes, atualização e histórico de eventos do chamado no painel do analista.

**Solução do problema:** Adicionado seletor de categoria com Hardware, Software, Rede, Acesso e Outro. Alterações de categoria são registradas nos eventos, e a rotina de atualização salva os dados no `localStorage`.

**Detalhamento da versão corrigida:** Identificador `BUGFIX-001`; commits `08ba675` e `9d9bbd4` na branch `Pre-prod`.

### BUGFIX-002 — Alinhamento do status com o título

**Descrição:** O status do chamado aparecia excessivamente afastado do título no painel do analista.

**Comportamento Obtido:** O cabeçalho distribuía o título e o status em extremidades opostas.

**Comportamento Esperado:** O status permanece próximo ao título, com espaçamento proporcional e boa adaptação a telas estreitas.

**Área afetada:** Cabeçalho dos detalhes do chamado no painel do analista.

**Solução do problema:** Reorganizados o título e o status em uma linha flexível, com espaçamento curto e quebra de linha quando necessário.

**Detalhamento da versão corrigida:** Identificador `BUGFIX-002`; commit `25cc44d` na branch `Pre-prod`.

### FEATURE-001 — Recomendações da base de conhecimento

**Descrição:** O usuário não recebia uma orientação inicial ao registrar um problema.

**Comportamento Obtido:** O formulário apenas registrava a descrição, sem apresentar soluções possíveis.

**Comportamento Esperado:** Ao digitar o título ou a descrição, o sistema apresenta recomendações relacionadas à base de conhecimento. Quando não encontra correspondência, orienta o usuário a contatar a equipe de TI.

**Área afetada:** Formulário de abertura de chamados.

**Solução do problema:** Adicionadas sugestões por palavras-chave para Wi-Fi de visitantes, impressão, telefone IP, internet, VPN, áudio de reunião e teclado ou mouse. As instruções são recomendações seguras e não substituem o atendimento da TI.

**Detalhamento da versão corrigida:** Identificador `FEATURE-001`; commit `3665181` na branch `Pre-prod`. O arquivo `service-desk/base-exemplo.txt` foi mantido intacto.

### FEATURE-002 — Filtro de status da fila

**Descrição:** Chamados resolvidos continuavam na fila de atendimento, misturados aos chamados pendentes.

**Comportamento Obtido:** A fila apresentava todos os chamados sem permitir filtrar pelo status.

**Comportamento Esperado:** A fila mostra chamados não resolvidos por padrão e permite consultar todos os registros ou um status específico.

**Área afetada:** Fila do painel do analista.

**Solução do problema:** Adicionado filtro com as opções Não resolvidos, Todos os status, Aberto, Em atendimento, Aguardando usuário e Resolvido. A lista e a contagem acompanham o filtro.

**Detalhamento da versão corrigida:** Identificador `FEATURE-002`; commit `a09bfd9` na branch `Pre-prod`.

### FEATURE-003 — Pesquisa e categoria no histórico

**Descrição:** Localizar um chamado no histórico era difícil, especialmente quando se precisava consultar uma categoria específica.

**Comportamento Obtido:** O histórico sempre apresentava todos os registros, sem pesquisa ou filtro de categoria.

**Comportamento Esperado:** O usuário pode pesquisar os chamados e restringir os resultados a uma categoria; quando nenhum registro corresponder, o sistema informa isso claramente.

**Área afetada:** Tela Histórico.

**Solução do problema:** Adicionada pesquisa por ID, título, solicitante, e-mail, status, prioridade e categoria, além de filtro por Hardware, Software, Rede, Acesso ou Outro. A pesquisa ignora diferenças de acentuação e caixa.

**Detalhamento da versão corrigida:** Identificador `FEATURE-003`; commit `318a7e4` na branch `Pre-prod`.

## Resumo final

Foram concluídos dois bugfixes e três melhorias. As alterações foram separadas por identificador e registradas em commits individuais na branch `Pre-prod`. A interface agora permite classificar e acompanhar chamados com mais clareza, oferece recomendações iniciais e facilita a consulta da fila e do histórico.

## Verificação

- Sintaxe JavaScript verificada com `node --check service-desk/app.js`.
- Alterações verificadas com `git diff --check`.
- Fluxos de sugestões, correção e persistência de categoria, fila por status e filtros do histórico verificados no navegador.
