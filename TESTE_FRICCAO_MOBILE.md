# Teste de Friccao Mobile

Objetivo: validar o Mandacaru em condicoes reais de uso antes de ampliar trilhas, modos competitivos e volume de conteudo.

## Perfil minimo de teste

- 1 Android mediano com tela pequena ou media
- 1 rede ruim ou instavel
- brilho alto
- dedo grande ou uso com uma so mao
- sessao curta de 3 a 5 minutos

## Preparacao

1. Abrir a build publicada ou `npm run preview` no celular.
2. Limpar ranking local para observar a primeira jornada.
3. Testar uma rodada com som ligado e outra com mute.
4. Repetir ao menos uma vez em modo retrato.

## Roteiro rapido

1. Entrar na trilha e identificar em ate 3 segundos: score, tempo, progresso e botao de som.
2. Jogar a etapa 1 sem ajuda externa e verificar se o gesto de toque/arraste fica obvio.
3. Forcar um erro proposital e observar se o feedback visual/sonoro fica claro sem incomodar.
4. Ativar dica uma vez e medir se o custo e compreensivel.
5. Fechar pelo menos duas etapas seguidas e notar se a progressao narrativa fica perceptivel.
6. Buscar uma rima bonus e um combo para medir se os eventos especiais parecem especiais.
7. Concluir a trilha e testar salvar apelido, abrir ranking e compartilhar card.

## Checklist de friccao

- O HUD continua legivel sem zoom?
- O dedo cobre letras demais na grade?
- A selecao responde sem atraso perceptivel?
- Os estados de acerto, rima, erro e combo sao distinguiveis em menos de 1 segundo?
- O texto da estrofe e da missao cabe sem parecer parede?
- O ranking final parece recompensa ou burocracia?
- O card final daria vontade de encaminhar no WhatsApp?
- O som ajuda o jogo ou irrita em sessao curta?
- O botao de mute fica facil de encontrar?
- A sessao completa cabe bem em 3 a 5 minutos?

## Escala de anotacao

- `0`: falhou claramente
- `1`: funcionou com atrito
- `2`: funcionou bem

## Campos para registrar por aparelho

- aparelho:
- navegador:
- tamanho da tela:
- conexao:
- rodada concluida:
- nota geral:
- maior friccao:
- melhor momento:
- bug observado:
- print ou video curto:

## Gatilhos de correcao imediata

- tempo ou score nao identificados em ate 3 segundos
- toque acidental frequente na grade
- dificuldade em terminar a etapa 1 sem explicacao externa
- card final sem clareza de medalha, score ou CTA
- som estourando, atrasando ou repetindo de forma estranha
