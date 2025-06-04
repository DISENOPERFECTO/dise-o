import { upload } from "../../../lib/aws";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error al subir la imagen" });
    }
    res.status(200).json({ url: req.file.location });
  });
}