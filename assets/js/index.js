$(document).ready(function () {
    // Inicializamos con números reales, no con el texto del HTML
    var valores = {
        presupuesto: 0,
        gastos: 0,
        saldo: 0,
    }
    var gastos = [];

    $("#btn-enviar-submit").on("click", function () {
        const agregarPresupuesto = $("#dato-presupuesto").val();
        if (!agregarPresupuesto || agregarPresupuesto <= 0) {
            alert("Debe ingresar un presupuesto positivo mayor que 0");
            return;
        }
        // Llamamos a la función con el valor convertido
        Presupuesto(parseInt(agregarPresupuesto));
        $("#dato-presupuesto").val("");
    });

    $("#btn-anadir-submit").on("click", function () {
        let nombreGasto = $("#datogasto").val();
        let gastosPorAgregar = $("#gasto-gasto").val();

        if (!nombreGasto || !gastosPorAgregar || gastosPorAgregar <= 0) {
            alert("Debe ingresar un nombre y un valor mayor que 0");
            return;
        }

        let montoGasto = parseInt(gastosPorAgregar);
        let g = agregarGasto(montoGasto);

        if (g.success) {
            gastos.push({
                nombre: nombreGasto,
                valor: montoGasto
            });
            actualizarTabla();
            $("#datogasto").val("");
            $("#gasto-gasto").val("");
        }
    });

    const agregarGasto = (gasto) => {
        // Validar si existe presupuesto inicial
        if (valores.presupuesto <= 0) {
            alert("No puede agregar un gasto si no tiene presupuesto");
            return { success: false };
        }

        // Validar si el saldo alcanza para el nuevo gasto
        let saldoTemporal = valores.presupuesto - valores.gastos;
        if (saldoTemporal < gasto) {
            alert("Saldo insuficiente");
            return { success: false };
        }

        actualizarSaldo(gasto);
        return { success: true };
    };

    const Presupuesto = (monto) => {
        valores.presupuesto += monto;
        $("#valorUno").text(`$ ${valores.presupuesto}`);
        // Al actualizar presupuesto, el saldo también cambia
        recalcularTodo();
    }

    const actualizarTabla = () => {
        let html = "";
        gastos.forEach((gasto, index) => {
            html += `
            <tr>
                <td>${gasto.nombre}</td>
                <td>$ ${gasto.valor}</td>
                <td><button type="button" class="button-eliminar" data-index="${index}">Eliminar</button></td>
            </tr>`;
        });
        $("#tabla-gasto").html(html);

        // Re-asignar evento click a los nuevos botones
        $(".button-eliminar").off("click").click(function () {
            const index = $(this).data("index");
            let valorAEliminar = gastos[index].valor;
            
            gastos.splice(index, 1); // CORREGIDO: ahora elimina 1 elemento
            actualizarTabla();
            actualizarSaldo(null, valorAEliminar);
        });
    };

    const actualizarSaldo = (gasto = null, aumento = null) => {
        if (gasto !== null) {
            valores.gastos += gasto;
        } else if (aumento !== null) {
            valores.gastos -= aumento;
        }
        
        recalcularTodo();
    }

    const recalcularTodo = () => {
        valores.saldo = valores.presupuesto - valores.gastos;
        $("#valorDos").text(`$ ${valores.gastos}`);
        $("#valorTres").text(`$ ${valores.saldo}`);
    }
});