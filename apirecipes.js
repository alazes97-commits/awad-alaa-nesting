// api/recipes.js

export default function handler(req, res) {
  if (req.method === "GET") {
    // return dummy recipes for now
    return res.status(200).json([
      { id: 1, name: "Pasta", ingredients: ["Noodles", "Tomato"] },
      { id: 2, name: "Omelette", ingredients: ["Eggs", "Cheese"] },
    ]);
  }

  if (req.method === "POST") {
    // pretend we saved the recipe
    const recipe = req.body;
    return res
      .status(201)
      .json({ message: "Recipe saved!", recipe });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
