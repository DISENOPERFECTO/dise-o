import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  producto: { type: String, required: true },
  cantidad: { type: Number, required: true },
  total: { type: Number, required: true },
  deposito: { type: Number, required: true },
  disenoPersonalizado: { type: String, default: "No especificado" },
  mensaje: { type: String },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: "Pendiente" },
});

export default mongoose.models.Pedido || mongoose.model("Pedido", PedidoSchema);