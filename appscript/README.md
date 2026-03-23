# Google Apps Script Setup

Arquivos:

- `appscript/Code.gs`
- `appscript/appsscript.json`

## Publicacao rapida

1. Crie uma nova planilha Google dedicada ao ranking do Mandacarú.
2. Abra `Extensoes > Apps Script`.
3. No editor, substitua o arquivo padrao pelo conteudo de `Code.gs`.
4. Abra `Configuracoes do projeto > Mostrar arquivo de manifesto appsscript.json`.
5. Cole o conteudo de `appsscript.json`.
6. Salve o projeto.
7. Execute `setupLeaderboardSheet()` uma vez para garantir a aba `LEADERBOARD`.
8. Em `Implantar > Nova implantacao`, escolha `Aplicativo da Web`.
9. Em `Executar como`, use sua conta.
10. Em `Quem tem acesso`, use `Qualquer pessoa`.
11. Finalize a implantacao e copie a URL final com `/exec`.

## Screenshot mental do fluxo

1. `Planilha aberta`
   crie a base visivel de dados do ranking.
2. `Apps Script aberto`
   cole `Code.gs` e o manifest.
3. `Funcao setupLeaderboardSheet`
   clique em `Executar` para criar cabecalho e congelar a linha 1.
4. `Nova implantacao`
   publique como web app.
5. `URL /exec copiada`
   ela entra no `.env` do frontend.

## Como ligar no frontend

No projeto web:

```env
VITE_LEADERBOARD_PROVIDER=appscript
VITE_APPSCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

Se quiser forcar fallback local durante desenvolvimento:

```env
VITE_LEADERBOARD_PROVIDER=local
```

## Smoke tests

Depois da implantacao, abra no navegador:

```text
https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

Resposta esperada:

```json
{
  "ok": true,
  "service": "mandacaru-leaderboard"
}
```

Depois teste o ranking:

```text
https://script.google.com/macros/s/SEU_DEPLOY_ID/exec?action=getLeaderboard&trailId=trilha_feira_ao_anoitecer&mode=casual
```

Resposta esperada:

```json
{
  "ok": true,
  "entries": []
}
```

## Teste do game em contexto real

Para esta fase, a meta nao e sofisticar backend. A meta e colocar o jogo para rodar cedo e observar:

1. se a etapa fica clara no celular
2. se o grid responde bem ao toque
3. se a estrofe atrapalha ou ajuda o ritmo
4. se o card final da vontade de compartilhar
5. se o ranking aumenta vontade de repetir

Sequencia recomendada:

1. publicar o frontend com `VITE_LEADERBOARD_PROVIDER=local`
2. validar loop completo das 5 etapas
3. trocar para `appscript`
4. validar envio real de score
5. rodar 5 a 10 testes com pessoas
6. ajustar UX, imagens e dificuldade antes de abrir muitas trilhas

## Quando expandir o conteudo

So vale acelerar a biblioteca de trilhas depois que a trilha beta estiver validada em:

- compreensao da mecânica
- fluidez do gesto no mobile
- tempo medio por rodada
- taxa de replay
- compartilhamento do card final

A arquitetura atual ja favorece isso:

- backend isolado por provider
- trilhas em JSON
- ranking separado do motor
- corpus poetico desacoplado do loop de jogo

Em outras palavras: a proxima escala deve entrar por `conteudo`, nao por reescrita de sistema.

## O que o script faz

- responde `GET ?action=getLeaderboard&trailId=...&mode=...&seed=...`
- responde `POST` com `action: "submitScore"`
- grava na aba `LEADERBOARD`
- devolve top 10 por `trailId`, `mode` e `seed`
- valida `mode`, `trailId`, `seed`, score e nome
- cai fora com `{ ok: false, error: "...", entries: [] }` quando o payload e invalido

## Observacoes

- `challenge` aceita apenas a seed da semana atual no formato `MR-AAAA-WNN`
- `seed` e limpa automaticamente no modo `casual`
- se o backend falhar, o frontend usa fallback local no navegador
- o ranking online deve entrar cedo o suficiente para testar competicao, mas nao antes de validar a base de UX
