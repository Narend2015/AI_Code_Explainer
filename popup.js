// document.getElementById("btn").addEventListener("click", () => {
//   alert("Extension working!");
// });


document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Popup loaded");

  const btn = document.getElementById("explainBtn");

  if (!btn) {
    console.log("❌ Button not found");
    return;
  }

  btn.addEventListener("click", () => {
    console.log("🔥 Button clicked");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

      if (!tabs || tabs.length === 0) {
        console.log("❌ No active tab");
        return;
      }

      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "GET_GITHUB_DATA" },
        (response) => {

          if (chrome.runtime.lastError) {
            console.log("❌ Error:", chrome.runtime.lastError.message);
            return;
          }

          if (!response) {
            document.getElementById("output").innerText =
              "❌ No response from content script";
            return;
          }

          console.log("📦 Full Data:", response);

          // 👇 Show loading state
          document.getElementById("output").innerText = "⏳ Analyzing code...";

          // ===============================
          // 🔥 CALL BACKEND API HERE
          // ===============================
          fetch("http://localhost:3000/explain", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(response)
          })
          .then(res => res.json())
          .then(data => {
            console.log("AI Response:", data);

            document.getElementById("output").innerText =
              "Repo: " + response.repoName +
              "\nFile: " + response.fileName +
              "\nLanguage: " + response.language +
              "\n\nAI Summary:\n" + data.summary;
          })
          .catch(err => {
            console.log("❌ API Error:", err);

            document.getElementById("output").innerText =
              "❌ Failed to get AI response";
          });

        }
      );
    });
  });
});