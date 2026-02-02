# HMSv3 Voice Control Guide

Welcome to the future of Hospital Management! This guide explains how to control the HMSv3 application entirely using your voice.

> [!TIP]
> **Robust Matching**: Our system uses advanced fuzzy matching.
> You don't need to be perfect. "Lojin" works just as well as "Login".

---

## 1. Getting Started

1.  **Locate the Mic**: Look for the floating **Microphone Button** in the bottom-right corner of the screen.
2.  **Activate**: Click the button.
3.  **Permission**: If asked, allow the browser to access your microphone.
4.  **Status**:
    - **Blue Mic**: Idle / Muted.
    - **Red/Pulsing**: Listening.
    - **Transcript**: A text bubble appears above the mic showing what it heard.

---

## 2. Navigation Commands

You can navigate to any module by saying "Go to..." or just the module name.

| Module           | Voice Commands (Variations supported)               |
| :--------------- | :-------------------------------------------------- |
| **Dashboard**    | "Dashboard", "Home", "Go to dashboard"              |
| **Patients**     | "Patients", "Patient List", "Pay shunts"            |
| **Appointments** | "Appointments", "Appointment List", "A point ments" |
| **Billing**      | "Billing", "Bill ing", "Go to billing"              |
| **Triage**       | "Triage", "Tree azh", "Go to triage"                |
| **Admin**        | "Admin", "Administrator", "Add min"                 |
| **Users**        | "Users", "User list", "Use ars"                     |
| **Departments**  | "Departments", "Department list"                    |
| **Lab**          | "Lab", "Laboratory"                                 |
| **Consultation** | "Consultation", "Consult"                           |

---

## 3. Global Actions

These commands work anywhere in the application.

| Action          | Commands                                | Description              |
| :-------------- | :-------------------------------------- | :----------------------- |
| **Login**       | "Login", "Sign in", "Log in", "Low gin" | Go to Login Page.        |
| **Logout**      | "Logout", "Sign out", "Log out"         | Log out current user.    |
| **Back**        | "Go back", "Back", "Navigate back"      | Return to previous page. |
| **Scroll Down** | "Scroll down", "Down", "Page down"      | Scroll down the page.    |
| **Scroll Up**   | "Scroll up", "Up", "Page up"            | Scroll up the page.      |

---

## 4. Form Filling (Hands-Free Typing)

You can fill forms without touching the keyboard.

### Step 1: Focus the Field

Say **"Focus [Field Name]"** or **"Select [Field Name]"**.

- Examples: "Focus Username", "Select Password", "Focus First Name".

### Step 2: Speak the Value

Once a field is focused, just speak naturally to type.

- Example: "John Doe", "Admin", "One Two Three".

### Step 3: Corrections

- **"Clear"**: Clears the current field.
- **"Clear field"**: Same as above.

### Example Workflow: Login

1.  **"Login"** -> Navigates to Login page.
2.  **"Focus User Name"** -> Focuses Username field.
3.  **"Admin"** -> Types "Admin".
4.  **"Focus Pass Word"** -> Focuses Password field.
5.  **"One Two Three"** -> Types "1.2.3".
6.  **"Sign In"** -> (Future) Submits form. (For now, click Sign In).

---

## 5. Troubleshooting

**"It's not listening!"**

- Check if the icon is RED. If blue, click it.
- Check browser permissions (lock icon in URL bar).

**"It hears 'Lojin' but doesn't do anything."**

- Check the console (F12) for "Fuzzy Match" logs.
- If it says "Match score too low", try speaking more clearly.

**"It types 'Focus' into the field."**

- Say "Focus [Field]" clearly as one phrase. If you pause after "Focus", it might treat the next word as typing input.
