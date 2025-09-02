document.addEventListener("DOMContentLoaded", () => {
    function calcularTotalFila(input) {
        const fila = input.closest("tr");
        const precio = parseFloat(fila.querySelector(".price").value) || 0;
        const kilos = parseFloat(fila.querySelector(".kilograms").value) || 0;
        const totalCampo = fila.querySelector(".total-price");
        totalCampo.value = Math.round(precio * kilos); // 🔹 Redondear sin decimales
        calcularTotalCompra();
        document.getElementById("descuento").addEventListener("input", calcularTotalCompra);
    }
    
    function evaluarDescuento(descuentoTexto) {
        try {
            const resultado = eval(descuentoTexto.replace(/[^0-9+\-*/.]/g, ''));
            return isNaN(resultado) ? 0 : resultado;
        } catch {
            return 0;
        }
    }

    function calcularTotalCompra() {
        let total = 0;
        document.querySelectorAll(".total-price").forEach(input => {
            total += parseFloat(input.value) || 0;
        });

        const subtotalInput = document.getElementById("subtotal");
        const descuentoInput = document.getElementById("descuento");
        const totalCompraInput = document.getElementById("totalCompra");

        const descuento = evaluarDescuento(descuentoInput.value);
        const subtotal = Math.round(total); // 🔹 Entero
        const totalFinal = Math.round(total - descuento); // 🔹 Entero

        subtotalInput.value = subtotal;
        totalCompraInput.value = totalFinal;
    }

    function establecerFechaActual() {
        const fechaInput = document.getElementById("fecha");
        const fechaActual = new Date();
        const anio = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        fechaInput.value = `${anio}-${mes}-${dia}`;
    }

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

    document.getElementById("btnCalculate")?.addEventListener("click", calcularTotalCompra);
    document.getElementById("btnPrint")?.addEventListener("click", generarYImprimirTicket);

    function generarYImprimirTicket() {
        document.getElementById("ticket-num").innerText = document.getElementById("num").value;
        document.getElementById("ticket-chofer").innerText = document.getElementById("chofer").value;
        document.getElementById("ticket-fecha").innerText = document.getElementById("fecha").value;

        const filas = document.querySelectorAll("tbody tr");
        let contenidoTabla = "|Material  | $  |Kgs| T-K |\n|----------|----|---|------|\n";

        filas.forEach(fila => {
            const mat = fila.querySelector("td:first-child input")?.value || fila.querySelector("td:first-child")?.innerText;
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

    // ✅ Bloque para agregar filas dinámicas en "Varios"
    const btnAgregar = document.getElementById("btnAgregarFila");
    const tablaBody = document.querySelector("tbody");
    const filaBoton = document.getElementById("fila-boton");

    if (btnAgregar && tablaBody && filaBoton) {
        btnAgregar.addEventListener("click", () => {
            const nuevaFila = document.createElement("tr");
            nuevaFila.innerHTML = `
              <td><input type="text" class="descrption" placeholder="Varios" /></td>
              <td><input type="text" class="price" inputmode="decimal" /></td>
              <td><input type="text" class="kilograms" inputmode="decimal" /></td>
              <td><input type="text" class="total-price" inputmode="decimal" /></td>
            `;
            tablaBody.insertBefore(nuevaFila, filaBoton);

            // Eventos para la nueva fila
            nuevaFila.querySelectorAll(".price, .kilograms").forEach(input => {
                input.addEventListener("input", (event) => {
                    calcularTotalFila(event.target);
                });
            });

            permitirSoloNumeros(".price");
            permitirSoloNumeros(".kilograms");
            permitirSoloNumeros(".total-price");
        });
    }
});

// ============================
// Bloque de edición de precios
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const priceInputs = document.querySelectorAll(".price");
  const toggleBtn = document.getElementById("toggleEditPrices");

  priceInputs.forEach(input => {
    const material = input.dataset.material;
    if (material) {
      const stored = localStorage.getItem(`precio_${material}`);
      if (stored !== null) {
        input.value = stored;
        input.disabled = true;
        toggleBtn.textContent = "Editar precios";
      }
    }
  });

  toggleBtn.addEventListener("click", () => {
    const isDisabled = priceInputs[0].disabled;
    if (isDisabled) {
      priceInputs.forEach(input => input.disabled = false);
      toggleBtn.textContent = "Guardar precios";
    } else {
      priceInputs.forEach(input => {
        const material = input.dataset.material;
        if (material) {
          localStorage.setItem(`precio_${material}`, input.value);
        }
        input.disabled = true;
      });
      toggleBtn.textContent = "Editar precios";
    }
  });
});

// ============================
// Funciones extra para refresco
// ============================
function refrescarSoloPrecios() {
    const preciosGuardados = JSON.parse(localStorage.getItem("preciosMateriales") || "{}");
    const filas = document.querySelectorAll("#tablaMateriales tbody tr");

    filas.forEach(fila => {
        const celdaNombre = fila.querySelector("td:nth-child(1)");
        const inputPrecio = fila.querySelector("input[type='number']");
        const inputCantidad = fila.querySelector("td:nth-child(3) input");
        const celdaTotal = fila.querySelector("td:nth-child(4)");

        if (inputCantidad) inputCantidad.value = "";
        if (celdaTotal) celdaTotal.textContent = "$0.00";

        if (celdaNombre && inputPrecio) {
            const nombre = celdaNombre.textContent.trim();
            if (preciosGuardados[nombre] !== undefined) {
                inputPrecio.value = preciosGuardados[nombre];
            } else {
                inputPrecio.value = "";
            }
        }
    });

    document.getElementById("subtotal").textContent = "$0.00";
    document.getElementById("totalCompra").textContent = "$0.00";
    const inputDescuento = document.getElementById("descuento");
    if (inputDescuento) inputDescuento.value = "";
}

window.addEventListener("DOMContentLoaded", function () {
    const preciosGuardados = JSON.parse(localStorage.getItem("preciosMateriales") || "{}");
    const filas = document.querySelectorAll("#tablaMateriales tbody tr");

    filas.forEach(fila => {
        const nombre = fila.querySelector("td:nth-child(1)").textContent.trim();
        const inputPrecio = fila.querySelector("input[type='number']");
        if (preciosGuardados[nombre] !== undefined && inputPrecio) {
            inputPrecio.value = preciosGuardados[nombre];
        }
    });
});
