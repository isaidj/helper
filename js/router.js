$(document).ready(function () {
  const routes = {
    "/home": "inicio",
    "/gestion-presupuestal": "modulo-gestion",
    "/gestion-contable": "administracion-contable",
  };

  function router() {
    let path = window.location.hash.slice(1) || "/";
    $("#content").html(
      ` <img
        src="./images/${routes[path]}.png"
        alt="imagen1"
        style="width: 100%; height: 100%"
      />`
    );

    // Cerrar el iframe
    closeIframe();

    // Disparar el evento routeChanged para el componente de documentación
    $(window).trigger("routeChanged", [path]);
  }

  function handleNavigation(e) {
    e.preventDefault();
    window.location.hash = $(this).attr("href");
  }

  function closeIframe() {
    // Asumimos que la función toggleDrawer está disponible globalmente
    if (typeof window.toggleDrawer === "function" && isDrawerOpen) {
      window.toggleDrawer();
    }
  }

  $("nav").on("click", "a", handleNavigation);
  $(window).on("hashchange", router);
  $(window).on("load", router);
});
