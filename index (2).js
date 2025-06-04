import dbConnect from "../../../lib/mongodb";
import Pedido from "../../../models/Pedido";
import { sendEmail } from "../../../lib/email";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const pedidos = await Pedido.find({});
    res.status(200).json(pedidos);
  } else if (req.method === "POST") {
    const pedido = new Pedido(req.body);
    await pedido.save();

    // Notificación al cliente
    const clientText = `Hola ${pedido.nombre},\n\nTu pedido ha sido recibido:\n- Producto: ${pedido.producto}\n- Cantidad: ${pedido.cantidad}\n- Total: $${pedido.total}\n- Depósito requerido (${process.env.PORCENTAJE_DEPOSITO}%): $${pedido.deposito}\n\nEstado actual: ${pedido.estado}\n\nGracias por tu compra!`;
    await sendEmail(pedido.email, "Confirmación de Pedido - Diseño Perfecto", clientText);

    // Notificación al administrador
    const adminText = `Nuevo pedido recibido:\n- Nombre: ${pedido.nombre}\n- Correo: ${pedido.email}\n- Producto: ${pedido.producto}\n- Cantidad: ${pedido.cantidad}\n- Total: $${pedido.total}\n- Estado: ${pedido.estado}`;
    await sendEmail(process.env.EMAIL_FROM, "Nuevo Pedido - Diseño Perfecto", adminText);

    res.status(201).json(pedido);
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}