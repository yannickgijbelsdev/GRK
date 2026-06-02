#!/bin/bash
# One-shot helper: trigger a deploy on Koodh VDC via the backend.
# Stores the JSON response in /tmp/vdc_last_deploy.json so the agent can
# extract the deployment_id and report it back to the user.
curl -fsS -X POST http://localhost:8001/api/vdc/deploy \
  -H "Content-Type: application/json" \
  | tee /tmp/vdc_last_deploy.json
