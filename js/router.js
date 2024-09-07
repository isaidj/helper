const routes = {
  "/": "Home",
  "/camunda": "Camunda",
  "/fixed-3": "Git Submodule",
};

function router() {
  let path = window.location.hash.slice(1) || "/";
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = `<h2>${routes[path]}</h2><p>This is the ${routes[path]} page content.</p>`;
  updateDocumentation(path);
}

function handleNavigation(e) {
  if (e.target.tagName === "A") {
    e.preventDefault();
    window.location.hash = e.target.getAttribute("href");
  }
}

document.querySelector("nav").addEventListener("click", handleNavigation);
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
