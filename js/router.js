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

    // Disparar el evento routeChanged para el componente de documentación
    $(window).trigger("routeChanged", [path]);
  }

  function handleNavigation(e) {
    e.preventDefault();
    window.location.hash = $(this).attr("href");
  }

  $("nav").on("click", "a", handleNavigation);
  $(window).on("hashchange", router);
  $(window).on("load", router);
});
