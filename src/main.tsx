import * as Sentry from "@sentry/react";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

Sentry.init({
  dsn: "https://95f40b00205b973c3a1163f499865b52@o4511592232255488.ingest.us.sentry.io/4511592256110593",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById("root")!).render(<App />);
