# Omni Smart Mini‑App

This mini‑app is a modular, TypeScript/React reference implementation for a smart customer support auto‑responder.

Features
- Multilingual intent detection (English / Arabic / fallback)
- Intent classification (FAQ, tracking, complaint, product info, greeting, clarify)
- Personalization via a Customer object
- Mocked platform/API integrations with clear hooks to replace with real services (Facebook, Instagram, WhatsApp, Shopify, Zendesk, etc.)
- Tiny in‑memory learning loop with feedback (👍/👎) and helper to POST to a backend
- Accessible UI components (Tailwind + Radix-like primitives assumed)

Files
- src/components/OmniSupportMiniApp.tsx — main React component
- src/nlp/detectLang.ts — simple language heuristic
- src/nlp/intent.ts — intent rules and chooser
- src/templates.ts — templates per intent & language
- src/api/integrations.ts — mocked integrations and platform hooks
- src/store/learningStore.ts — learning store and feedback submitter

Usage
1. Install dependencies (React, framer-motion, lucide-react, etc.)
2. Replace mocked integration functions in `src/api/integrations.ts` with real API calls to your platforms (WhatsApp Cloud API, Facebook Messenger, Instagram Graph, Shopify, Zendesk, etc.)
3. Configure environment variables / API keys and implement secure server-side webhooks for receiving and sending messages.
4. Run the app and embed `<OmniSupportMiniApp />` where you want an interactive demo.

Notes
- This is a demo starter. Swap the heuristic NLP with a real model (CLD3/fastText or an LLM) for production accuracy.
- Move the learningStore to a durable backend and batch feedback for model retraining.
