const modelosPorMarca = {
    tesla: [
      { nombre: "Model S", precio: 520000 },
      { nombre: "Model 3", precio: 530000 },
      { nombre: "Model X", precio: 550000 }
    ],
    byd: [
      { nombre: "Han EV", precio: 465000 },
      { nombre: "Tang EV", precio: 470000 },
      { nombre: "Yuan Plus EV", precio: 475000 }
    ],
    ferrari: [
      { nombre: "SF90 Stradale", precio: 715000 },
      { nombre: "F8 Tributo", precio: 720000 },
      { nombre: "Roma", precio: 700000 }
    ],
    mercedes: [
      { nombre: "EQS", precio: 620000 },
      { nombre: "Clase C Híbrido Enchufable", precio: 630000 },
      { nombre: "Clase C", precio: 610000 }
    ]
  };
  
  document.getElementById("marca").addEventListener("change", function () {
    const marca = this.value;
    const modelos = modelosPorMarca[marca];
    const modeloSelect = document.getElementById("modelo");
    const contenedor = document.getElementById("modelo-container");
  
    modeloSelect.innerHTML = '<option value="" disabled selected>Selecciona un modelo</option>';
  
    modelos.forEach((modelo) => {
      const option = document.createElement("option");
      option.value = modelo.nombre;
      option.textContent = modelo.nombre;
      option.setAttribute("data-precio", modelo.precio);
      modeloSelect.appendChild(option);
    });
  
    contenedor.style.display = "block";
    document.getElementById("precio-por-dia").textContent = "";
  });
  
  document.getElementById("modelo").addEventListener("change", function () {
    const precio = this.selectedOptions[0].getAttribute("data-precio");
    const nombre = this.value;
    document.getElementById("precio-por-dia").textContent = `Precio por día de ${nombre}: $${parseInt(precio).toLocaleString()} COP`;
  });
  
  document.getElementById("cotizacionForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const modelo = document.getElementById("modelo");
    const precioDia = parseInt(modelo.selectedOptions[0].getAttribute("data-precio"));
    const inicio = new Date(document.getElementById("inicio").value);
    const fin = new Date(document.getElementById("fin").value);
    const dias = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
  
    if (isNaN(dias) || dias <= 0) {
      alert("Por favor selecciona un rango válido de fechas.");
      return;
    }
  
    let totalCOP = precioDia * dias;
    if (document.getElementById("seguro").checked) totalCOP += 50000;
    if (document.getElementById("conductor").checked) totalCOP += 30000;
  
    try {
      const res = await fetch("https://api.exchangerate.host/latest?base=COP&symbols=USD");
      const data = await res.json();
      const tasa = data.rates.USD;
      const totalUSD = (totalCOP * tasa).toFixed(2);
  
      document.getElementById("resultadoCotizacion").innerHTML = `
        <strong>Resumen:</strong><br>
        Vehículo: ${modelo.value}<br>
        Días: ${dias}<br>
        Total en COP: $${totalCOP.toLocaleString()}<br>
        Total en USD: $${totalUSD}
      `;
    } catch (error) {
      console.error("Error al obtener la tasa de cambio:", error);
      alert("No se pudo obtener la tasa de cambio. Intenta más tarde.");
    }
  });
  