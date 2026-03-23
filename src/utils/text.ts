const mojibakePattern = /Ã|â€|â€œ|â€\u009d|â€™|â€“/;

export function repairMojibakeText(input: string): string {
  if (!mojibakePattern.test(input)) {
    return input;
  }

  try {
    const bytes = Uint8Array.from(input, (char) => char.charCodeAt(0));
    const repaired = new TextDecoder('utf-8').decode(bytes);

    return mojibakePattern.test(repaired) ? input : repaired;
  } catch {
    return input;
  }
}

export function normalizeText(input: string): string {
  return repairMojibakeText(input).replace(/\s+/g, ' ').trim();
}

export function slugify(input: string): string {
  return normalizeText(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeTerminalWord(input: string): string {
  return normalizeText(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase();
}

export function sanitizeImportedData<T>(value: T): T {
  if (typeof value === 'string') {
    return repairMojibakeText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeImportedData(item)) as T;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      sanitizeImportedData(item),
    ]);

    return Object.fromEntries(entries) as T;
  }

  return value;
}
