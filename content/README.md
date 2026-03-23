# Content Architecture

Este diretorio concentra o conteudo editorial do jogo separado do motor.

## Estrutura

- `schema/`: contratos JSON para indice, trilhas, etapas e dicionarios.
- `dictionaries/themes/`: bancos de palavras por tema.
- `trails/<trail-id>/`: pacote editorial de cada trilha.

## Fluxo recomendado

1. O app carrega `content/index.json`.
2. O indice aponta para o `trail.json` da trilha.
3. O `trail.json` informa os `stageFiles`.
4. Cada arquivo de etapa descreve estrofe, grade, palavras, rimas, dica e transicao.

## Convencoes

- Todos os textos e identificadores estao em ASCII para evitar atrito no beta.
- Grades usam letras maiusculas sem acentos.
- `rareWords` sempre precisa ser subconjunto de `validWords`.
- `bonusRhymes` sao curadas manualmente e nao dependem de algoritmo automatico.
