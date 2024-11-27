const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("@notionhq/client");
const app = express();
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3000;

// Initialize Notion client with your integration token
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_TOKEN,
});

// Replace with your Notion database ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

app.post("/add-job", async (req, res) => {
  const { position, company, location, description } = req.body;

  try {
    // Add a new job to the Notion database
    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Position: { title: [{ text: { content: position } }] },
        Company: { rich_text: [{ text: { content: company } }] },
        Location: { rich_text: [{ text: { content: location } }] },
        Description: { rich_text: [{ text: { content: description } }] },
      },
    });

    res.status(200).json({ message: "Job added successfully to Notion!" });
  } catch (error) {
    console.error("Error adding job to Notion:", error);
    res.status(500).json({ error: "Failed to add job to Notion" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
