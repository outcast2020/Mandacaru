# Mandacaru: rima que resiste

Mandacaru: rima que resiste e um game de linguagem, ritmo e memoria cultural que faz parte do ecossistema de app do Laboratorio Cordel 2.0.

O projeto foi desenhado como um modulo jogavel, leve e expansivel, capaz de entrar no Cordel 2.0 como:

- rota dedicada dentro do app principal
- WebView embarcado
- experiencia web publicada separadamente
- modulo editorial reutilizavel para novas trilhas

## O que ja existe

- primeira versao jogavel em React/Vite
- 1 trilha beta completa com 5 etapas
- score, timer, combo, dica e tela final
- ranking local e suporte a ranking online por Apps Script
- card final exportavel e compartilhavel
- conteudo desacoplado em JSON

## Como rodar agora

### 1. Instalar dependencias

```bash
npm install
```

### 2. Subir em desenvolvimento

```bash
npm run dev
```

### 3. Gerar build local

```bash
npm run build
```

### 4. Visualizar a build

```bash
npm run preview
```

Se a meta agora e apenas ver a primeira versao rodando, o backend nao e obrigatorio. O jogo funciona com fallback local no navegador.

## Ranking no beta

Para testar sem backend:

```env
VITE_LEADERBOARD_PROVIDER=local
```

Para testar com Google Apps Script:

```env
VITE_LEADERBOARD_PROVIDER=appscript
VITE_APPSCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

Arquivos de apoio:

- [appscript/Code.gs](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\appscript\Code.gs)
- [appscript/README.md](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\appscript\README.md)
- [APPSCRIPT_LEADERBOARD_CONTRACT.md](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\APPSCRIPT_LEADERBOARD_CONTRACT.md)

## Lugar do game no Cordel 2.0

Mandacaru nao deve ser tratado como experiencia isolada ou miniapp descartavel. Ele faz parte da estrategia do Laboratorio Cordel 2.0 de transformar cultura popular brasileira em experiencia digital viva, compartilhavel e atual.

Isso significa que o game precisa sustentar ao mesmo tempo:

- valor cultural
- valor ludico real
- expansao editorial
- integracao com outras experiencias do laboratorio

No ecossistema maior, Mandacaru pode cumprir tres papeis:

1. porta de entrada ludica para repertorio de cordel
2. modulo de descoberta de linguagem poetica e oralidade
3. biblioteca viva de trilhas baseadas em contextos brasileiros

## Estrutura de conteudo

O motor do jogo foi preparado para crescer por trilhas.

Indice principal:

- [content/index.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\index.json)

Trilha beta:

- [content/trails/trilha_feira_ao_anoitecer/trail.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\trails\trilha_feira_ao_anoitecer\trail.json)

Schemas:

- [content/schema/content-index.schema.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\schema\content-index.schema.json)
- [content/schema/trail.schema.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\schema\trail.schema.json)
- [content/schema/stage.schema.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\schema\stage.schema.json)

Cada trilha e um pacote independente com:

- manifesto da trilha
- 5 etapas
- grade do caca-palavras
- palavras comuns, raras e rimas bonus
- transicoes narrativas
- direcao visual da trilha

## Como aumentar as trilhas

O crescimento do Mandacaru nao depende de reescrever o app. Ele depende de aumentar o repertorio editorial.

As novas trilhas podem nascer de:

- literatura de cordel
- pelejas
- quadras populares
- coco, repente e embolada
- rimas urbanas, slam e poesia falada
- cruzamentos entre sertao e cidade

### Regra editorial

Toda nova trilha deve manter estes principios:

- raiz brasileira clara
- conflito narrativo curto e forte
- linguagem jogavel no celular
- palavras ligadas a contexto real
- rimas bonus curadas, nao aleatorias
- chance de compartilhamento ao fim da rodada

### Regra de repertorio

O jogo pode ampliar variedade sem perder identidade se alternar:

- trilhas mais sertanejas e tradicionais
- trilhas de borda entre interior e cidade
- trilhas com presenca mais urbana e musical

Esse equilibrio e importante para que o Cordel 2.0 nao vire apenas arquivo de tradicao nem apenas embalagem contemporanea. O valor esta justamente no encontro entre heranca poetica e linguagem viva.

## Fontes poeticas e expansao de repertorio

O projeto ja possui base inicial de corpus e rimas:

- [peleja_bulebule_barreto_estruturada.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\peleja_bulebule_barreto_estruturada.json)
- [banco_de_rimas_bulebule_barreto.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\banco_de_rimas_bulebule_barreto.json)
- [content/corpus/peleja.metadata.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\corpus\peleja.metadata.json)
- [content/corpus/verse-training.ab-bb.json](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\content\corpus\verse-training.ab-bb.json)

Esses materiais ajudam a:

- gerar novas trilhas
- curar rimas bonus
- treinar sugestao automatica de versos
- ampliar vocabulario tematico

No futuro, o repertorio pode ser enriquecido tambem com:

- slams e batalhas de rima
- rap de quebrada com forte densidade poetica
- poesia falada nordestina contemporanea
- acervos escolares e comunitarios de quadras

## Proximas trilhas sugeridas

Biblioteca inicial proposta:

- `Flor no Asfalto`
- `Feira de Neon`
- `Lua Sobre o Alto`
- `Espinho de Concreto`
- `Romaria de Fogo`
- `Beco das Estrelas`
- `Caderno de Repente`
- `Vento na Laje`

Detalhamento em:

- [TRILHAS_FUTURAS_MANDACARU.md](C:\Users\Carlos\Documents\ai BOT\Lab\Bule Bule\TRILHAS_FUTURAS_MANDACARU.md)

## Observacao de produto

A prioridade agora nao e empilhar trilhas demais. A prioridade e ver a primeira versao rodando, observar friccao real no mobile e ajustar:

- clareza da leitura
- resposta do grid ao toque
- ritmo entre estrofe e acao
- impacto do card compartilhavel
- vontade de replay

Depois disso, a expansao editorial ganha mais seguranca e qualidade.
