/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_REST_ROOT: string;
  readonly VITE_ADMIN_AUTH: string;

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
