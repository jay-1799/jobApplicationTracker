document.getElementById("jobForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const job = {
    position: document.getElementById("position").value,
    company: document.getElementById("company").value,
    location: document.getElementById("location").value,
    description: document.getElementById("description").value,
  };

  try {
    const response = await fetch("http://localhost:3000/add-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });

    if (response.ok) {
      alert("Job added to Notion Template!");
    } else {
      alert("Failed to save job.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred.");
  }

  // Clear the form
  document.getElementById("jobForm").reset();
});
// Autofill the form with extracted job data
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("autoFillButton").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "extractJobInfo" },
        (response) => {
          if (response) {
            document.getElementById("position").value = response.position || "";
            document.getElementById("company").value = response.company || "";
            document.getElementById("location").value = response.location || "";
            document.getElementById("description").value =
              response.description || "";
          } else {
            alert("Could not extract job information from this page.");
          }
        }
      );
    });
  });
});

document
  .getElementById("generate-cover-letter")
  .addEventListener("click", async () => {
    const position = document.getElementById("position").value.trim();
    const company = document.getElementById("company").value.trim();
    const description = document.getElementById("description").value.trim();

    try {
      // Assuming the response from the first API provides the cover letter
      const response = await fetch(
        "https://kguwpenl2h.execute-api.us-east-1.amazonaws.com/prod/dockerTest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobTitle: position,
            company,
            jobDescription: description,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Generated cover letter data:", data);

        const coverLetter = data.coverLetter; 
        document.getElementById("cover-letter-output").innerText =
          coverLetter || "No cover letter generated.";

        const fastApiResponse = await fetch(
          "http://127.0.0.1:8000/upload_word_document/", // FastAPI URL
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cover_letter: coverLetter, 
            }),
          }
        );

        if (fastApiResponse.ok) {
          const fastApiData = await fastApiResponse.json();
          console.log("File uploaded successfully:", fastApiData);
          alert("Cover letter uploaded to Google Drive successfully!");
        } else {
          console.error(
            "FastAPI error response:",
            await fastApiResponse.text()
          );
          alert("Error uploading cover letter.");
        }
      } else {
        console.error("Error generating cover letter:", await response.text());
        alert("Error generating cover letter.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  });
