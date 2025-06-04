import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  precio: { type: Number, required: true },
  tecnicas: { type: [String], required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
});

export default mongoose.models.Producto || mongoose.model("Producto", ProductoSchema);