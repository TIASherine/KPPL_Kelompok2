const http = require("http");

const PORT = 3000;

const products = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Produk ${i + 1}`,
  price: 10000 + (i % 100) * 5000,
  stock: (i * 7) % 100,
}));

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  res.setHeader("Content-Type", "application/json");

  if (url.pathname === "/") {
    res.writeHead(200);
    return res.end(
      JSON.stringify({
        message: "Product Catalog REST API",
        status: "Running",
        totalProducts: products.length,
        endpoints: [
          "/products",
          "/products/search?q=Produk",
          "/products/report",
        ],
      }),
    );
  }

  if (url.pathname === "/products") {
    res.writeHead(200);
    return res.end(JSON.stringify(products.slice(0, 100)));
  }

  if (url.pathname === "/products/search") {
    const query = (url.searchParams.get("q") || "").toLowerCase();

    const results = products
      .filter((p) => p.name.toLowerCase().includes(query))
      .slice(0, 100);

    res.writeHead(200);
    return res.end(JSON.stringify(results));
  }

  if (url.pathname === "/products/report") {
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    res.writeHead(200);
    return res.end(
      JSON.stringify({
        totalProducts: products.length,
        totalInventoryValue: totalValue,
      }),
    );
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`API berjalan di http://localhost:${PORT}`);
});
