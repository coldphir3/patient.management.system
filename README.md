# Interactive Prototype (Tailwind, Responsive)

Standalone browser prototype for the **Medical Clinic Patient Management System** with responsive UI, medicine inventory tracking, and role-based login.

## Location
- `C:\Users\mnich\Documents\Patient Management System\interactive-prototype`

## Files
- `index.html` (Tailwind UI + styled login overlay)
- `app.js` (workflow logic, auth/session, permissions)
- `demo-accounts.txt` (demo credentials and mapped roles)
- `styles.css` (legacy file, not required by current UI)

## Run
1. Open `index.html` in a browser with internet access (Tailwind CDN).
2. Open `demo-accounts.txt` if you need demo credentials.
3. Sign in and use sidebar navigation based on your account permissions.

## Covered Workflow
- Register patient -> **Waiting for Vitals**
- Capture vitals (BP format + SpO2 range validation) -> **Waiting for Examination**
- Save exam notes -> **Waiting for Diagnosis**
- Save diagnosis -> **Consultation Complete**

## Included Features
- Login gate with persisted session
- No in-app role switching (role is account-bound)
- Signed-in user profile menu with settings placeholder and logout
- Queue views for each stage
- Search + load existing patients
- Medicine inventory with dispensing workflow and stock updates on consultation save
- Dedicated inventory tab with stock list, restocking, low-stock alerts, and stock activity history
- Guided examination capture with category-based suggestions, autocomplete, quick tags, and exam templates
- Role-based access checks per action
- Reports dashboard, diagnosis summary, patient history timeline
- Tablet-friendly responsive layout and touch-sized navigation
- Audit trail logs
- Seeded demo data

## Note
- The **Reset Demo Data** button remains intentionally hidden, per your preference.
