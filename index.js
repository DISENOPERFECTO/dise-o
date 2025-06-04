import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";

const tecnicasExplicacion = {
  Sublimación: "La sublimación es una técnica que transfiere diseños en alta calidad a través de calor, usando tintas especiales que se convierten en gas y se adhieren permanentemente a superficies como cerámicas, textiles o metales. Ideal para detalles vibrantes y duraderos.",
  "DTF Textil": "Direct to Film (DTF) Textil implica imprimir un diseño en una película especial y luego transferirlo a textiles mediante calor. Es perfecto para colores brillantes y texturas suaves en playeras y otros tejidos.",
  "DTF UV": "DTF UV utiliza tintas curadas con luz ultravioleta para transferir diseños a superficies variadas, incluyendo textiles y objetos rígidos. Ofrece alta resistencia y acabados únicos con menos calor.",
  "Vinil Imprimible": "El vinil imprimible permite cortar e imprimir diseños que se aplican con calor a textiles. Es ideal para personalizaciones duraderas con acabados mate o brillantes, como nombres o logotipos.",
};

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [disenoPersonalizado, setDisenoPersonalizado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [config, setConfig] = useState({
    numeroWhatsApp: "527205624565",
    porcentajeDeposito: 50,
  });

  useEffect(() => {
    // Cargar productos y configuración desde el backend
    const fetchData = async () => {
      const productosRes = await axios.get("/api/productos");
      setProductos(productosRes.data);
      setSeleccionado(productosRes.data[0] || null);

      const configRes = await axios.get("/api/config");
      setConfig(configRes.data);
    };
    fetchData();
  }, []);

  const precioTotal = seleccionado ? seleccionado.precio * cantidad : 0;
  const deposito = precioTotal * (config.porcentajeDeposito / 100);

  const validateForm = () => {
    if (!nombre.trim()) return "El nombre es obligatorio.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Ingresa un correo válido.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setShowModal(true);
  };

  const confirmOrder = async () => {
    const texto = `Hola, me gustaría hacer un pedido:\n\nNombre: ${nombre}\nCorreo: ${email}\nProducto: ${seleccionado.nombre}\nCantidad: ${cantidad}\nTotal: $${precioTotal}\nDepósito requerido (${config.porcentajeDeposito}%): $${deposito}\nDiseño Personalizado: ${disenoPersonalizado || "No especificado"}\nMensaje: ${mensaje}\n\n*Nota*: El pedido se confirmará una vez depositado el ${config.porcentajeDeposito}% del total.`;
    const url = `https://wa.me/${config.numeroWhatsApp}?text=${encodeURIComponent(texto)}`;

    const pedido = {
      nombre,
      email,
      producto: seleccionado.nombre,
      cantidad,
      total: precioTotal,
      deposito,
      disenoPersonalizado: disenoPersonalizado || "No especificado",
      mensaje,
    };
    await axios.post("/api/pedidos", pedido);

    window.open(url, "_blank");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto font-sans bg-neutral-900 text-white">
      <img src="/logo.png" alt="Diseño Perfecto" className="mx-auto mb-6 w-40 h-auto" />
      <h1 className="text-4xl font-bold mb-6 text-center">Diseño Perfecto</h1>

      {/* Selección de producto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="producto" className="block text-sm text-gray-300 mb-1">
            Selecciona un producto
          </label>
          <select
            id="producto"
            onChange={(e) =>
              setSeleccionado(productos.find((p) => p.nombre === e.target.value))
            }
            className="bg-neutral-800 text-white border border-gray-700 p-2 rounded w-full focus:ring-2 focus:ring-gray-500"
            value={seleccionado?.nombre || ""}
          >
            {productos.map((producto) => (
              <option key={producto._id} value={producto.nombre}>
                {producto.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cantidad" className="block text-sm text-gray-300 mb-1">
            Cantidad
          </label>
          <input
            id="cantidad"
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="bg-neutral-800 text-white border border-gray-700 p-2 rounded w-full focus:ring-2 focus:ring-gray-500"
            placeholder="Cantidad"
          />
        </div>
      </div>

      {/* Vista previa del producto */}
      {seleccionado && (
        <div className="bg-neutral-800 border border-gray-700 rounded p-6 mb-6 shadow-md flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32">
            <img
              src={seleccionado.imagen}
              alt={seleccionado.nombre}
              className="w-full h-full object-contain rounded"
              onError={(e) => (e.target.src = "/placeholder.png")}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm italic">
              Diseño Perfecto
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{seleccionado.nombre}</h2>
            <p className="text-gray-400">Precio unitario: ${seleccionado.precio}</p>
            <p className="text-gray-400">Técnicas: {seleccionado.tecnicas.join(", ")}</p>
            <p className="text-gray-500 mt-2">{seleccionado.descripcion}</p>
            <p className="text-xl text-gray-300 font-bold mt-4">Total: ${precioTotal}</p>
            <p className="text-sm text-yellow-300 mt-2">
              Depósito requerido ({config.porcentajeDeposito}%): ${deposito}
            </p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div className="space-y-6 bg-neutral-800 p-6 rounded shadow-md border border-gray-700">
        <h3 className="text-xl font-semibold">Formulario de Pedido</h3>
        <p className="text-sm text-yellow-300">
          *Nota*: El pedido se confirmará una vez depositado el {config.porcentajeDeposito}% del total.
        </p>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div>
          <label htmlFor="nombre" className="block text-sm text-gray-400 mb-1">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`bg-neutral-700 text-white border ${
              error.includes("nombre") ? "border-red-500" : "border-gray-700"
            } p-2 rounded w-full focus:ring-2 focus:ring-gray-500`}
            placeholder="Tu nombre"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`bg-neutral-700 text-white border ${
              error.includes("correo") ? "border-red-500" : "border-gray-700"
            } p-2 rounded w-full focus:ring-2 focus:ring-gray-500`}
            placeholder="Correo electrónico"
            required
          />
        </div>

        <div>
          <label htmlFor="diseno" className="block text-sm text-gray-400 mb-1">
            Describe tu diseño personalizado
          </label>
          <textarea
            id="diseno"
            value={disenoPersonalizado}
            onChange={(e) => setDisenoPersonalizado(e.target.value)}
            className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full focus:ring-2 focus:ring-gray-500"
            placeholder="Ejemplo: 'Quiero un diseño con mi nombre en rojo y un logo en el centro'"
            rows="4"
          ></textarea>
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm text-gray-400 mb-1">
            Mensaje adicional (opcional)
          </label>
          <textarea
            id="mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full focus:ring-2 focus:ring-gray-500"
            placeholder="Mensaje adicional (opcional)"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-gray-200 text-black font-bold py-2 px-4 rounded w-full flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
        >
          <FaWhatsapp className="text-gray-700" /> Enviar Pedido por WhatsApp
        </button>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-neutral-800 p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmar Pedido</h3>
            <p className="text-gray-400"><strong>Nombre:</strong> {nombre}</p>
            <p className="text-gray-400"><strong>Correo:</strong> {email}</p>
            <p className="text-gray-400"><strong>Producto:</strong> {seleccionado.nombre}</p>
            <p className="text-gray-400"><strong>Cantidad:</strong> {cantidad}</p>
            <p className="text-gray-400"><strong>Total:</strong> ${precioTotal}</p>
            <p className="text-gray-400"><strong>Depósito ({config.porcentajeDeposito}%):</strong> ${deposito}</p>
            <p className="text-gray-400"><strong>Diseño Personalizado:</strong> {disenoPersonalizado || "No especificado"}</p>
            <p className="text-sm text-yellow-300 mt-2">
              *Nota*: El pedido se confirmará una vez depositado el {config.porcentajeDeposito}% del total.
            </p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmOrder}
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sección de técnicas */}
      <div className="mt-12 bg-neutral-800 p-6 rounded shadow-md border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Técnicas de Personalización</h2>
        {Object.entries(tecnicasExplicacion).map(([tecnica, explicacion]) => (
          <div key={tecnica} className="mb-4">
            <h3 className="text-lg font-medium">{tecnica}</h3>
            <p className="text-gray-500">{explicacion}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500">
        <p>
          ¿Eres administrador?{" "}
          <Link href="/admin" className="text-gray-300 hover:underline">
            Gestiona los pedidos aquí
          </Link>
        </p>
        <p className="mt-2 text-xs">© 2025 Diseño Perfecto - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}