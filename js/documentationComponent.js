$(document).ready(function () {
  // Constants
  const SRC = "https://main.d34cc6cn7jf06y.amplifyapp.com/";
  const TOKEN = "1bca95bb-64c8-4724-90ff-17065efac630";
  const collectionId = "1954a09c-0ad3-4a07-ad77-53e380e0d6a5";
  const iframeWidth = 600;
  let originsSRC = ["amplifyapp"];

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
    src: SRC, // Set initial src
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
    const targetUrl = `${SRC}${route}`;
    console.log("Setting iframe src to:", targetUrl);
    $iframe.attr("src", targetUrl);
  }

  // Make toggleDrawer global
  window.toggleDrawer = function () {
    window.isDrawerOpen = !window.isDrawerOpen;
    updateIframeStyle();

    // Asegurarse de que el iframe esté cargado antes de enviar mensajes
    if ($iframe[0].contentWindow) {
      try {
        sendMessageToIframe("toggleDrawer", window.isDrawerOpen);
        sendMessageToIframe("token", TOKEN);
        sendMessageToIframe("iframeWidth", iframeWidth);
        sendMessageToIframe("collectionId", collectionId);
      } catch (error) {
        console.error("Error sending message to iframe:", error);
      }
    }
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
    if (!$iframe[0].contentWindow) {
      console.warn("Iframe contentWindow not available");
      return;
    }

    const message = {
      type,
      [type === "toggleDrawer" ? "isOpen" : type]: value,
      width: type === "iframeWidth" ? value : undefined,
    };

    try {
      console.log("Sending message to iframe:", message);
      $iframe[0].contentWindow.postMessage(message, SRC);
    } catch (error) {
      console.error("Error in sendMessageToIframe:", error);
    }
  }

  // Event Handlers
  function handleMessageEvent(event) {
    // Verificar el origen del mensaje
    bool = originsSRC.some((origin) => event.origin.includes(origin));
    if (!bool) {
      return;
    }

    if (event.origin != SRC) {
      console.warn(
        "Message received from unauthorized origin ORIGIN:",
        event.origin
      );
      console.warn("Message received from unauthorized origin SRC:", SRC);
      // return;
    }

    if (!event.data) {
      console.warn("Empty message received");
      // return;
    }

    try {
      const { type, isOpen } = event.data;

      if (type === "drawerToggle") {
        window.isDrawerOpen = !window.isDrawerOpen;
        updateIframeStyle();
      } else if (type === "expandToggle") {
        isExpanded = isOpen;
        updateIframeStyle();
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  // Usar addEventListener en lugar de jQuery para mayor compatibilidad
  window.addEventListener("message", handleMessageEvent, false);

  // Add iframe load error handler
  $iframe.on("error", function (error) {
    console.error("Error loading iframe:", error);
  });

  // Add iframe load event
  $iframe.on("load", function () {
    console.log("Iframe loaded successfully");
    sendMessageToIframe("iframeWidth", iframeWidth);
  });

  // Keyboard shortcut handler
  $(document).on("keydown", function (event) {
    if (event.key === "F1") {
      event.preventDefault();
      window.toggleDrawer();
    }
  });

  // Toggle button click handler
  $toggleButton.on("click", (e) => {
    e.preventDefault();
    window.toggleDrawer();
  });

  // Route change handler
  $(window).on("routeChanged", function (event, newPath) {
    updateDocumentation(newPath);
  });

  // Initial setup
  updateDocumentation(window.location.hash.slice(1) || "/");
});
