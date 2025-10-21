$(document).ready(function() {
    let peliculaDisponible = [];

    // Cargar peliculas desde el JSON
    $.ajax({
        url: "../data/peliculas.json",
        method: "GET",
        dataType: "json",
        success: function(peliculas) {
            peliculaDisponible = peliculas;
            peliculas.forEach(function (peli) {
                $("#pelicula").append(`
                    <option value="${peli.id}">${peli.titulo}</option>
                `);
    });
        // Inicializar Select2 para el select de películas
        $('#pelicula').select2({
            placeholder: "Seleccione una o más películas",
            width: '100%'
        });
        },
        error: function() {
            alert("Error al cargar las películas. Intenta nuevamente más tarde.");
        }
    });

    // Manejar el envio del formulario
    $('#form-renta').submit(function(e) {
        e.preventDefault();

        const nombre = $("#nombre").val();
        const correo = $("#correo").val();
        const dias = parseInt($("#dias").val());
        const formaPago = $("#pago").val();
        const seleccionadas = $("#pelicula").val(); // Obtener todas las peliculas seleccionadas

        let total = 0;
        let listaPeliculas = "";

        const hoy = new Date();

        seleccionadas.forEach(function(id) {
            const peli = peliculaDisponible.find((p) => p.id == id);
            if (peli) {
                const fechaEstreno = new Date(peli.estreno);
                const esEstreno = hoy < fechaEstreno;
                const precio = esEstreno ? peli.precio.estreno : peli.precio.normal;
                total += precio * dias;
                listaPeliculas += `<li>${peli.titulo} - $${precio.toFixed(2)} x ${dias} días</li>`;
            }
        });

        // Mostrar resumen de la renta
        $("#resumenContenido").html(`
            <p><strong>Cliente:</strong> ${nombre}</p>
            <p><strong>Correo:</strong> ${correo}</p>
            <p><strong>Método de Pago:</strong> ${formaPago.charAt(0).toUpperCase() + formaPago.slice(1)}</p>
            <p><strong>Películas Rentadas:</strong></p>
            <ul>${listaPeliculas}</ul>
            <p><strong>Total a Pagar:</strong> $${total.toFixed(2)}</p>
        `);

        const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
        modal.show();

        // Manejar confirmación de la renta
        $('#btn-confirmar').off('click').on('click', function() {
            $('#alerta').removeClass('d-none').hide().fadeIn();
            setTimeout(() => $('#alerta').fadeOut(), 2000);
            $('#form-renta')[0].reset();
            $('#pelicula').val(null).trigger('change'); // Resetear Select2
            modal.hide();
        });
    });
});