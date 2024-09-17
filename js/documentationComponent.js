// Asegúrate de incluir jQuery en tu proyecto antes de este script

$(document).ready(function () {
  // Constants
  const SRC = "http://localhost:3000"; // Ajusta esto según tu configuración
  const TOKEN = "a5015e1f-c515-4cf9-b5ca-763dfb380773"; // Reemplaza con tu token real
  const iframeWidth = 600;

  // State
  let isDrawerOpen = false;
  let isExpanded = false;

  // Create and append toggle button
  const $toggleButton = $("<button>", {
    class: "doc-toggle-button",
    "aria-label": "Toggle Documentation Drawer",
    html: `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
              <path d="M8 7h6"></path>
              <path d="M8 11h8"></path>
              <path d="M8 15h6"></path>
          </svg>
      `,
  }).appendTo("body");

  // Create and append iframe with initial hidden state
  const $iframe = $("<iframe>", {
    class: "doc-iframe",
    title: "Documentation",
    css: {
      "box-shadow": "0 0 10px rgba(0, 0, 0, 0.1)",
      border: "none",
      "border-radius": "4px",
      // transition: "all 0.3s ease-in-out",
      width: "0",
      height: "100%",
      position: "fixed",
      top: "0",
      right: "0",
      opacity: "0",
      visibility: "hidden",
      "z-index": "1000",
    },
  }).appendTo("body");

  function updateDocumentation(path) {
    console.log("Updating documentation for path:", path);
    const route = path.replace("/", "");
    $iframe.attr("src", `${SRC}/${route}`);
  }

  function toggleDrawer() {
    isDrawerOpen = !isDrawerOpen;
    updateIframeStyle();
    sendMessageToIframe("toggleDrawer", isDrawerOpen);
    sendMessageToIframe("token", TOKEN);
    sendMessageToIframe("iframeWidth", iframeWidth);
  }

  function updateIframeStyle() {
    $iframe.css({
      width: isDrawerOpen ? (isExpanded ? "100%" : `${iframeWidth}px`) : "0",
      opacity: isDrawerOpen ? 1 : 0,
      visibility: isDrawerOpen ? "visible" : "hidden",
    });
  }

  function sendMessageToIframe(type, value) {
    $iframe[0].contentWindow.postMessage(
      {
        type,
        [type === "toggleDrawer" ? "isOpen" : type]: value,
        width: type === "iframeWidth" ? value : undefined,
      },
      SRC
    );
  }

  // Event Handlers
  $(window).on("message", function (event) {
    if (event.originalEvent.origin !== SRC || !event.originalEvent.data) return;
    const { type, isOpen } = event.originalEvent.data;
    if (type === "drawerToggle") {
      isDrawerOpen = isOpen;
      updateIframeStyle();
    }
    if (type === "expandToggle") {
      isExpanded = isOpen;
      updateIframeStyle();
    }
  });

  $(document).on("keydown", function (event) {
    if (event.key === "F1") {
      event.preventDefault();
      toggleDrawer();
    }
  });

  $toggleButton.on("click", toggleDrawer);

  // Custom event for route changes
  $(window).on("routeChanged", function (event, newPath) {
    updateDocumentation(newPath);
  });

  // Initial setup
  updateDocumentation(window.location.hash.slice(1) || "/");
  setTimeout(() => sendMessageToIframe("iframeWidth", iframeWidth), 1000);
});
