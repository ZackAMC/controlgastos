"use client"
import { useState } from "react";
import styles from "./page.module.css";


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


  const agregarGasto = () => {
    setMenuActive(false)
    if (tipoGasto === "" || cantidad <= 0 || gasto === "") {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    const nuevoGasto = {
      id: Date.now(),
      fecha:  new Date().toLocaleDateString(),
      tipo: tipoGasto,
      cantidad: cantidad,
      gasto: gasto,
      tarjeta: tipoTarjeta,
    };

    setGastos([...gastos, nuevoGasto]);
    setTotal(total + cantidad);
    setTipoGasto("");
    setCantidad(0);
    setGasto("")
    setTipoTarjeta("");


    if (tipoTarjeta === "Davivienda") {
      setGastosDavivienda(gastosDavivienda + cantidad);
    } else if (tipoTarjeta === "Rappi") {
      setGastosRappi(gastosRappi + cantidad);
    }

  };

  const eliminarGasto = (id: number) => {
    const gastoEliminado = gastos.find(g => g.id === id);
    if (gastoEliminado) {
      setGastos(gastos.filter(g => g.id !== id));
      setTotal(total - gastoEliminado.cantidad);
      if (gastoEliminado.tarjeta === "Davivienda") {
        setGastosDavivienda(gastosDavivienda - gastoEliminado.cantidad);
      } else if (gastoEliminado.tarjeta === "Rappi") {
        setGastosRappi(gastosRappi - gastoEliminado.cantidad);
      }
    }
  };


  const actionLimite = () => {
    popup ? setPopup(false) : setPopup(true)
    if (limite < 0 || isNaN(limite)) {
      setLimite(0);
      return;
    }
  };

  return (
    <div>
      <header className={menuActive ? "active" : ""}>
          <button onClick={() => menuActive ? setMenuActive(false) : setMenuActive(true)}>
            <span>+</span>
          </button>

          <div className={"contForm"}>
            <form onSubmit={(e) => e.preventDefault()}>

                <label>
                  <span>Tipo</span>
                  <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setTipoGasto(e.target.value)}}
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
                  <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setTipoTarjeta(e.target.value)}}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setCantidad(parseInt(e.target.value))}}
                    value={cantidad.toString()}
                  />
                </label>

                <label>
                  <span>Gasto</span>
                  <input
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setGasto(e.target.value)}}
                    value={gasto}
                  />
                </label>

                <button onClick={() => agregarGasto()}>
                  Agregar
                </button>

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
            <p>${limite} <button onClick={()=>setPopup(true)}>Edit</button></p>
          </div>

          <div className="barra">
            <div className="prog"></div>
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
                    <span>{item.tarjeta}</span>
                    <button onClick={() => eliminarGasto(item.id)}>Eliminar</button>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setLimite(parseInt(e.target.value))}}
                value={limite.toString()}
              />
              <button onClick={() => {actionLimite()}}>Guardar</button>
            </label>
          </form>
        </div>
      </main>


    </div>
  );
}
