export default async function handler(req, res) {
  try {
    // Fetch products from the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    res.status(200).json(products);
  } catch (error) {
    console.error("PRODUCT FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}
