# Mandacarú: rima que resiste

## Versao de trabalho

v1.1, refinada para reduzir atrito no beta, melhorar a sensacao de jogo no celular e incluir compartilhamento por card de resultado.

## Premissas de viabilidade

- O workspace atual nao contem o app Cordel 2.0; so ha um documento conceitual inicial.
- Portanto, a proposta abaixo trata o jogo como um modulo independente, pronto para ser embutido via rota, WebView, iframe interno ou pacote frontend integrado ao ecossistema maior.
- A arquitetura foi pensada para um MVP leve, mobile-first, com conteudo orientado por JSON, ranking simples e expansao posterior sem reescrever a base.
- O risco principal nao esta na mecanica central; esta no equilibrio entre ritmo de jogo, leitura de cordel e clareza visual em telas pequenas. A proposta abaixo resolve isso com estrofes curtas, grids compactos, UI objetiva e pacote de trilha desacoplado.

## Entregavel 1 - Visao geral do produto

### Proposta de valor

Mandacarú: rima que resiste e um jogo de linguagem e velocidade que transforma leitura, rima e repertorio cultural brasileiro em disputa curta, intensa e rejogavel. Ele nao se apresenta como "atividade educativa", mas como aventura linguistica com identidade propria.

### Diferencial

- Usa cordel como motor de jogo, nao como ornamento.
- Mistura leitura, interpretacao social, busca visual, rima e progressao dramatica na mesma partida.
- Cada trilha funciona como episodio jogavel e expansivel.
- A identidade visual brasileira e central, mas com acabamento contemporaneo, sem caricatura.

### Publico-alvo principal

- Jovens e adultos de 12 a 35 anos.
- Estudantes, professores e mediadores culturais.
- Publico casual de mobile que gosta de desafios rapidos.
- Usuarios do ecossistema Cordel 2.0 interessados em experiencia interativa e compartilhavel.

### Por que pode ser viciante

- Partidas curtas de 5 minutos.
- Pressao do tempo com feedback imediato.
- Combo, bonus e ranking.
- Trilha narrativa com mini-cliffhangers entre etapas.
- Sensacao de dominio progressivo: ler melhor, achar mais rapido, rimar melhor.

### Potencial educacional e competitivo

- Educacional: leitura, vocabulario, inferencia, repertorio cultural, oralidade, rima e contexto social.
- Competitivo: score por etapa, ranking por trilha, ranking semanal, replay para melhorar desempenho.
- O valor cultural permanece porque o desempenho esta ligado a leitura e interpretacao, nao apenas reflexo.

## Entregavel 2 - Estrutura funcional do MVP

### Escopo beta ideal

- 1 trilha completa.
- 5 etapas.
- 1 modo casual.
- 1 loop jogavel fechado.
- 1 tela final com score, resumo de desempenho, medalha e CTA de replay.
- 1 card compartilhavel de resultado.
- Dica simples por etapa.
- Recorde local e estatisticas basicas locais.
- Persistencia local de progresso e recorde.
- Arquitetura pronta para ranking online, mas sem depender disso na primeira publicacao.

### O que fica fora do beta 1.0

- ranking global completo
- login
- desafio semanal oficial
- antifraude avancado
- multiplos modos competitivos simultaneos

### Mapa de telas

1. Splash / abertura
2. Home
3. Escolha de trilha
4. Intro narrativa da trilha
5. Gameplay etapa 1
6. Transicao curta
7. Gameplay etapa 2
8. Transicao curta
9. Gameplay etapa 3
10. Transicao curta
11. Gameplay etapa 4
12. Transicao curta
13. Gameplay etapa 5
14. Resultado final
15. Card compartilhavel
16. Ranking local
17. Replay / voltar a trilhas

### Componentes principais

- `AppShell`: cabecalho, roteamento, camada de audio e estado global.
- `TrailCard`: card da trilha com capa, dificuldade e status.
- `NarrativeIntro`: estrofe, personagem, contexto e CTA de iniciar.
- `StageHUD`: cronometro, barra de progresso, score, combo e etapa atual.
- `CordelPanel`: bloco de leitura da estrofe.
- `WordGrid`: grade do caca-palavras com selecao por arraste e toque inicial/final.
- `RhymeBadge`: exibe rimas bonus disponiveis ou ja encontradas.
- `StageFeedback`: acerto, raro, rima, erro, combo quebrado.
- `HintButton`: consome dica da etapa e destaca a inicial de uma palavra.
- `TransitionPanel`: resumo da etapa e avancar.
- `FinalResults`: score total, estatisticas, medalha, CTA de compartilhar.
- `ShareScoreCard`: card pronto para story, status e encaminhamento entre amigos.
- `LeaderboardPanel`: top 10 global, por trilha e semanal.
- `NameCaptureModal`: captura de apelido para ranking.

### Game loop ideal

1. Jogador abre o app e ve identidade forte da marca.
2. Seleciona a trilha disponivel.
3. Le uma introducao curta da personagem e do conflito.
4. Entra na etapa.
5. Le uma estrofe breve.
6. Procura palavras na grade.
7. Recebe feedback instantaneo por palavra.
8. Pode encontrar duas rimas bonus.
9. Finaliza etapa ou estoura o tempo.
10. Ve mini-progressao narrativa.
11. Repete ate a etapa 5.
12. Ve desfecho final, score, medalha e frase de desempenho.
13. Gera ou visualiza card compartilhavel.
14. Decide entre replay, ranking ou voltar.

### Microfluxo ideal da etapa

1. Entrada dramatica de 3 a 5 segundos.
2. Estrofe em modo foco.
3. Missao curta em uma linha.
4. Inicio da rodada com HUD visivel.
5. Jogador encontra palavras e rimas.
6. Feedback imediato por acerto, erro e combo.
7. Fechamento rapido com ganho narrativo.
8. Transicao para a proxima etapa.

### Regras de usabilidade para o MVP

- Estrofe com no maximo 4 versos curtos por etapa.
- Estrofe inicia em `modo foco` e recolhe para `modo compacto` com CTA `ver estrofe novamente`.
- Grade entre 6x6 e 8x8 no beta.
- Etapa 1 com 5 palavras alvo; etapa 2 e 3 com 6; etapa 4 e 5 com 7.
- Toda interacao principal precisa caber em uma mao no celular.
- Feedback visual em menos de 150 ms.
- O jogo deve aceitar dois modos de selecao: arraste continuo e toque no inicio + toque no fim.
- Cada etapa deve oferecer 1 dica opcional com custo de pontuacao.

## Entregavel 3 - Arquitetura de conteudo escalavel

### Principio

Cada trilha deve ser um pacote de conteudo independente. O motor do jogo nao conhece a historia em si; ele apenas carrega dados estruturados, renderiza e aplica regras.

### Modelo de pacote de trilha

Campos minimos:

- `id`
- `title`
- `subtitle`
- `description`
- `difficulty`
- `theme`
- `hero`
- `socialContext`
- `artDirection`
- `unlockRule`
- `scoringProfile`
- `stages[]`
- `finale`
- `shareTemplate`
- `shareCard`

Cada `stage` deve conter:

- `id`
- `order`
- `timeLimitSec`
- `narrativeStanza`
- `scenePrompt`
- `objectiveLabel`
- `grid`
- `gridSeed`
- `gridPlacements`
- `validWords`
- `rareWords`
- `bonusRhymes`
- `hint`
- `transitionMessage`
- `difficultyTags`
- `audioCue`

### JSON sugerido

```json
{
  "id": "trilha_feira_ao_anoitecer",
  "title": "Feira ao Anoitecer",
  "subtitle": "Uma corrida de palavras no coracao do sertao",
  "description": "Lia tenta salvar a memoria da feira antes que a chuva e o esquecimento levem tudo.",
  "difficulty": "normal",
  "theme": {
    "palette": "terra-noite",
    "symbol": "chapeu-sertao",
    "texture": "paper-woodcut"
  },
  "hero": {
    "name": "Lia de Zefa",
    "role": "entregadora de folhetos e cantadora iniciante",
    "avatar": "lia-zefa"
  },
  "socialContext": {
    "location": "feira popular do interior",
    "topics": ["seca", "memoria oral", "trabalho informal", "comunidade"]
  },
  "scoringProfile": {
    "common": 10,
    "rare": 20,
    "rhyme": 30,
    "timeBonusStepSec": 5,
    "timeBonusPoints": 5,
    "comboWindowSec": 6,
    "comboMultiplierCap": 2,
    "hintPenalty": 15
  },
  "stages": [
    {
      "id": "e1_chegada",
      "order": 1,
      "timeLimitSec": 75,
      "narrativeStanza": [
        "Lia chegou pela estrada,",
        "com poeira no gibao,",
        "traz no peito a voz da feira,",
        "feito reza e cantacao."
      ],
      "scenePrompt": "A feira desperta e as vozes se misturam.",
      "objectiveLabel": "Encontre palavras da feira",
      "grid": ["FEIRAA", "POEIRL", "VOZESA", "RIMAOC", "BANCAA", "SERTAO"],
      "gridSeed": "feira-e1-seed-a",
      "gridPlacements": [
        { "word": "feira", "start": [0, 0], "end": [0, 4], "direction": "E" }
      ],
      "validWords": ["feira", "voz", "banca", "poeira", "sertao"],
      "rareWords": ["cantacao"],
      "bonusRhymes": [
        { "word": "toada", "rhymesWith": "estrada", "tag": "curated" },
        { "word": "cancao", "rhymesWith": "cantacao", "tag": "curated" }
      ],
      "hint": {
        "uses": 1,
        "penalty": 15,
        "behavior": "highlight-first-letter"
      },
      "transitionMessage": "Lia percebe que a feira esta prestes a mudar.",
      "difficultyTags": ["tutorial", "rima-facil"]
    }
  ],
  "finale": {
    "title": "A voz nao se perdeu",
    "text": "Com as palavras reunidas, a feira volta a caber na memoria do povo."
  },
  "shareTemplate": "Fiz {score} pontos em {trailTitle}. Bora ver se tu aguenta esse cangaco de palavras?",
  "shareCard": {
    "headline": "A feira voltou a cantar",
    "cta": "Encaminhe e desafie outro jogador",
    "badgeStyle": "hat-seal"
  }
}
```

### Banco de palavras expansivel

Separar em duas camadas:

- Dicionario global por tema: feira, sertao, escola, rio, trabalho, festa, migracao.
- Overrides por trilha: palavras exclusivas, raras e rimas locais.

Estrutura sugerida:

- `content/dictionaries/themes/*.json`
- `content/trails/<trail-id>/trail.json`
- `content/trails/<trail-id>/words.stage-01.json`

### Cadastro futuro sem reescrita

Para adicionar nova trilha, basta:

1. Criar uma pasta da trilha.
2. Preencher `trail.json`.
3. Adicionar assets locais.
4. Registrar a trilha em `content/index.json`.

O motor do app le o indice e monta a vitrine dinamicamente.

### Validacao editorial dos JSONs

Criar um schema para impedir erro de conteudo antes de publicar:

- toda trilha precisa ter exatamente 5 etapas no beta
- toda etapa precisa ter `objectiveLabel`
- `bonusRhymes` precisa conter 2 entradas curadas
- toda palavra valida precisa existir na grade ou em `gridPlacements`
- `rareWords` precisa estar contida em `validWords`
- `hint.uses` precisa ser 0 ou 1 no beta
- `timeLimitSec` precisa respeitar o perfil de dificuldade da trilha

### Instrumentacao minima desde o beta

Registrar localmente e, quando houver backend, enviar:

- inicio e fim de partida
- etapa de abandono
- tempo restante por etapa
- numero de erros
- numero de dicas usadas
- quantas rimas bonus foram encontradas
- reinicios por trilha

## Entregavel 4 - Primeira trilha beta completa

### Nome da trilha

`Feira ao Anoitecer`

### Personagem principal

Lia de Zefa, 17 anos, filha de feirante, leitora de folhetos, rapida no olhar e insegura na propria voz. Ela nao quer apenas vender; quer preservar as palavras do lugar.

### Cenario social

Uma feira popular do interior nordestino atravessa um momento de mudanca: menos gente comprando, chuva incerta, jovens indo embora, oficios antigos sumindo. A trilha usa esse contexto para falar de memoria, trabalho e continuidade sem pesar excessivo.

### Tom narrativo

Aventura afetiva com urgencia crescente. O jogo deve parecer uma corrida para recolher palavras antes que o vento leve a historia.

### Estrutura dramatica das 5 microetapas

#### Etapa 1 - A chegada

- Funcao: tutorial elegante.
- Tipo cognitivo: reconhecimento rapido.
- Tempo: 75 segundos.
- Tema do grid: feira, banca, poeira, voz, balaio, sertao.
- Rimas bonus: `estrada`, `toada`.
- Estrofe:
  - Lia chegou pela estrada,
  - com poeira no gibao,
  - traz no peito a voz da feira,
  - feito reza e cantacao.
- Objeto simbolico: um folheto ainda em branco.
- Transicao: `Uma banca voltou a ter nome.`
- Progressao: ela percebe um clima estranho, como se a feira estivesse encolhendo.

#### Etapa 2 - O sumico das placas

- Funcao: introduzir palavras raras e maior densidade.
- Tipo cognitivo: leitura + associacao.
- Tempo: 60 segundos.
- Tema do grid: letreiro, tinta, banca, cordel, folheto, pregao, madeira.
- Rimas bonus: `folheto`, `secreto`.
- Estrofe:
  - Sumiu nome de barraca,
  - sumiu verso do cartaz,
  - sem palavra a feira antiga
  - vai calando pouco a mais.
- Transicao: `O cartaz reapareceu na parede de madeira.`
- Progressao: Lia entende que precisa recolher sinais da feira para recompor sua memoria.

#### Etapa 3 - O vento do esquecimento

- Funcao: subir urgencia e dificuldade visual.
- Tipo cognitivo: distracao visual maior.
- Tempo: 60 segundos.
- Tema do grid: vento, pano, poeira, semente, panela, retrato, memoria.
- Rimas bonus: `vento`, `ento`.
- Estrofe:
  - Veio um vento pelas lonas,
  - sacudindo o corredor,
  - cada nome que se perde
  - leva junto um contador.
- Antagonista simbolico: `vento do esquecimento`.
- Transicao: `O povo comecou a lembrar de quem vendia cada coisa.`
- Progressao: a perda deixa de ser abstrata; se ela falhar, personagens e oficios se apagam.

#### Etapa 4 - O chamado do povo

- Funcao: etapa mais intensa, com combo mais importante.
- Tipo cognitivo: ritmo e combo.
- Tempo: 55 segundos.
- Tema do grid: rendeira, sanfona, martelo, repente, garapa, xirique, chapeu.
- Rimas bonus: `repente`, `valente`.
- Estrofe:
  - Cada banca chama alto,
  - cada oficio quer ficar,
  - quem segura a voz do povo
  - faz a noite clarear.
- Transicao: `A noite ganhou voz e a feira deixou de se calar.`
- Progressao: a comunidade entra simbolicamente em cena; nao e mais so a jornada de Lia.

#### Etapa 5 - A cantoria que fica

- Funcao: fechamento heroico, recompensa alta.
- Tipo cognitivo: fechamento poetico com recompensa.
- Tempo: 50 segundos.
- Tema do grid: memoria, cantoria, futuro, feira, livrinho, chama, raiz.
- Rimas bonus: `raiz`, `feliz`.
- Estrofe:
  - Lia junta os nomes soltos
  - num folheto de luar,
  - quando o povo le em voz alta
  - a feira torna a pulsar.
- Transicao: `O folheto encheu e a feira voltou a respirar.`
- Progressao: a memoria volta a circular porque virou palavra compartilhada.

### Desfecho final

A feira nao "volta ao passado"; ela se transforma com dignidade. O final mostra que cultura popular sobrevive quando circula, se joga, se le e se compartilha.

### Finais por desempenho

- desempenho baixo: `Lia guardou parte da memoria antes do vento passar.`
- desempenho medio: `A feira resistiu e seus nomes voltaram a circular.`
- desempenho alto: `A cantoria venceu o esquecimento e a noite virou memoria viva.`

### Por que essa trilha e boa para beta

- Tem apelo emocional claro.
- Permite palavras concretas e reconheciveis.
- Facilita direcao artistica marcante.
- Tem curva de dificuldade controlavel.
- Gera bom material para teste de compartilhamento e ranking.

## Entregavel 5 - Regras de pontuacao e competicao

### Pontuacao base

- Palavra comum: 10
- Palavra rara: 20
- Palavra-rima: 30
- Bonus de tempo: 5 pontos a cada 5 segundos restantes

### Refinamento recomendado

- Combo: a cada 3 acertos consecutivos em ate 6 segundos, +10 de bonus.
- Combo alto: a partir do sexto acerto consecutivo, multiplicador de 1.5 nas palavras comuns e raras.
- Combo narrativo: a cada marco de combo, disparar uma frase curta de progresso da historia.
- Multiplicador por etapa:
  - etapa 1: 1.0
  - etapa 2: 1.0
  - etapa 3: 1.1
  - etapa 4: 1.2
  - etapa 5: 1.3
- Conclusao perfeita da etapa: encontrar todas as palavras alvo, +50.
- Encontrar as duas rimas bonus da etapa: +40 extra.

Exemplos de combo narrativo:

- `Lia ganhou coragem.`
- `A feira reacende.`
- `O povo se aproxima.`
- `A cantoria se levanta.`

### Penalidade por erro

Faz sentido, mas leve:

- toque invalido: sem perda de ponto nas duas primeiras ocorrencias da etapa.
- a partir do terceiro erro: -5 por erro.
- erro tambem quebra combo.

Isso evita frustracao no onboarding e inibe tentativa aleatoria.

### Formula final sugerida

`scoreFinal = somaEtapas + bonusTempo + bonusCombo + bonusPerfeicao - penalidades`

### Modos futuros

- `Casual`: sem penalidade severa, ranking opcional.
- `Desafio`: seed fixa, mesmas grades para todos naquela semana, ranking oficial.

### Ranking

Camadas:

- ranking local por aparelho
- ranking por trilha
- ranking global
- ranking semanal
- top 10 por modo

### Antifraude basica

- Enviar para backend: score, tempo restante, palavras encontradas, seed da grade, versao do app, hash da partida.
- Rejeitar scores impossiveis por regra.
- Assinar a seed e o payload no servidor em modos competitivos.
- Limitar submissao repetida em janela curta.
- No beta inicial, deixar ranking online apenas para modo desafio.

### Nome do jogador e login futuro

- Beta: apelido local + opcao de publicar score.
- Fase seguinte: login simplificado por magic link, Google ou Apple.
- Manter suporte a visitante para nao elevar atrito.

### Medalhas de estilo

- `Poeta Veloz`: terminou com alta sobra de tempo.
- `Olho de Feirante`: alta precisao.
- `Rima de Ouro`: encontrou todas as rimas.
- `Sem Errar`: concluiu a trilha sem penalidade.

### Card compartilhavel de resultado

Objetivo:

- transformar o fim da partida em convite para encaminhamento em redes e conversas privadas
- reforcar score, trilha, medalha e identidade do jogo

Conteudo minimo do card:

- nome da trilha
- score final
- medalha de estilo principal
- frase final personalizada
- selo visual do chapeu do sertao
- CTA: `Tu encara esse cangaco de palavras?`
- marca `Mandacarú: rima que resiste`

Formato recomendado:

- proporcao 4:5 para feed
- variante 9:16 para story
- exportavel como imagem a partir de HTML/CSS

Layout sugerido:

- topo com emblema do chapeu e nome da trilha
- centro com score grande
- bloco curto com medalha e frase de desempenho
- rodape com convite para jogar

Texto-base sugerido:

`Fiz {score} pontos em {trailTitle}. Ganhei {medal}. Tu encara esse cangaco de palavras?`

## Entregavel 6 - Direcao visual e UX

### Direcao estetica

Mistura de xilogravura, papel impresso, poeira, madeira e sinalizacao popular com acabamento digital limpo. O jogo deve parecer um folheto vivo, nao um simulacro rustico.

### Simbolo central obrigatorio

O chapeu tipico do sertao deve ser o signo mestre da linguagem visual.

Usos recomendados:

- icone do app em silhueta forte
- coroa do logo
- moldura do cronometro
- medalhas e trofeus
- emblemas das trilhas
- marca d'agua nas telas de transicao
- avatar anonimo de ranking
- moldura principal do card compartilhavel

### Diretrizes visuais

- Paleta base: barro, areia, preto gravura, vermelho queimado, azul noite.
- Tipografia:
  - display expressiva inspirada em folheto ou letreiro popular
  - texto corrido altamente legivel sem excesso de ornamento
- Textura sutil de papel e tinta, nunca poluindo a leitura.
- Contraste alto e botoes grandes.
- Estrofes com respiro generoso.

### UX mobile-first

- Priorizar uso vertical.
- HUD sempre visivel no topo.
- Grade central com area de toque ampla.
- Estrofe recolhivel apos alguns segundos para liberar foco.
- Feedback sonoro opcional e breve.
- Testar o grid em dedos grandes e maos pequenas antes de qualquer refinamento estetico.

### Sensacao de urgencia

- Barra circular ou semicircular de tempo.
- Mudanca sutil de cor conforme o fim da etapa se aproxima.
- Vibracao curta e discreta em 10 segundos finais, se permitido.
- Particulas leves de poeira/vento em transicoes.

### Feedback

- Acerto comum: brilho curto.
- Palavra rara: carimbo especial.
- Rima: selo poetico com destaque e icone do chapeu iluminado.
- Erro: tremor leve e quebra de combo.

### Ajuda e acessibilidade

- 1 dica por etapa.
- Custo padrao de -15 pontos.
- A dica destaca a primeira letra de uma palavra nao encontrada.
- Permitir desativar vibracao e audio.
- Manter contraste AA no texto e nos elementos de HUD.

### Tela de vitoria

Deve parecer conquista de jornada, nao so recibo de pontos:

- titulo forte
- resumo da historia concluida
- score total
- posicao no ranking
- medalha/insignia com chapeu do sertao
- CTA de compartilhar resultado
- botao de gerar card
- convite curto para encaminhar a amigos

## Entregavel 7 - Arquitetura tecnica recomendada

### Escolha recomendada para MVP

Frontend:

- React + Vite
- CSS modular ou Tailwind com tokens de tema
- Zustand ou Context simples para estado leve

Justificativa:

- Facil publicacao em hosting estatico.
- Bom encaixe em app maior via rota ou WebView.
- Componentizacao clara para trilhas, HUD, ranking e telas.
- Evolui bem para PWA.

Se o ecossistema Cordel 2.0 ja for React, essa e a rota mais economica. Se nao houver base alguma, HTML/CSS/JS puro tambem funcionaria, mas perde ergonomia de expansao.

### Persistencia

Beta local:

- `localStorage` para progresso, configuracoes, recordes locais e metricas simples.

Ranking online:

- Supabase recomendado.

Justificativa:

- setup simples
- Postgres gerenciavel
- API e auth prontas
- tabela de scores facil de filtrar por trilha/semana

Alternativa ultra-minima:

- Firebase Firestore, se o time preferir ecossistema Google.

### Estrutura de pastas sugerida

```text
/src
  /app
    App.tsx
    routes.ts
    providers.tsx
  /components
    AppShell/
    TrailCard/
    StageHUD/
    CordelPanel/
    WordGrid/
    StageFeedback/
    ShareScoreCard/
    HintButton/
    LeaderboardPanel/
    NameCaptureModal/
  /features
    /home
    /trail-select
    /gameplay
    /results
    /leaderboard
  /game
    engine.ts
    scoring.ts
    timer.ts
    word-selection.ts
    rhyme.ts
    difficulty.ts
  /content
    index.json
    /trails
      /trilha_feira_ao_anoitecer
        trail.json
        words.stage-01.json
        words.stage-02.json
        art-map.json
  /services
    storage.ts
    ranking.ts
    analytics.ts
    share-card.ts
  /styles
    tokens.css
    themes.css
    global.css
  /types
    trail.ts
    score.ts
    ranking.ts
  /utils
    format.ts
    random.ts
    guards.ts
/public
  /assets
    /icons
    /textures
    /audio
```

### Contrato de integracao com Cordel 2.0

O modulo deve expor:

- rota inicial do jogo
- evento de inicio/fim de partida
- score final
- identificador da trilha
- hooks opcionais para analytics e autenticacao

Exemplo de contrato:

- `mountBuleBule(container, { user, onFinish, onNavigate, theme })`
- ou rota `/experiencias/mandacaru`

### Performance

- Grades precomputadas no build ou carregadas por JSON.
- Card compartilhavel gerado por HTML/CSS antes de qualquer solucao por canvas.
- Assets comprimidos.
- Animacoes em CSS e transform, sem excesso de canvas.
- Lazy load das trilhas futuras.
- Meta alvo: primeira carga abaixo de 2 MB no beta.

### PWA futuro

- manifest com icone do chapeu
- cache de assets e trilhas ja jogadas
- modo offline para treino
- ranking sincroniza quando houver rede

## Entregavel 8 - Roadmap de desenvolvimento

### Fase 1 - Prototipo jogavel

- Definir identidade visual inicial.
- Implementar home, escolha de trilha e loop de 1 etapa.
- Implementar grade tocavel e selecao de palavras nos dois modos.
- Implementar timer, score e feedback.
- Validar card final estatico.
- Validar legibilidade, ritmo e prazer de jogo.

### Fase 2 - Beta 1.0 testavel

- Completar as 5 etapas.
- Adicionar tela final, recorde local, medalhas de estilo e fluxo de replay.
- Adicionar dicas simples por etapa.
- Implementar card compartilhavel.
- Refinar audio, transicoes e responsividade.
- Testar em celulares medianos.
- Coletar dados de abandono, tempo medio e dificuldade.

### Fase 3 - Beta 1.1 com competicao online enxuta

- Submissao de score para backend.
- Ranking por trilha.
- Seed fixa da trilha desafio da semana.
- Top 10.
- Captura de apelido e modo desafio.
- Validacao basica antifraude.

### Fase 4 - Beta 1.2 e biblioteca de trilhas

- Ferramenta editorial simples para cadastrar trilhas por JSON.
- Pacotes novos com temas e dificuldades variadas.
- Modo desbloqueio e colecao de emblemas.
- Integracao futura com CMS ou planilha importada.

## Trilhas futuras sugeridas

- `Romaria de Barro`
- `A Escola do Alto`
- `No Rastro do Rio`
- `Correio do Sertao`
- `Festa de Lampiao de Papel`
- `Noite de Sao Joao em Brasa`

## Progressao de dificuldade

- Trilha 1: palavras concretas, grid menor, rimas obvias.
- Trilha 2: mais palavras raras e distratores.
- Trilha 3: grids maiores e rimas menos imediatas.
- Trilha 4: tempo menor ou metas paralelas.
- Trilha 5+: eventos especiais, palavras compostas e rotas narrativas.

## Retencao e compartilhamento

- score card visual para redes
- medalhas por estilo de jogo: veloz, poeta, certeiro, sem-erro
- desafio semanal com seed fixa
- missao diaria curta
- frase final personalizada para compartilhar
- desbloqueio cosmetico de molduras e emblemas de chapeu

## Equilibrio entre poesia, jogo e velocidade

- O cordel entra em porcoes curtas e dramaticas.
- A etapa nao exige leitura longa para nao matar o ritmo.
- As rimas sao recompensa, nao barreira de entendimento.
- O contexto social informa a atmosfera sem transformar a partida em aula.

## Decisoes principais assumidas

- O primeiro beta deve ser mobile-web, nao app nativo.
- O motor de jogo deve ser orientado por dados.
- O ranking online deve entrar em camada posterior, sem travar o MVP.
- O Cordel 2.0 deve consumir esse jogo como modulo desacoplado.

## Conclusao executiva

O projeto e altamente viavel como MVP. A mecanica central e simples de construir, forte para teste e suficientemente singular para se destacar. O sucesso dependera de tres disciplinas bem amarradas: ritmo de jogo, identidade visual consistente e pipeline editorial de trilhas. Se essas tres partes forem tratadas como sistema unico, Mandacarú pode nascer pequeno e crescer como biblioteca viva de aventuras em cordel.
