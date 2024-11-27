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
