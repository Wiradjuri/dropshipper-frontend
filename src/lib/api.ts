export type Product = {
  id: number;
  name: string;
  sku: string;
  price_cents: number;
  currency: string;
  description?: string | null;
  image_url?: string | null;
  stock: number;
};

export type ProductInput = Omit<Product, "id">;

export type OrderItemInput = { product_id: number; quantity: number };
export type Order = {
  id: number;
  status: string;
  currency: string;
  subtotal_cents: number;
  total_cents: number;
  items: Array<{
    id: number;
    product_id: number;
    name: string;
    sku: string;
    price_cents: number;
    quantity: number;
  }>;
  tracking_number?: string | null;
};

export async function getHealth() {
  const res = await fetch("http://localhost:8000/health");
  if (!res.ok) throw new Error("Backend health check failed");
  return res.json();
}

// Product CRUD
const API = "http://localhost:8000";

export async function listProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(data: ProductInput): Promise<Product> {
  const res = await fetch(`${API}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: number, data: Partial<ProductInput>): Promise<Product> {
  const res = await fetch(`${API}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API}/products/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function createOrder(items: OrderItemInput[]): Promise<Order> {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function createCheckoutSession(orderId: number): Promise<{ checkout_url: string }> {
  const res = await fetch(`${API}/checkout/session?order_id=${orderId}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to create checkout session");
  return res.json();
}
