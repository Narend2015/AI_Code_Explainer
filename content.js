console.log("Extension loaded on GitHub!");

// const repo = document.querySelector("strong a");

// if (repo) {
//   console.log("Repo name:", repo.innerText);
// }

// const path = window.location.pathname;

// if (path.includes("/blob/")) {
//   const fileName = path.split("/").pop().split("?")[0];
//   console.log("File:", fileName);
// }

// ===============================
// 1. Extract Code
// ===============================
function extractCode() {
  let lines = document.querySelectorAll("div.react-code-text");

  // fallback (older GitHub UI)
  if (lines.length === 0) {
    lines = document.querySelectorAll("td.blob-code");
  }

  if (lines.length === 0) {
    console.log("❌ No code found!");
    return "";
  }

  let code = "";

  lines.forEach(line => {
    code += line.innerText + "\n";
  });

  return code.trim();
}

// ===============================
// 2. Extract Repo + File + Language
// ===============================
function extractGitHubData() {
  const path = window.location.pathname;

  if (!path.includes("/blob/")) {
    console.log("❌ Not a GitHub file page");
    return null;
  }

  const parts = path.split("/");

  const repoName = parts[2];
  const fileName = path.split("/").pop().split("?")[0];

  const language = fileName.includes(".")
    ? fileName.split(".").pop()
    : "unknown";

  const code = extractCode();

  const data = {
    repoName,
    fileName,
    language,
    code
  };

  console.log("📦 Extracted Data:", data);

  return data;
}

// ===============================
// 3. Listen from Popup
// ===============================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_GITHUB_DATA") {
    const data = extractGitHubData();
    sendResponse(data);
  }
});

// ===============================
// 4. Handle Page Change
// ===============================
let lastUrl = location.href;

const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;

    console.log("🔄 Page changed");

    setTimeout(() => {
      extractGitHubData();
    }, 1000);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});