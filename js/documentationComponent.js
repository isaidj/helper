const SRC = "http://localhost:3000"; // Ajusta esto según tu configuración
const TOKEN = "a5015e1f-c515-4cf9-b5ca-763dfb380773"; // Reemplaza con tu token real
const iframeWidth = 600;

// State
let isDrawerOpen = false;
let isExpanded = false;

// DOM Elements
const body = document.body;
const toggleButton = document.createElement("button");
const iframe = document.createElement("iframe");

// Utility Functions
function createToggleButton() {
  toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
            <path d="M8 7h6"></path>
            <path d="M8 11h8"></path>
            <path d="M8 15h6"></path>
        </svg>
    `;
  toggleButton.className = "doc-toggle-button";
  toggleButton.setAttribute("aria-label", "Toggle Documentation Drawer");
  toggleButton.addEventListener("click", toggleDrawer);
  body.appendChild(toggleButton);
}

function createIframe() {
  iframe.className = "doc-iframe";
  iframe.title = "Documentation";
  body.appendChild(iframe);
  updateDocumentation(window.location.hash.slice(1) || "/");
}

function updateDocumentation(path) {
  console.log("Updating documentation for path:", path);
  const route = path.replace("/", "");
  iframe.src = `${SRC}/${route}`;
}

function toggleDrawer() {
  isDrawerOpen = !isDrawerOpen;
  updateIframeStyle();
  sendMessageToIframe("toggleDrawer", isDrawerOpen);
  sendMessageToIframe("token", TOKEN);
  sendMessageToIframe("iframeWidth", iframeWidth);
}

function updateIframeStyle() {
  iframe.style.width = isDrawerOpen
    ? isExpanded
      ? "100%"
      : `${iframeWidth}px`
    : "0";
}

function sendMessageToIframe(type, value) {
  iframe.contentWindow.postMessage(
    {
      type,
      [type === "toggleDrawer" ? "isOpen" : type]: value,
      width: type === "iframeWidth" ? value : undefined,
    },
    SRC
  );
}

// Event Listeners
function handleMessage(event) {
  if (event.origin !== SRC || !event.data) return;
  const { type, isOpen } = event.data;
  if (type === "drawerToggle") {
    isDrawerOpen = isOpen;
    updateIframeStyle();
  }
  if (type === "expandToggle") {
    isExpanded = isOpen;
    updateIframeStyle();
  }
}

function handleKeyDown(event) {
  if (event.key === "F1") {
    event.preventDefault();
    toggleDrawer();
  }
}

// Initialize
function init() {
  createToggleButton();
  createIframe();
  window.addEventListener("message", handleMessage);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("routeChanged", (e) => updateDocumentation(e.detail));
  // Send initial iframeWidth
  setTimeout(() => sendMessageToIframe("iframeWidth", iframeWidth), 1000);
}

// Run initialization
init();
