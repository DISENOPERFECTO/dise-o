import dbConnect from "../../../lib/mongodb";
import Pedido from "../../../models/Pedido";
import { sendEmail } from "../../../lib/email";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "PUT") {
    const pedido = await Pedido.findByIdAndUpdate(id, req.body, { new: true });
    if (pedido) {
      // Notificación al cliente
      const clientText = `Hola ${pedido.nombre},\n\nTu pedido ha sido actualizado:\n- Producto: ${pedido.producto}\n- Estado actual: ${pedido.estado}\n\nGracias por tu paciencia!`;
      await sendEmail(pedido.email, "Actualización de Pedido - Diseño Perfecto", clientText);

      // Notificación al administrador
      const adminText = `Pedido actualizado:\n- ID: ${pedido._id}\n- Nombre: ${pedido.nombre}\n- Estado: ${pedido.estado}`;
      await sendEmail(process.env.EMAIL_FROM, "Actualización de Pedido - Diseño Perfecto", adminText);
    }
    res.status(200).json(pedido);
  } else if (req.method === "DELETE") {
    await Pedido.findByIdAndDelete(id);
    res.status(204).end();
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}