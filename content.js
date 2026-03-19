console.log("Extension loaded on GitHub!");

const repo = document.querySelector("strong a");

if (repo) {
  console.log("Repo name:", repo.innerText);
}
