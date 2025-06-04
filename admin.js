import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import axios from "axios";

export default function Admin() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("pedidos");
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [newProducto, setNewProducto] = useState({
    nombre: "",
    precio: "",
    tecnicas: "",
    descripcion: "",
    imagen: "",
  });
  const [editingProducto, setEditingProducto] = useState(null);
  const [config, setConfig] = useState({
    numeroWhatsApp: "527205624565",
    porcentajeDeposito: 50,
  });
  const [newPassword, setNewPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const pedidosRes = await axios.get("/api/pedidos");
        setPedidos(pedidosRes.data);

        if (session.user.role === "admin") {
          const productosRes = await axios.get("/api/productos");
          setProductos(productosRes.data);

          const configRes = await axios.get("/api/config");
          setConfig(configRes.data);
        }
      };
      fetchData();
    }
  }, [session]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      email: process.env.ADMIN_EMAIL,
      password: newPassword,
      redirect: false,
    });
  };

  const handleAddProducto = async (e) => {
    e.preventDefault();
    if (session.user.role !== "admin") return;

    const formData = new FormData();
    formData.append("file", imageFile);
    const uploadRes = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const producto = {
      nombre: newProducto.nombre,
      precio: Number(newProducto.precio),
      tecnicas: newProducto.tecnicas.split(",").map((t) => t.trim()),
      descripcion: newProducto.descripcion,
      imagen: uploadRes.data.url,
    };
    const res = await axios.post("/api/productos", producto);
    setProductos([...productos, res.data]);
    setNewProducto({ nombre: "", precio: "", tecnicas: "", descripcion: "", imagen: "" });
    setImageFile(null);
  };

  const handleEditProducto = (producto) => {
    if (session.user.role !== "admin") return;
    setEditingProducto(producto);
    setNewProducto({
      nombre: producto.nombre,
      precio: producto.precio,
      tecnicas: producto.tecnicas.join(", "),
      descripcion: producto.descripcion,
      imagen: producto.imagen,
    });
  };

  const handleUpdateProducto = async (e) => {
    e.preventDefault();
    if (session.user.role !== "admin") return;

    let imagenUrl = newProducto.imagen;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imagenUrl = uploadRes.data.url;
    }

    const updatedProducto = {
      nombre: newProducto.nombre,
      precio: Number(newProducto.precio),
      tecnicas: newProducto.tecnicas.split(",").map((t) => t.trim()),
      descripcion: newProducto.descripcion,
      imagen: imagenUrl,
    };
    const res = await axios.put(`/api/productos/${editingProducto._id}`, updatedProducto);
    setProductos(productos.map((p) => (p._id === editingProducto._id ? res.data : p)));
    setEditingProducto(null);
    setNewProducto({ nombre: "", precio: "", tecnicas: "", descripcion: "", imagen: "" });
    setImageFile(null);
  };

  const handleDeleteProducto = async (id) => {
    if (session.user.role !== "admin") return;
    await axios.delete(`/api/productos/${id}`);
    setProductos(productos.filter((p) => p._id !== id));
  };

  const updateOrderStatus = async (id, newStatus) => {
    const res = await axios.put(`/api/pedidos/${id}`, { estado: newStatus });
    setPedidos(pedidos.map((pedido) => (pedido._id === id ? res.data : pedido)));
  };

  const deleteOrder = async (id) => {
    await axios.delete(`/api/pedidos/${id}`);
    setPedidos(pedidos.filter((pedido) => pedido._id !== id));
  };

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    if (session.user.role !== "admin") return;
    await axios.post("/api/config", { key: "numeroWhatsApp", value: config.numeroWhatsApp });
    await axios.post("/api/config", { key: "porcentajeDeposito", value: config.porcentajeDeposito });
    alert("Configuración actualizada");
  };

  if (!session) {
    return (
      <div className="min-h-screen p-6 max-w-md mx-auto font-sans bg-neutral-900 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Acceso Administrador - Diseño Perfecto</h1>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-neutral-800 p-6 rounded shadow-md border border-gray-700">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={process.env.ADMIN_EMAIL}
              disabled
              className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full focus:ring-2 focus:ring-gray-500"
              placeholder="Ingresa la contraseña"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded w-full hover:bg-gray-500"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto font-sans bg-neutral-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Panel de Administración - Diseño Perfecto</h1>
      <div className="flex justify-between mb-6">
        <Link href="/" className="text-gray-300 hover:underline">
          Volver a la página principal
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin" })}
          className="bg-gray-600 text-white py-1 px-3 rounded hover:bg-gray-500"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Pestañas */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("pedidos")}
          className={`py-2 px-4 rounded ${activeTab === "pedidos" ? "bg-gray-700" : "bg-gray-800"} hover:bg-gray-600`}
        >
          Pedidos
        </button>
        {session.user.role === "admin" && (
          <>
            <button
              onClick={() => setActiveTab("catalogo")}
              className={`py-2 px-4 rounded ${activeTab === "catalogo" ? "bg-gray-700" : "bg-gray-800"} hover:bg-gray-600`}
            >
              Catálogo
            </button>
            <button
              onClick={() => setActiveTab("configuracion")}
              className={`py-2 px-4 rounded ${activeTab === "configuracion" ? "bg-gray-700" : "bg-gray-800"} hover:bg-gray-600`}
            >
              Configuración
            </button>
          </>
        )}
      </div>

      {/* Sección Pedidos */}
      {activeTab === "pedidos" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Gestionar Pedidos</h2>
          {pedidos.length === 0 ? (
            <p className="text-gray-500 text-center">No hay pedidos registrados.</p>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido._id} className="bg-neutral-800 border border-gray-700 rounded p-4 shadow-md">
                  <p className="text-gray-400"><strong>ID:</strong> {pedido._id}</p>
                  <p className="text-gray-400"><strong>Nombre:</strong> {pedido.nombre}</p>
                  <p className="text-gray-400"><strong>Correo:</strong> {pedido.email}</p>
                  <p className "text-gray-400"><strong>Producto:</strong> {pedido.producto}</p>
                  <p className="text-gray-400"><strong>Cantidad:</strong> {pedido.cantidad}</p>
                  <p className="text-gray-400"><strong>Total:</strong> ${pedido.total}</p>
                  <p className="text-gray-400"><strong>Depósito:</strong> ${pedido.deposito}</p>
                  <p className="text-gray-400"><strong>Diseño Personalizado:</strong> {pedido.disenoPersonalizado}</p>
                  <p className="text-gray-400"><strong>Mensaje:</strong> {pedido.mensaje || "N/A"}</p>
                  <p className="text-gray-400"><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
                  <p className="text-gray-400"><strong>Estado:</strong> {pedido.estado}</p>
                  <div className="flex gap-2 mt-2">
                    <select
                      value={pedido.estado}
                      onChange={(e) => updateOrderStatus(pedido._id, e.target.value)}
                      className="bg-neutral-700 text-white border border-gray-700 p-1 rounded"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmado">Confirmado</option>
                      <option value="Completado">Completado</option>
                    </select>
                    <button
                      onClick={() => deleteOrder(pedido._id)}
                      className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-gray-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sección Catálogo */}
      {activeTab === "catalogo" && session.user.role === "admin" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Gestionar Catálogo</h2>
          <form
            onSubmit={editingProducto ? handleUpdateProducto : handleAddProducto}
            className="space-y-4 bg-neutral-800 p-6 rounded shadow-md border border-gray-700 mb-6"
          >
            <h3 className="text-lg font-medium">{editingProducto ? "Editar Producto" : "Agregar Producto"}</h3>
            <div>
              <label htmlFor="nombreProducto" className="block text-sm text-gray-400 mb-1">
                Nombre
              </label>
              <input
                id="nombreProducto"
                type="text"
                value={newProducto.nombre}
                onChange={(e) => setNewProducto({ ...newProducto, nombre: e.target.value })}
                className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="precioProducto" className="block text-sm text-gray-400 mb-1">
                Precio
              </label>
              <input
                id="precioProducto"
                type="number"
                value={newProducto.precio}
                onChange={(e) => setNewProducto({ ...newProducto, precio: e.target.value })}
                className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="tecnicasProducto" className="block text-sm text-gray-400 mb-1">
                Técnicas (separadas por comas)
              </label>
              <input
                id="tecnicasProducto"
                type="text"
                value={newProducto.tecnicas}
                onChange={(e) => setNewProducto({ ...newProducto, tecnicas: e.target.value })}
                className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full"
                placeholder="Ej: Sublimación, DTF Textil"
                required
              />
            </div>
            <div>
              <label htmlFor="descripcionProducto" className="block text-sm text-gray-400 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcionProducto"
                value={newProducto.descripcion}
                onChange={(e) => setNewProducto({ ...newProducto, descripcion: e.target.value })}
                className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full"
                rows="3"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="imagenProducto" className="block text-sm text-gray-400 mb-1">
                Imagen del Producto
              </label>
              <input
                id="imagenProducto"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full"
              />
              {newProducto.imagen && (
                <img src={newProducto.imagen} alt="Vista previa" className="mt-2 w-32 h-32 object-contain" />
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                {editingProducto ? "Actualizar Producto" : "Agregar Producto"}
              </button>
              {editingProducto && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProducto(null);
                    setNewProducto({ nombre: "", precio: "", tecnicas: "", descripcion: "", imagen: "" });
                    setImageFile(null);
                  }}
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            {productos.map((producto) => (
              <div key={producto._id} className="bg-neutral-800 border border-gray-700 rounded p-4 shadow-md">
                <p className="text-gray-400"><strong>Nombre:</strong> {producto.nombre}</p>
                <p className="text-gray-400"><strong>Precio:</strong> ${producto.precio}</p>
                <p className="text-gray-400"><strong>Técnicas:</strong> {producto.tecnicas.join(", ")}</p>
                <p className="text-gray-400"><strong>Descripción:</strong> {producto.descripcion}</p>
                <p className="text-gray-400"><strong>Imagen:</strong> <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-contain inline-block" /></p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditProducto(producto)}
                    className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProducto(producto._id)}
                    className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-gray-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección Configuración */}
      {activeTab === "configuracion" && session.user.role === "admin" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Configuración</h2>
          <form onSubmit={handleUpdateConfig} className="space-y-4 bg-neutral-800 p-6 rounded shadow-md border border-gray-700">
            <div>
              <label htmlFor="numeroWhatsApp" className="block text-sm text-gray-400 mb-1">
                Número de WhatsApp
              </label>
              <input
                id="numeroWhatsApp"
                type="text"
                value={config.numeroWhatsApp}
                onChange={(e) => setConfig({ ...config, numeroWhatsApp: e.target.value })}
                className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="porcentajeDeposito" className="block text-sm text-gray-400 mb-1">
                Porcentaje de Depósito (%)
              </label>
              <input
                id="porcentajeDeposito"
                type="number"
                min="1"
                max="100"
                value={config.porcentajeDeposito}
                onChange={(e) => setConfig({ ...config, porcentajeDeposito: Number(e.target.value) })}
                className="bg-neutral-700 text-white border border-gray-700 p-2 rounded w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Guardar Configuración
            </button>
          </form>
        </div>
      )}
    </div>
  );
}