/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEADERBOARD_PROVIDER?: 'local' | 'appscript' | 'supabase';
  readonly VITE_APPSCRIPT_URL?: string;
  readonly VITE_SUPABASE_LEADERBOARD_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
