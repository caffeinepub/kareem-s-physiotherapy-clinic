# Kareem's Physiotherapy Clinic

## Current State
The site has a working appointment request form that sends details to WhatsApp. An admin planner exists at `/#/admin` with PIN 1234. The backend stores appointments via `submitAppointmentRequest` but the state variables (`nextId` and `appointmentRequests`) are NOT stable, meaning all appointment data is lost on every redeployment. Additionally, the frontend form submits to WhatsApp first and fires backend save as a background task — but the actor may not be ready (null) at submission time, so the backend save silently fails.

## Requested Changes (Diff)

### Add
- Stable backend state so appointments persist through upgrades/redeployments

### Modify
- Make `nextId` and `appointmentRequests` stable variables in Motoko backend
- Fix the appointment form to properly await backend save (with retry logic if actor isn't ready yet), ensuring all submitted appointments appear in the admin planner

### Remove
- Nothing

## Implementation Plan
1. Regenerate Motoko backend with `stable var nextId` and `stable let appointmentRequests`
2. Frontend appointment form already has retry logic applied — no further changes needed
