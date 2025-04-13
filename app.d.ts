// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface ImportMetaEnv {
      VITE_FIREBASE_API_KEY: string
      VITE_FIREBASE_AUTH_DOMAIN: string
      VITE_FIREBASE_PROJECT_ID: string
      VITE_FIREBASE_STORAGE_BUCKET: string
      VITE_FIREBASE_MESSAGING_SENDER_ID: string
      VITE_FIREBASE_APP_ID: string
    }

    interface ImportMeta {
      readonly env: ImportMetaEnv
    }
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
