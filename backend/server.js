const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("@notionhq/client");
const app = express();
const dotenv = require("dotenv");
const { OpenAIApi, Configuration } = require("openai");
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const PORT = 3000;

// Initialize Notion client with your integration token
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_TOKEN,
});
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const resumeContent = process.env.RESUME;

// OpenAI API Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

// Generate Cover Letter Endpoint
app.post("/generate-cover-letter", async (req, res) => {
  const { jobTitle, company, jobDescription } = req.body;

  const prompt = `
This is my resume:
${resumeContent}

Based on this, write a professional cover letter for the position of ${jobTitle} at ${company}. Use the following job description for reference:
${jobDescription}
  `;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
    });

    const coverLetter = response.data.choices[0].text.trim();
    res.status(200).json({ coverLetter });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
