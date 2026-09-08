# Visual Review Notes

The first multi-route screenshot exposed a runtime crash in the theme provider; this was fixed by rewriting the provider with a namespaced React import and browser-safe localStorage access.

The follow-up screenshot of the dashboard rendered successfully at 1280×720. The app now shows a branded Notulen AI sidebar, top navigation, Indonesian copy, four metric cards, an activity chart, upcoming action items, and the active user profile. The visual system uses a calm lavender accent with sage and warm status colors, plus a switchable dark theme. The main remaining validation is authenticated interaction across meeting creation, recording, action items, and detail views.

The multi-route capture briefly showed the auth skeleton because the session query was still settling; a follow-up capture of `/rapat` rendered successfully. The meeting list has working search/filter controls, status pills, responsive table structure, and a clear Indonesian hierarchy. The active sidebar correctly highlights the current route.

After the Home.tsx restoration, the multi-route screenshot captured the DashboardLayout skeleton on all four routes. TypeScript now passes, so this appears to be a session/loading timing issue in the screenshot capture rather than a compile failure. A follow-up single-route capture is needed before delivery.

A follow-up single-route capture of `/` loaded successfully. The dashboard now renders with the branded sidebar, live backend-backed metric state (currently zero because the signed-in workspace has no persisted meetings yet), activity chart, and action-item panel. The earlier multi-route skeleton was capture timing while auth was settling.

Final visual pass: `/rapat` renders the genuine empty state from the empty tRPC result, while `/rekaman` renders the browser recorder and audio upload surface with microphone-ready status. `/` can briefly show auth/query skeletons while the session settles, then resolves to the live workspace dashboard.

Loading animation enhancement pass: the `/rekaman` route was captured after the HMR update. The route initially displayed the existing auth/query skeleton while session data settled; the new processing UI is guarded by the recorder state and uses a stage-aware spinner, percentage, step indicators, live status text, and reduced-motion utility classes. A settled capture should be used if further screenshot inspection is needed.

Settled `/rekaman` capture verified the branded recorder layout and the clarified processing meter copy. The idle state preserves the existing hierarchy; during processing, the same panel will reveal the animated stage card without shifting the surrounding layout.

Dynamic ETA pass: the `/rekaman` route remains visually stable after adding duration/size-based estimate copy. The estimate is placed under the processing meter and is designed to update as the detected audio duration, file size, and processing clock change. The first capture showed the existing query skeleton before settlement; type checks, tests, and production build passed afterward.

Stage-weighted ETA pass: the settled `/rekaman` capture shows the estimate copy in the processing panel without disrupting the recorder layout. Idle state correctly prompts the user to upload audio before showing a numeric estimate; once duration and size are known, the copy is ready to update as the pipeline advances.

Cancellation pass: the `/rekaman` route preserves its existing recorder layout after adding the cancellation control. The cancel button is rendered only during active upload/transcription/analysis stages, while the cancelled state keeps the audio available for retry and resets progress/ETA. The captured route initially showed the standard auth/query skeleton before settlement; type checks, tests, and production build passed afterward.

Server-aware cancellation pass: after the router restart, the `/rekaman` route still loads through its standard query/auth skeleton and retains the existing recorder composition. The cancel affordance is conditional to active processing and the cancelled state preserves retryable audio. Type check, 4 test files with 8 tests, and production build passed.

Cancellation hardening: client-side AbortController now stops awaiting fetch/mutation results immediately, while a server cancellation token is sent to upload, transcription, and AI procedures. Procedures check the token before and after external work and before persisting meeting analysis/action items. The processing router contract is covered by Vitest.
