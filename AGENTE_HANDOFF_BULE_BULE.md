# Handoff para Outro Agente de IA

## Projeto

Nome: `Mandacarú: rima que resiste`

Objetivo:

- jogo casual mobile-first de linguagem, cordel e velocidade
- 1 trilha beta completa com 5 etapas
- leitura de estrofe + caca-palavras + rimas bonus + score + urgencia
- forte identidade brasileira, sertaneja e teatral
- direcao aberta para sertao, cordel, quadras e algumas rimas urbanas
- arquitetura pronta para crescer com novas trilhas e competicao online

## Estado atual

O prototipo esta funcional em React/Vite e compila com sucesso.

Ja existe:

- sessao completa de 5 etapas
- score acumulado
- timer por etapa
- combo com bonus
- dica por etapa
- transicao entre etapas
- tela final
- ranking local
- modo casual e modo desafio semanal
- card final exportavel em PNG
- tentativa de compartilhamento do PNG gerado
- fallback de compartilhamento para texto
- camada inicial de ranking online por endpoint opcional

Build validado:

- comando usado: `npm.cmd run build`
- status: aprovado

## Como rodar

Desenvolvimento:

```powershell
npm.cmd run dev
```

Build:

```powershell
npm.cmd run build
```

Preview local:

```powershell
npm.cmd run preview
```

Observacao importante:

- nao abrir `index.html` diretamente no navegador
- este projeto depende do pipeline do Vite

## Estrutura do projeto

### Conteudo editorial

- [content/index.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\index.json)
- [content/trails/trilha_feira_ao_anoitecer/trail.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\trails\trilha_feira_ao_anoitecer\trail.json)
- [content/trails/trilha_feira_ao_anoitecer/words.stage-01.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\trails\trilha_feira_ao_anoitecer\words.stage-01.json)
- [content/trails/trilha_feira_ao_anoitecer/words.stage-02.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\trails\trilha_feira_ao_anoitecer\words.stage-02.json)
- [content/trails/trilha_feira_ao_anoitecer/words.stage-03.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\trails\trilha_feira_ao_anoitecer\words.stage-03.json)
- [content/trails/trilha_feira_ao_anoitecer/words.stage-04.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\trails\trilha_feira_ao_anoitecer\words.stage-04.json)
- [content/trails/trilha_feira_ao_anoitecer/words.stage-05.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\trails\trilha_feira_ao_anoitecer\words.stage-05.json)

### Corpus poetico e identidade

- [peleja_bulebule_barreto_estruturada.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\peleja_bulebule_barreto_estruturada.json)
- [banco_de_rimas_bulebule_barreto.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\banco_de_rimas_bulebule_barreto.json)
- [content/corpus/peleja.metadata.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\corpus\peleja.metadata.json)
- [content/corpus/verse-training.ab-bb.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\corpus\verse-training.ab-bb.json)

### App

- [src/app/App.tsx](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\app\App.tsx)
- [src/styles/global.css](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\styles\global.css)

### Componentes

- [src/components/StageHUD.tsx](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\components\StageHUD.tsx)
- [src/components/CordelPanel.tsx](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\components\CordelPanel.tsx)
- [src/components/WordGrid.tsx](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\components\WordGrid.tsx)
- [src/components/StageSidebar.tsx](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\components\StageSidebar.tsx)
- [src/components/SessionInterlude.tsx](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\components\SessionInterlude.tsx)
- [src/components/FinalResults.tsx](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\components\FinalResults.tsx)
- [src/components/ShareCardPreview.tsx](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\components\ShareCardPreview.tsx)

### Servicos e logica

- [src/services/loaders.ts](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\services\loaders.ts)
- [src/services/poetics.ts](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\services\poetics.ts)
- [src/services/ranking.ts](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\services\ranking.ts)
- [src/services/challenge.ts](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\services\challenge.ts)
- [src/services/share-card.ts](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\services\share-card.ts)
- [src/services/fx.ts](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\services\fx.ts)
- [src/game/selection.ts](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\game\selection.ts)
- [src/game/scoring.ts](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\game\scoring.ts)

## Lógica de jogo atual

### Loop da etapa

1. entra em modo foco com estrofe
2. estrofe recolhe automaticamente para modo compacto
3. jogador seleciona palavras no grid
4. palavras validas pontuam por categoria
5. erros quebram combo e animam o grid
6. dica revela a primeira letra de uma palavra nao encontrada
7. ao fechar palavras obrigatorias da etapa, ganha bonus de tempo
8. entra em transicao ou resultado final

### Seleção

Suportado:

- toque na primeira letra + toque na ultima
- arraste horizontal
- arraste vertical
- arraste diagonal

Nao suportado:

- palavras em L
- palavras com curva

### Pontuacao

- comum: 10
- rara: 20
- rima: 30
- bonus de tempo: conforme `trail.json`
- combo: bonus fixo a partir do threshold do manifesto

### Combo

Ja existe:

- janela temporal de combo
- bonus de score
- mensagem narrativa
- overlay visual
- realce no HUD
- audio sintetizado via Web Audio

## Ranking

### Local

Funciona hoje:

- top 10 por trilha
- separado por modo
- no desafio, separado tambem por seed semanal

### Online

Ja ha estrutura pronta, mas depende de backend configurado.

Variavel esperada:

```env
VITE_RANKING_API_URL=https://seu-endpoint
```

Contrato esperado:

- `GET /leaderboard?trailId=...&mode=...&seed=...`
- `POST /leaderboard`

Formato de entrada:

```json
{
  "trailId": "trilha_feira_ao_anoitecer",
  "mode": "challenge",
      "seed": "MR-2026-W11",
  "entry": {
    "id": "123",
    "name": "Carlos",
    "score": 1280,
    "medal": "Rima de Ouro",
    "stagesCompleted": 5,
    "totalStages": 5,
    "createdAt": "2026-03-16T12:00:00.000Z",
    "mode": "challenge",
    "seed": "MR-2026-W11"
  }
}
```

Formato de resposta esperado:

```json
{
  "entries": []
}
```

Se o endpoint nao existir:

- app faz fallback automatico para ranking local

## Compartilhamento

Ja existe:

- exportacao PNG do card final
- tentativa de compartilhamento com arquivo em dispositivos que aceitam `navigator.share` com `files`
- fallback para texto copiado

Dependencia usada:

- `html-to-image`

## Direção visual

Referencias atuais:

- cordel
- xilogravura
- palco popular
- vermelho de cortina
- azul de igreja/azulejo/cenario
- papel de folheto
- chapéu do sertao como signo central
- clima de Auto da Compadecida sem imitação literal

Onde isso esta concentrado:

- [src/styles/global.css](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\src\styles\global.css)

## Corpus poetico

Uso atual:

- identidade de mundo
- nomes e topoi
- base para futuras mecânicas de IA e sugestao de versos

Dados disponiveis:

- estrofes separadas
- locutor AB, BB, NARRADOR
- secao
- metrica estimada
- esquema estimado de rima
- palavras finais
- clusters de rima
- metadados culturais
- treino AB/BB

## O que falta

### Gameplay

- balanceamento fino de dificuldade por etapa
- multiplicadores por etapa mais explicitamente mostrados
- onboarding mais didatico
- tela de escolha de trilha real
- tela de inicio real antes da sessao

### Conteudo

- segunda trilha
- mais bancos tematicos
- rimas mais filologicamente revistas
- seed afetando grade de forma real, nao apenas escopo do ranking

### Competicao

- backend real
- antifraude
- validacao de score por seed
- weekly board global

### UX

- exportar card tambem em formato story 9:16
- compartilhar PNG + texto no maior numero de devices possivel
- audio mais refinado com assets reais

## Riscos atuais

- as grades das etapas estao definidas manualmente e ainda podem precisar revisao ludica
- o ranking online e apenas um contrato; sem endpoint, o app fica em fallback local
- o desafio semanal ainda nao altera a geometria da rodada, apenas o escopo competitivo
- o audio de combo e sintetizado; serve para prototipo, nao para release final

## Prioridade recomendada para o proximo agente

1. Fazer o `modo desafio` usar seed para variar ou embaralhar layout/ordem de conteudo.
2. Implementar backend minimo de leaderboard e conectar `VITE_RANKING_API_URL`.
3. Refinar onboarding e UX da primeira partida.
4. Criar segunda trilha para validar escalabilidade editorial.

## Regras para mexer neste projeto

- nao abrir `index.html` diretamente
- rodar sempre via Vite
- preservar JSON orientado a conteudo
- evitar acoplar historia diretamente ao motor
- manter o chapéu do sertao como signo central da UI
- preservar o corpus da peleja como base identitaria do projeto

## Resumo executivo

Este projeto ja e um prototipo jogavel de beta, nao apenas uma maquete. A arquitetura editorial esta montada, a trilha beta existe, o fluxo completo funciona, o ranking local ja valida competicao inicial e a camada poetica esta preparada para expansao com IA e com novos conteudos. O proximo agente deve tratar o projeto como um jogo em fase de refinamento e expansao, nao como ideia em branco.
