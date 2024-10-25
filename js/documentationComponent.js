// Asegúrate de incluir jQuery en tu proyecto antes de este script

$(document).ready(function () {
  // Constants
  const SRC = "https://main.d34cc6cn7jf06y.amplifyapp.com/"; // Ajusta esto según tu configuración
  const TOKEN = "1bca95bb-64c8-4724-90ff-17065efac630"; // Reemplaza con tu token real
  const collectionId = "1954a09c-0ad3-4a07-ad77-53e380e0d6a5";
  const iframeWidth = 600;

  // State
  window.isDrawerOpen = false;
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

  // Make toggleDrawer global
  window.toggleDrawer = function () {
    window.isDrawerOpen = !window.isDrawerOpen;
    updateIframeStyle();
    sendMessageToIframe("toggleDrawer", window.isDrawerOpen);
    sendMessageToIframe("token", TOKEN);
    sendMessageToIframe("iframeWidth", iframeWidth);
    sendMessageToIframe("collectionId", collectionId);
  };

  function updateIframeStyle() {
    $iframe.css({
      width: window.isDrawerOpen
        ? isExpanded
          ? "100%"
          : `${iframeWidth}px`
        : "0",
      opacity: window.isDrawerOpen ? 1 : 0,
      visibility: window.isDrawerOpen ? "visible" : "hidden",
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
      window.isDrawerOpen = isOpen;
      updateIframeStyle();
    }
    if (type === "expandToggle") {
      isExpanded = isOpen;
      updateIframeStyle();
    }
  });

  // Add iframe load error handler
  $iframe.on("error", function () {
    console.error("Error al cargar el iframe.");
  });

  // Add iframe load event to ensure iframeWidth is set after load
  $iframe.on("load", function () {
    sendMessageToIframe("iframeWidth", iframeWidth);
  });

  $(document).on("keydown", function (event) {
    if (event.key === "F1") {
      event.preventDefault();
      window.toggleDrawer();
    }
  });

  $toggleButton.on("click", window.toggleDrawer);

  // Custom event for route changes
  $(window).on("routeChanged", function (event, newPath) {
    updateDocumentation(newPath);
  });

  // Initial setup
  updateDocumentation(window.location.hash.slice(1) || "/");
});
