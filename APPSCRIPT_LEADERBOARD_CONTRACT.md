# Apps Script Leaderboard Contract

Este projeto usa uma camada de servico unica para ranking:

- `src/services/leaderboard.ts`

O jogo nunca deve conversar diretamente com Google Apps Script, Google Sheets ou Supabase. Toda troca passa por:

- `getLeaderboard(scope)`
- `submitScore(scope, entry)`

## Provider atual

Configuracao por ambiente:

```env
VITE_LEADERBOARD_PROVIDER=appscript
VITE_APPSCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

Providers aceitos:

- `appscript`
- `supabase`
- `local`

Se o provider falhar ou nao estiver configurado, o app usa fallback local no navegador.

## Planilha sugerida

Aba: `LEADERBOARD`

Colunas:

1. `id`
2. `name`
3. `score`
4. `medal`
5. `stagesCompleted`
6. `totalStages`
7. `createdAt`
8. `mode`
9. `seed`
10. `trailId`
11. `userAgent`
12. `checksum`

`userAgent` e `checksum` podem ser opcionais no inicio.

## Contrato do frontend

### Tipo da entrada

```ts
type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  medal: string;
  stagesCompleted: number;
  totalStages: number;
  createdAt: string;
  mode: "casual" | "challenge";
  seed?: string;
  trailId: string;
};
```

### Escopo

```ts
type RankingScope = {
  trailId: string;
  mode: "casual" | "challenge";
  seed?: string;
};
```

## Endpoints esperados

### GET leaderboard

```http
GET /exec?action=getLeaderboard&trailId=trilha_feira_ao_anoitecer&mode=casual
GET /exec?action=getLeaderboard&trailId=trilha_feira_ao_anoitecer&mode=challenge&seed=MR-2026-W11
```

Resposta esperada:

```json
{
  "entries": [
    {
      "id": "1710600000-lia",
      "name": "Lia",
      "score": 420,
      "medal": "Rima de Ouro",
      "stagesCompleted": 5,
      "totalStages": 5,
      "createdAt": "2026-03-16T12:00:00.000Z",
      "mode": "challenge",
      "seed": "MR-2026-W11",
      "trailId": "trilha_feira_ao_anoitecer"
    }
  ]
}
```

### POST score

```http
POST /exec
Content-Type: application/json
```

Payload esperado:

```json
{
  "action": "submitScore",
  "trailId": "trilha_feira_ao_anoitecer",
  "mode": "challenge",
  "seed": "MR-2026-W11",
  "entry": {
    "id": "1710600000-lia",
    "name": "Lia",
    "score": 420,
    "medal": "Rima de Ouro",
    "stagesCompleted": 5,
    "totalStages": 5,
    "createdAt": "2026-03-16T12:00:00.000Z",
    "mode": "challenge",
    "seed": "MR-2026-W11",
    "trailId": "trilha_feira_ao_anoitecer"
  }
}
```

Resposta minima:

```json
{
  "ok": true,
  "entries": []
}
```

O frontend aceita retorno com `entries` vazio. Nesse caso, ele preserva o ranking local salvo.

## Validacoes minimas recomendadas no Apps Script

- limitar `name` a 18 caracteres
- recusar payload sem `trailId`, `mode` ou `entry`
- recusar `stagesCompleted > totalStages`
- filtrar `mode` para `casual` ou `challenge`
- em `challenge`, validar `seed`
- limitar `score` a um teto plausivel por trilha

## Estrategia de migracao

Quando o projeto migrar para Supabase:

- manter `src/services/leaderboard.ts`
- trocar apenas `VITE_LEADERBOARD_PROVIDER=supabase`
- implementar o endpoint ou adapter em `src/services/leaderboard-supabase.ts`

O motor do jogo, o HUD, o fluxo de partida e a tela final nao devem ser alterados nessa troca.
