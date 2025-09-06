export default function handler(req, res) {
  if (req.method === 'POST') {
    // Pretend we saved the recipe! We'll add the real save later.
    res.status(200).json({ success: true, message: "Recipe saved!" });
  } else {
    res.status(405).end(); // Oops, wrong move!
  }
}