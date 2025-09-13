"use client";
import { useEffect, useState, FormEvent } from "react";
import { listProducts, createProduct, updateProduct, deleteProduct, type Product, type ProductInput } from "../../../lib/api";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>({ name: "", sku: "", price_cents: 0, currency: "USD", stock: 0 });
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setProducts(await listProducts());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (editing) {
        await updateProduct(editing, form);
      } else {
        await createProduct(form);
      }
      setForm({ name: "", sku: "", price_cents: 0, currency: "USD", stock: 0 });
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function handleEdit(p: Product) {
    setForm({
      name: p.name,
      sku: p.sku,
      price_cents: p.price_cents,
      currency: p.currency,
      stock: p.stock,
    });
    setEditing(p.id);
  }
  async function handleDelete(id: number) {
    await deleteProduct(id);
    await load();
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products Admin</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input className="border p-1 w-full" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="border p-1 w-full" placeholder="SKU" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} required />
        <input className="border p-1 w-full" placeholder="Price (cents)" type="number" value={form.price_cents} onChange={e => setForm(f => ({ ...f, price_cents: Number(e.target.value) }))} required />
        <input className="border p-1 w-full" placeholder="Currency" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} required />
        <input className="border p-1 w-full" placeholder="Stock" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? "Update" : "Create"}</button>
        {editing && <button type="button" className="ml-2 text-gray-600" onClick={() => { setEditing(null); setForm({ name: "", sku: "", price_cents: 0, currency: "USD", stock: 0 }); }}>Cancel</button>}
      </form>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-1">ID</th>
            <th className="border p-1">Name</th>
            <th className="border p-1">SKU</th>
            <th className="border p-1">Price</th>
            <th className="border p-1">Stock</th>
            <th className="border p-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="border p-1">{p.id}</td>
              <td className="border p-1">{p.name}</td>
              <td className="border p-1">{p.sku}</td>
              <td className="border p-1">{(p.price_cents / 100).toFixed(2)} {p.currency}</td>
              <td className="border p-1">{p.stock}</td>
              <td className="border p-1">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(p)}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
