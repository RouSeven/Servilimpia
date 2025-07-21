document.addEventListener("DOMContentLoaded", () => {
    function calcularTotalFila(input) {
        const fila = input.closest("tr");
        const precio = parseFloat(fila.querySelector(".price").value) || 0;
        const kilos = parseFloat(fila.querySelector(".kilograms").value) || 0;
        const totalCampo = fila.querySelector(".total-price");
        totalCampo.value = (precio * kilos).toFixed(2);
        calcularTotalCompra();
    }

    function calcularTotalCompra() {
        let total = 0;
        document.querySelectorAll(".total-price").forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        document.getElementById("totalCompra").value = total.toFixed(2);
    }

    function establecerFechaActual() {
        const fechaInput = document.getElementById("fecha");
        const fechaActual = new Date();
        const anio = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        fechaInput.value = `${anio}-${mes}-${dia}`;
    }

    // Permitir solo números y punto decimal
    function permitirSoloNumeros(inputSelector) {
        document.querySelectorAll(inputSelector).forEach(input => {
            input.addEventListener("keypress", (e) => {
                const char = String.fromCharCode(e.which);
                const esNumero = /\d/.test(char);
                const esPunto = char === ".";

                if (!esNumero && (!esPunto || input.value.includes("."))) {
                    e.preventDefault();
                }
            });
        });
    }

    establecerFechaActual();

    document.querySelectorAll(".price, .kilograms").forEach(input => {
        input.addEventListener("input", (event) => {
            calcularTotalFila(event.target);
        });
    });

    permitirSoloNumeros(".price");
    permitirSoloNumeros(".kilograms");
    permitirSoloNumeros(".total-price");

    document.getElementById("btnCalculate").addEventListener("click", calcularTotalCompra);
    document.getElementById("btnPrint").addEventListener("click", generarYImprimirTicket);

    function generarYImprimirTicket() {
        document.getElementById("ticket-num").innerText = document.getElementById("num").value;
        document.getElementById("ticket-chofer").innerText = document.getElementById("chofer").value;
        document.getElementById("ticket-fecha").innerText = document.getElementById("fecha").value;

        const filas = document.querySelectorAll("tbody tr");
        let contenidoTabla = "|Material  | $  |Kgs| T-K |\n|----------|----|---|------|\n";

        filas.forEach(fila => {
            const mat = fila.querySelector("td:first-child input")?.value || fila.querySelector("td:first-child");
            const precio = fila.querySelector(".price").value || "0";
            const kilos = fila.querySelector(".kilograms").value || "0";
            const total = fila.querySelector(".total-price").value || "0";

            if (mat && (parseFloat(kilos) > 0 || parseFloat(total) > 0)) {
                const matStr = mat.padEnd(9, " ").slice(0, 9);
                const precioStr = precio.padStart(4, " ").slice(0, 4);
                const kiloStr = kilos.padStart(3, " ").slice(0, 3);
                const totalStr = total.padStart(5, " ").slice(0, 5);
                contenidoTabla += `|${matStr}|${precioStr}|${kiloStr}|${totalStr}|\n`;
            }
        });

        document.getElementById("ticket-tabla").innerText = contenidoTabla;
        document.getElementById("ticket-total").innerText = document.getElementById("totalCompra").value;

        document.querySelector(".container").style.display = "none";
        document.getElementById("ticket").style.display = "block";

        window.print();

        window.onafterprint = () => {
            document.querySelector(".container").style.display = "block";
            document.getElementById("ticket").style.display = "none";
        };
    }
});
