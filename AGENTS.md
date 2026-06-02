# GRK Project — Persistent Agent Rules

## AUTO-DEPLOY RULE (mandatory)

Whenever you finish implementing a user-requested change (feature, fix,
refactor, content edit) and you are about to report completion to the user,
you MUST as the final action POST to `http://localhost:8001/api/vdc/deploy`
(easiest via `bash /app/scripts/vdc_push.sh`).

- Wait for a 2xx response.
- Extract the `deployment_id` from the JSON and include it together with the
  link `https://vdc.koodh.com/deployments?deployment=<id>` in your completion
  message so the user can watch the build.
- Skip this step ONLY for: pure conversation, planning answers, or
  read-only investigations where no files were modified.
- Do NOT add any user-facing "Deploy" button — this mode is fully agent-driven.
- If the user explicitly says "do NOT push to VDC", skip the deploy for that
  change set only.

## VDC connection

- Base URL: `https://vdc.koodh.com`
- Application: `GRK` (id `44c88fca-71bc-4bbb-900e-a2ac59a840d2`)
- Project: `root-grk-fm`
- Production domain: `grk.fm`
- Reverse SSH tunnel runs under supervisor as `vdc_tunnel`.
- Credentials live in `backend/.env` (`VDC_BASE_URL`, `VDC_API_KEY`,
  `VDC_APPLICATION_ID`). Never print or commit them.
