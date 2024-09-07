$(document).ready(function () {
  const routes = {
    "/": "Home",
    "/camunda": "Camunda",
    "/fixed-3": "Fixed-3",
  };

  function router() {
    let path = window.location.hash.slice(1) || "/";
    $("#content").html(
      `<h2>${routes[path]}</h2><p>This is the ${routes[path]} page content.</p>`
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
