document.addEventListener("DOMContentLoaded", () => {
    // Función para calcular el total de cada fila
    function calcularTotalFila(input) {
        const fila = input.closest("tr"); // Encuentra la fila actual
        const precio = parseFloat(fila.querySelector(".price").value) || 0;
        const kilos = parseFloat(fila.querySelector(".kilograms").value) || 0;
        const totalCampo = fila.querySelector(".total-price");

        // Calcula el subtotal y lo muestra en la celda correspondiente
        totalCampo.value = (precio * kilos).toFixed(2);

        calcularTotalCompra();
    }

    // Función para calcular el total de la compra
    function calcularTotalCompra() {
        let total = 0;
        document.querySelectorAll(".total-price").forEach(input => {
            total += parseFloat(input.value) || 0;
        });

        document.getElementById("totalCompra").value = total.toFixed(2);
    }

    // Función para establecer la fecha actual automáticamente en el input de fecha
    function establecerFechaActual() {
        const fechaInput = document.getElementById("fecha");
        const fechaActual = new Date();
        const anio = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        fechaInput.value = `${anio}-${mes}-${dia}`;
    }

    // Llama a la función para establecer la fecha actual al cargar la página
    establecerFechaActual();

    // Escuchar cambios en los inputs de precio y kilos para calcular automáticamente
    document.querySelectorAll(".price, .kilograms").forEach(input => {
        input.addEventListener("input", (event) => {
            calcularTotalFila(event.target); // Calcular el total de la fila
        });
    });
});
