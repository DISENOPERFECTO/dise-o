import dbConnect from "../../../lib/mongodb";
import Config from "../../../models/Config";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const configs = await Config.find({});
    const configMap = configs.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.status(200).json(configMap);
  } else if (req.method === "POST") {
    const { key, value } = req.body;
    await Config.findOneAndUpdate({ key }, { key, value }, { upsert: true });
    res.status(200).json({ message: "Configuración actualizada" });
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}