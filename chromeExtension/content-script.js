// Try to extract job info based on common job board structures
const extractJobInfo = () => {
  const jobInfo = {
    position: document.querySelector("h1")?.innerText || "", // Try to fetch job title
    company:
      document.querySelector("[data-company-name]")?.innerText ||
      document.querySelector(".company-name")?.innerText ||
      "",
    location:
      document.querySelector("[data-location]")?.innerText ||
      document.querySelector(".job-location")?.innerText ||
      "",
    description:
      document.querySelector("[data-description]")?.innerText ||
      document.querySelector(".job-description")?.innerText ||
      "",
  };

  return jobInfo;
};

// Send the extracted data to the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractJobInfo") {
    const jobData = extractJobInfo();
    sendResponse(jobData);
  }
});
