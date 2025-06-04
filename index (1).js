import dbConnect from "../../../lib/mongodb";
import Producto from "../../../models/Producto";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const productos = await Producto.find({});
    res.status(200).json(productos);
  } else if (req.method === "POST") {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}