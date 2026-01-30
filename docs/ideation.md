# Ideation: Voice Navigation & Form Filling in HMSv3

## Overview
This document outlines the strategy for implementing voice-controlled navigation and form filling in the HMSv3 Angular application using the native **Web Speech API (`SpeechRecognition`)**.

## Architectural Components

### 1. Core Service: `VoiceRecognitionService`
A singleton service responsible for:
- Initializing `window.SpeechRecognition`.
- Managing permissions and state (Listening/Idle).
- Exposing observables for:
    - `text$`: The transcript of what the user said.
    - `isListening$`: Boolean state for UI feedback.
    - `errors$`: Handling permission or network errors.

**Key Technical Details:**
- **Continuous Mode**: Configured to `continuous = true` (or restarted on end) for persistent control.
- **Interim Results**: `interimResults = true` for real-time feedback.

### 2. Command Processing: `VoiceCommandService`
A service that interprets transcripts and executes actions.
- **Pattern Matching**: RegEx-based matching for commands.
- **Dependency**: Injects `Router` for navigation and `VoiceRecognitionService`.

### 3. Directives for Form Interaction
#### `[appVoiceInput]`
- Attached to `<input>`, `<textarea>`, `<p-dropdown>`.
- **Functionality**:
    - Listens for a specific "focus key" (e.g., the label of the input).
    - When focused, it funnels the voice transcript explicitly into the form control.
    - Handles "Clear" or "Submit" contextually.

### 4. Global UI Component: `VoiceHudComponent`
- A persistent floating widget or header indicator.
- **States**:
    - 🔴 **Off**: Click to enable.
    - 🟢 **Listening**: Pulsing animation.
    - 🔵 **Processing**: Showing recognized text (e.g., "Go to Patients...").

---

## Functional Requirements

### A. Voice Navigation
**Trigger**: Global context (always active when listening).

| Command Pattern | Action | Example |
| :--- | :--- | :--- |
| "Go to [Page Name]" | Navigate to route | "Go to Dashboard", "Go to Patients" |
| "Open [Menu Item]" | Open sidebar menu | "Open Billing" |
| "Navigate back" | `Location.back()` | "Navigate back" |
| "Scroll [Direction]" | Window scroll | "Scroll down", "Scroll up" |

**Pages to Map:**
- Dashboard
- Appointments
- Patients (List, Register)
- Billing
- Lab / Tests
- Admin (Users, Departments)

### B. Voice Form Filling
**Trigger**: User must identify the field or be in "Form Mode".

**Strategy 1: Label Matching (Recommended)**
- User says: "Select Name" -> usage finds input with label "Name" and focuses it.
- User says: "[Value]" -> System types value into focused input.

**Strategy 2: Direct Command**
- "Set Name to John Doe" -> Parses "Name" (Field) and "John Doe" (Value).

**Form Commands:**
| Command | Action |
| :--- | :--- |
| "Focus [Field Name]" | Focuses the input associated with the label. |
| "Type [Text]" | Enters text into the focused field. |
| "Select [Option]" | Selects an option in a dropdown (e.g., Gender). |
| "Next field" | Tabs to the next input. |
| "Submit form" | Triggers the submit event. |
| "Clear form" | Resets the form. |

---

## Implementation Plan

### Phase 1: Foundation
1.  Generate `VoiceRecognitionService`.
2.  Create `VoiceHudComponent` for visual feedback.
3.  Implement basic "Start/Stop" logic.

### Phase 2: Navigation
1.  Create `VoiceCommandService`.
2.  Map existing routes in `app-routing.module.ts` to voice keywords.
3.  Test "Go to..." commands.

### Phase 3: Form Introspection
1.  Create `VoiceFormDirective` to auto-register form fields on a page.
2.  Implement fuzzy matching for field labels (e.g., "Patient Name" matches "Name").
3.  Handle complex inputs (Datepickers, Dropdowns).

### Phase 4: Refinement
1.  Add sound effects (listening start, success, error).
2.  Optimize recognition delay.
3.  Add "Help" command to show available commands.
