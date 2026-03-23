const SHEET_NAME = 'LEADERBOARD';
const HEADER_ROW = [
  'id',
  'name',
  'score',
  'medal',
  'stagesCompleted',
  'totalStages',
  'createdAt',
  'mode',
  'seed',
  'trailId',
  'userAgent',
  'checksum',
];

const NAME_MAX_LENGTH = 18;
const TOP_LIMIT = 10;
const ALLOWED_MODES = {
  casual: true,
  challenge: true,
};

const SCORE_CAPS = {
  trilha_feira_ao_anoitecer: 2000,
  default: 5000,
};

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || 'health');

    if (action === 'getLeaderboard') {
      const scope = normalizeScopeFromParams(params);
      const entries = getLeaderboardEntries_(scope);
      return jsonResponse_({
        ok: true,
        entries: entries,
      });
    }

    return jsonResponse_({
      ok: true,
      service: 'mandacaru-leaderboard',
      sheet: SHEET_NAME,
      actions: ['getLeaderboard', 'submitScore'],
    });
  } catch (error) {
    return jsonError_(error);
  }
}

function doPost(e) {
  try {
    const body = parseJsonBody_(e);
    const action = String((body && body.action) || '');

    if (action !== 'submitScore') {
      throw new Error('invalid action');
    }

    const scope = normalizeScopeFromPayload_(body);
    const entry = normalizeEntry_(body.entry, scope, getRequestMeta_(e));

    saveEntry_(entry);

    return jsonResponse_({
      ok: true,
      entries: getLeaderboardEntries_(scope),
    });
  } catch (error) {
    return jsonError_(error);
  }
}

function setupLeaderboardSheet() {
  const sheet = getLeaderboardSheet_();
  ensureHeader_(sheet);
}

function getLeaderboardEntries_(scope) {
  const rows = readEntries_();

  return rows
    .filter(function(entry) {
      return entry.trailId === scope.trailId;
    })
    .filter(function(entry) {
      return entry.mode === scope.mode;
    })
    .filter(function(entry) {
      if (scope.mode !== 'challenge') {
        return true;
      }

      return entry.seed === scope.seed;
    })
    .sort(compareEntries_)
    .slice(0, TOP_LIMIT)
    .map(stripMetaFields_);
}

function saveEntry_(entry) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {
    const sheet = getLeaderboardSheet_();
    sheet.appendRow([
      entry.id,
      entry.name,
      entry.score,
      entry.medal,
      entry.stagesCompleted,
      entry.totalStages,
      entry.createdAt,
      entry.mode,
      entry.seed || '',
      entry.trailId,
      entry.userAgent || '',
      entry.checksum || '',
    ]);
  } finally {
    lock.releaseLock();
  }
}

function readEntries_() {
  const sheet = getLeaderboardSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, HEADER_ROW.length).getValues();

  return values
    .filter(function(row) {
      return row[0] && row[1] && row[2] !== '';
    })
    .map(function(row) {
      return {
        id: String(row[0]),
        name: String(row[1]),
        score: Number(row[2] || 0),
        medal: String(row[3] || ''),
        stagesCompleted: Number(row[4] || 0),
        totalStages: Number(row[5] || 0),
        createdAt: String(row[6] || ''),
        mode: String(row[7] || 'casual'),
        seed: row[8] ? String(row[8]) : '',
        trailId: String(row[9] || ''),
        userAgent: row[10] ? String(row[10]) : '',
        checksum: row[11] ? String(row[11]) : '',
      };
    });
}

function normalizeScopeFromParams(params) {
  const scope = {
    trailId: sanitizeText_(params.trailId, 64),
    mode: sanitizeText_(params.mode, 16),
    seed: sanitizeText_(params.seed || '', 24),
  };

  validateScope_(scope);
  return scope;
}

function normalizeScopeFromPayload_(body) {
  const scope = {
    trailId: sanitizeText_(body.trailId, 64),
    mode: sanitizeText_(body.mode, 16),
    seed: sanitizeText_(body.seed || '', 24),
  };

  validateScope_(scope);
  return scope;
}

function validateScope_(scope) {
  if (!scope.trailId) {
    throw new Error('trailId is required');
  }

  if (!ALLOWED_MODES[scope.mode]) {
    throw new Error('invalid mode');
  }

  if (scope.mode === 'challenge') {
    validateSeed_(scope.seed);
  }
}

function normalizeEntry_(rawEntry, scope, meta) {
  if (!rawEntry || typeof rawEntry !== 'object') {
    throw new Error('entry is required');
  }

  const entry = {
    id: sanitizeText_(rawEntry.id, 80),
    name: sanitizeText_(rawEntry.name, NAME_MAX_LENGTH),
    score: toSafeInteger_(rawEntry.score),
    medal: sanitizeText_(rawEntry.medal, 40),
    stagesCompleted: toSafeInteger_(rawEntry.stagesCompleted),
    totalStages: toSafeInteger_(rawEntry.totalStages),
    createdAt: sanitizeText_(rawEntry.createdAt, 40),
    mode: sanitizeText_(rawEntry.mode || scope.mode, 16),
    seed: sanitizeText_(rawEntry.seed || scope.seed || '', 24),
    trailId: sanitizeText_(rawEntry.trailId || scope.trailId, 64),
    userAgent: sanitizeText_(meta.userAgent, 255),
    checksum: sanitizeText_(rawEntry.checksum || '', 120),
  };

  if (!entry.id) {
    throw new Error('entry.id is required');
  }

  if (!entry.name) {
    throw new Error('entry.name is required');
  }

  if (!entry.medal) {
    throw new Error('entry.medal is required');
  }

  if (!entry.createdAt || isNaN(Date.parse(entry.createdAt))) {
    throw new Error('entry.createdAt is invalid');
  }

  if (entry.mode !== scope.mode) {
    throw new Error('entry.mode must match scope.mode');
  }

  if (entry.trailId !== scope.trailId) {
    throw new Error('entry.trailId must match scope.trailId');
  }

  if (entry.totalStages <= 0) {
    throw new Error('entry.totalStages must be positive');
  }

  if (entry.stagesCompleted < 0 || entry.stagesCompleted > entry.totalStages) {
    throw new Error('entry.stagesCompleted is invalid');
  }

  if (entry.score < 0 || entry.score > getScoreCapForTrail_(entry.trailId)) {
    throw new Error('entry.score is outside allowed range');
  }

  if (entry.mode === 'challenge') {
    validateSeed_(entry.seed);
  } else {
    entry.seed = '';
  }

  return entry;
}

function validateSeed_(seed) {
  if (!seed) {
    throw new Error('seed is required for challenge mode');
  }

  if (!/^MR-\d{4}-W\d{2}$/.test(seed)) {
    throw new Error('seed format is invalid');
  }

  const currentSeed = getCurrentWeeklySeed_();
  if (seed !== currentSeed) {
    throw new Error('seed is not valid for the current week');
  }
}

function getCurrentWeeklySeed_() {
  const current = new Date();
  const thursday = getUtcThursday_(current);
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((thursday.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  const paddedWeek = ('0' + week).slice(-2);

  return 'MR-' + thursday.getUTCFullYear() + '-W' + paddedWeek;
}

function getUtcThursday_(date) {
  const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = copy.getUTCDay() || 7;
  copy.setUTCDate(copy.getUTCDate() + 4 - day);
  return copy;
}

function getScoreCapForTrail_(trailId) {
  return SCORE_CAPS[trailId] || SCORE_CAPS.default;
}

function getRequestMeta_(e) {
  const parameter = (e && e.parameter) || {};
  return {
    userAgent: parameter.userAgent || '',
  };
}

function compareEntries_(left, right) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return String(left.createdAt).localeCompare(String(right.createdAt));
}

function stripMetaFields_(entry) {
  return {
    id: entry.id,
    name: entry.name,
    score: entry.score,
    medal: entry.medal,
    stagesCompleted: entry.stagesCompleted,
    totalStages: entry.totalStages,
    createdAt: entry.createdAt,
    mode: entry.mode,
    seed: entry.seed || undefined,
    trailId: entry.trailId,
  };
}

function getLeaderboardSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  ensureHeader_(sheet);
  return sheet;
}

function ensureHeader_(sheet) {
  const existing = sheet.getRange(1, 1, 1, HEADER_ROW.length).getValues()[0];
  const mismatch = HEADER_ROW.some(function(header, index) {
    return existing[index] !== header;
  });

  if (mismatch) {
    sheet.getRange(1, 1, 1, HEADER_ROW.length).setValues([HEADER_ROW]);
    sheet.setFrozenRows(1);
  }
}

function parseJsonBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('request body is missing');
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error('request body is not valid JSON');
  }
}

function sanitizeText_(value, maxLength) {
  const text = String(value || '').trim();
  return text.slice(0, maxLength);
}

function toSafeInteger_(value) {
  const numeric = Number(value);

  if (!isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.floor(numeric));
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonError_(error) {
  const message = error && error.message ? error.message : 'unknown error';

  return jsonResponse_({
    ok: false,
    error: message,
    entries: [],
  });
}
