# AI Lead Qualification Chat Widget

A lead qualification chat widget and operator dashboard built for the **FlyRank Frontend AI Engineering** track.

The project helps sales teams qualify inbound website visitors using the **BANT framework** — Budget, Authority, Need, and Timeline. It evaluates visitor responses, calculates a lead score from 0–100, classifies lead readiness, and generates structured JSON data for downstream CRM workflows.

## Features

### Lead Qualification
- **BANT Signal Detection:** Identifies budget indicators, decision-making authority, business needs, and purchasing timelines.
- **Lead Scoring:** Calculates a qualification score between 0 and 100 based on detected signals.
- **Lead Classification:** Groups prospects into three categories:
  - **Cold:** Limited qualification signals.
  - **Warm (MQL):** Shows potential and requires further nurturing.
  - **Qualified (SQL):** Demonstrates stronger sales-readiness signals.

### Operator Dashboard
- **Live Conversation View:** Displays visitor interactions and qualification progress.
- **JSON Payload Inspector:** Shows structured lead information for review and integration.
- **Demo Personas:** Test the qualification workflow using predefined visitor profiles.
- **CRM Export:** Export structured lead data for use in external workflows.

### Accessibility
- Semantic HTML structure.
- Accessible chat updates using `aria-live`.
- Keyboard-friendly navigation and interaction.

## Technology Stack

- **Frontend:** React, Vite
- **Language:** JavaScript
- **Styling:** Project CSS
- **Qualification Logic:** Rule-based BANT signal detection and lead scoring
- **Data Format:** JSON

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/costaspinto/ai-lead-qualifier.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ai-lead-qualifier
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Run Locally

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

### Production Build

Verify the production build:

```bash
npm run build
```

## How Qualification Works

The widget follows a structured BANT-based workflow:

1. Collects visitor responses through the chat interface.
2. Detects relevant qualification signals.
3. Evaluates the available BANT criteria.
4. Calculates a lead qualification score.
5. Assigns a lead category.
6. Produces structured JSON data for operator review and CRM workflows.

## Project Structure

The application is organized around the visitor chat experience, qualification logic, and operator dashboard. Refer to the source directories for the current implementation.

## Roadmap

Potential future improvements include:

- LLM-powered conversational qualification.
- Customizable lead-scoring rules.
- CRM integrations and automated lead routing.
- Persistent lead history and analytics.
- Configurable qualification workflows.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

**Built by Costas Antony Pinto**  
Frontend AI Engineering | FlyRank
