$(document).ready(function () {
  // Mostrar spinner de carga
  $("#lista-peliculas").html(`
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">Cargando peliculas...</p>
    </div>
  `);

    // Manejo de la alerta de bienvenida con persistencia
    if (!localStorage.getItem("bienvenidaMostrada")) {
      $("#alertaBienvenida").removeClass("d-none").hide().slideDown();
      localStorage.setItem("bienvenidaMostrada", "true");
    }

  // Simulacion de retraso 
  setTimeout(() => {
    $.ajax({
      url: "data/peliculas.json",
      method: "GET",
      dataType: "json",
      success: function (peliculas) {
        let html = "";
        const hoy = new Date();
        peliculas.forEach(function (peli) {
          // Logica para la fecha de estreno
          const fechaEstreno = new Date(peli.estreno);
          const esEstreno = hoy < fechaEstreno;
          const precio = esEstreno ? peli.precio.estreno : peli.precio.normal;
          // Convertir arreglo de generos en texto legible
          const generosTexto = Array.isArray(peli.genero) ? peli.genero.join(", ") : "Sin géneros";
          html += `
            <div class="col-md-4">
              <div class="card h-100 shadow">
                <img src="img/${peli.imagen}" class="card-img-top" alt="${peli.titulo}">
                <div class="card-body">
                  <h5 class="card-title">${peli.titulo}</h5>
                  <p class="card-text"><strong>Géneros:</strong> ${generosTexto}</p>
                  <p class="card-text"><strong>Estreno:</strong> ${peli.estreno}</p>
                  <p class="card-text"><strong>Precio:</strong> $${precio.toFixed(2)}</p>
                  <a href="pages/detalle.html?id=${peli.id}" class="btn btn-primary">Ver más</a>
                  <button class="btn btn-primary ver-trailer"
                    data-bs-toggle="modal"
                    data-bs-target="#modalTrailer"
                    data-trailer="${peli.trailer}">Ver Trailer</button>
                </div>
              </div>
            </div>`;
        });
        $("#lista-peliculas").hide().html(html).fadeIn(1000); // Animacion de entrada
      },
      error: function (xhr, status, error) {
        console.error("Error al cargar las películas:", error);
        $("#lista-peliculas").html(`
          <div class="col-12">
            <div class="alert alert-danger text-center" role="alert">
              No se pudo cargar la lista de películas. Intenta nuevamente más tarde.
            </div>
          </div>
        `);
      }
    });
  }, 1000); //1 segundo de espera

  // Evento para abrir el modal del tráiler
  $(document).on("click", ".ver-trailer", function () {
    const url = $(this).data("trailer");
    $("#iframeTrailer").attr("src", url);

    //Cerrar el modal
    $('#modalTrailer').on('hidden.bs.modal', function () {
      $("#iframeTrailer").attr("src", "");
    });

  });
});