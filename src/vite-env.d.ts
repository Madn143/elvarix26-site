/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No backend env vars are needed right now — the old Google Sheets
  // webhook variable was removed along with that integration. Add new
  // VITE_-prefixed entries here when a new backend is connected.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
