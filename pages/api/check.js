export default async function handler(req, res) {
    const { url } = req.query;
  
    if (!url) return res.status(400).json({ error: "URL manquante" });
  
    try {
      const response = await fetch(url, { method: "HEAD", timeout: 5000 });
      res.status(200).json({ status: response.status, up: response.ok });
    } catch (error) {
      res.status(200).json({ status: null, up: false, error: "Inaccessible" });
    }
  }
  