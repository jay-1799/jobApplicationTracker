# Job Application Tracker Chrome Extension

A Chrome extension that helps you track job applications by saving job details like position, company, location, and description directly to your Notion database. This tool streamlines job application tracking, allowing you to organize and review job postings efficiently.

---

## Features

- Extracts job details from job posting websites.
- Populates the extension's form with extracted data automatically.
- Saves the job information to a specified Notion database.

---

### Prerequisites

1. A **Notion workspace** with a database for tracking job applications.
2. A Notion **integration token** with access to your database.

---

---

### Setting Up

#### **1. Configure Notion Database**

1. Create a new database in Notion (e.g., "Job Tracker").
2. Add the following properties to the database:
   - **Position** (Title)
   - **Company** (Text or Rich Text)
   - **Location** (Text or Rich Text)
   - **Description** (Text or Rich Text)
3. Share the database with your Notion integration:
   - Create a Notion integration from [Notion Integrations](https://www.notion.so/my-integrations).
   - Copy the integration token.
   - Share the database with your integration by inviting it via the **Share** button.

#### **2. Backend Setup**

1. Navigate to the `server/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configure Environment Variables

1. Create a `.env` file in the `backend` folder with the following contents:
   ```plaintext
   NOTION_TOKEN=YOUR_NOTION_INTEGRATION_TOKEN
   DATABASE_ID=YOUR_DATABASE_ID
   ```
2. Start the server:

```bash
node server.js
```

### Chrome Extension Setup

1. Open Chrome and navigate to chrome://extensions.
2. Enable Developer Mode.
3. Click Load unpacked and select the chromeExtension/ folder.
