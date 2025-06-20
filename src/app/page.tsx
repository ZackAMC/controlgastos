"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tipoGasto, setTipoGasto] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [gasto, setGasto] = useState("");
  const [gastos, setGastos] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [menuActive, setMenuActive] = useState(false);
  const [tipoTarjeta, setTipoTarjeta] = useState("");
  const [limite, setLimite] = useState(0);
  const [gastosDavivienda, setGastosDavivienda] = useState(0);
  const [gastosRappi, setGastosRappi] = useState(0);
  const [popup, setPopup] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [color, setColor] = useState("#fff");
  const [datosCargados, setDatosCargados] = useState(false);

  const API_URL = "https://zackdev.com/api/config.php";

  // Cargar datos iniciales
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setLimite(data.limite || 0);
        setGastos(Array.isArray(data.gastos) ? data.gastos : []);
        setDatosCargados(true);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
      });
  }, []);

  // Calcular totales a partir de los gastos
  useEffect(() => {
    const nuevoTotal = gastos.reduce((acc, gasto) => acc + gasto.cantidad, 0);
    const totalDavivienda = gastos
      .filter((g) => g.tarjeta === "Davivienda")
      .reduce((acc, g) => acc + g.cantidad, 0);
    const totalRappi = gastos
      .filter((g) => g.tarjeta === "Rappi")
      .reduce((acc, g) => acc + g.cantidad, 0);

    setTotal(nuevoTotal);
    setGastosDavivienda(totalDavivienda);
    setGastosRappi(totalRappi);
  }, [gastos]);

  // Calcular porcentaje y color
  useEffect(() => {
    if (!datosCargados || limite <= 0) return;

    const nuevoPorcentaje = Math.min(100, Math.max(0, (total / limite) * 100));
    setPorcentaje(nuevoPorcentaje);

    if (nuevoPorcentaje <= 49) setColor("#fff");
    else if (nuevoPorcentaje <= 69) setColor("#FF6126");
    else setColor("#e91717");
  }, [total, limite, datosCargados]);

  // Guardar automáticamente cada vez que cambian gastos o límite
  useEffect(() => {
    if (!datosCargados) return;
    guardar();
  }, [gastos, limite]);

  const guardar = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limite, gastos }),
      });

      if (!res.ok) {
        console.error("Error al guardar:", await res.text());
      }
    } catch (error) {
      console.error("Error en guardar():", error);
    }
  };

  const agregarGasto = () => {
    setMenuActive(false);

    if (tipoGasto === "" || cantidad <= 0 || gasto === "") {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    const nuevoGasto = {
      id: Date.now(),
      fecha: new Date().toISOString().split("T")[0],
      tipo: tipoGasto,
      cantidad,
      gasto,
      tarjeta: tipoTarjeta,
    };

    setGastos((prev) => [...prev, nuevoGasto]);
    setTipoGasto("");
    setCantidad(0);
    setGasto("");
    setTipoTarjeta("");
  };

  const eliminarGasto = (id: number) => {
    setGastos((prev) => prev.filter((g) => g.id !== id));
  };

  const actionLimite = () => {
    setPopup(false);
    if (limite < 0 || isNaN(limite)) {
      setLimite(0);
    }
  };

  return (
    <div>
      <header className={menuActive ? "active" : ""}>
        <button onClick={() => setMenuActive(!menuActive)}>
          <span>+</span>
        </button>

        <div className="contForm">
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              <span>Tipo</span>
              <select
                onChange={(e) => setTipoGasto(e.target.value)}
                value={tipoGasto}
              >
                <option value="">---</option>
                <option value="Comida">Comida</option>
                <option value="Ocio">Ocio</option>
                <option value="Necesario">Necesario</option>
              </select>
            </label>

            <label>
              <span>Tarjeta</span>
              <select
                onChange={(e) => setTipoTarjeta(e.target.value)}
                value={tipoTarjeta}
              >
                <option value="">---</option>
                <option value="Davivienda">Davivienda</option>
                <option value="Rappi">Rappi</option>
              </select>
            </label>

            <label>
              <span>Cantidad</span>
              <input
                type="number"
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                value={cantidad.toString()}
              />
            </label>

            <label>
              <span>Gasto</span>
              <input
                type="text"
                onChange={(e) => setGasto(e.target.value)}
                value={gasto}
              />
            </label>

            <button onClick={agregarGasto}>Agregar</button>
          </form>
        </div>
      </header>

      <main>
        <div className="valores">
          <div className="total">
            <span>Gastos totales / mes</span>
            <p>${total}</p>
          </div>
          <div className="davivienda">
            <span>Gastos Davivienda / mes</span>
            <p>${gastosDavivienda}</p>
          </div>
          <div className="rappi">
            <span>Gastos Rappi / mes</span>
            <p>${gastosRappi}</p>
          </div>
          <div className="limite">
            <span>Limite de gastos / mes</span>
            <p>
              ${limite} <button onClick={() => setPopup(true)}>Edit</button>
            </p>
          </div>

          <div className="barra">
            <div
              className="prog"
              style={{
                width: `${porcentaje}%`,
                backgroundColor: color,
              }}
            ></div>
          </div>
        </div>

        <div className="gastos">
          {gastos.length === 0 ? (
            <p>No hay gastos registrados.</p>
          ) : (
            <ul>
              {gastos.map((item) => (
                <li key={item.id}>
                  <div className="top">
                    <span>{item.fecha}</span>
                    <span>{item.tipo}</span>
                    <span className="tarjeta">{item.tarjeta}</span>
                    <button onClick={() => eliminarGasto(item.id)}>
                      Eliminar
                    </button>
                  </div>
                  <div className="bot">
                    <span>{item.gasto}</span>
                    <span>${item.cantidad}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={popup ? "popup active" : "popup"}>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              <span>Limite de gastos</span>
              <input
                type="number"
                onChange={(e) => setLimite(parseInt(e.target.value))}
                value={limite.toString()}
              />
              <button onClick={actionLimite}>Guardar</button>
            </label>
          </form>
        </div>
      </main>
    </div>
  );
}
