"use client";
import Link from "next/link";
import { useCart } from "../../context/cart";
import { createCheckoutSession } from "../../lib/api";

export default function CartPage() {
  const { items, subtotal_cents, updateQty, removeItem, clear, placeOrder } = useCart();

  const handleCheckout = async () => {
    const order = await placeOrder();
    const { checkout_url } = await createCheckoutSession(order.id);
    window.location.href = checkout_url;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {items.length === 0 ? (
        <div>Your cart is empty. Go to <Link className="text-blue-600 underline" href="/(admin)/products">Products</Link></div>
      ) : (
        <>
          <ul className="divide-y">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="py-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.sku}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input aria-label={`Quantity for ${product.name}`} type="number" min={1} className="w-16 border p-1" value={quantity} onChange={e => updateQty(product.id, Number(e.target.value))} />
                  <div className="w-24 text-right">{((product.price_cents * quantity)/100).toFixed(2)} {product.currency}</div>
                  <button className="text-red-600" onClick={() => removeItem(product.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-lg">Subtotal: {(subtotal_cents/100).toFixed(2)}</div>
            <div className="space-x-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={clear}>Clear</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCheckout}>Place order</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
