import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function Orders() {
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([])
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' })
  const [orders, setOrders] = useState([])

  async function load() {
    const [p, o] = await Promise.all([
      fetch(`${API_BASE}/products`).then(r => r.json()),
      fetch(`${API_BASE}/orders`).then(r => r.json())
    ])
    setProducts(p)
    setOrders(o)
  }
  useEffect(() => { load() }, [])

  function addItem(product) {
    const existing = items.find(i => i.product_id === product._id)
    if (existing) {
      setItems(items.map(i => i.product_id === product._id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setItems([...items, { product_id: product._id, qty: 1 }])
    }
  }

  async function createOrder() {
    if (!items.length) return alert('Add at least one item')
    const payload = { customer, items }
    const res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setItems([])
      load()
    } else {
      const d = await res.json().catch(()=>({detail:'Error'}))
      alert(d.detail || 'Error creating order')
    }
  }

  const priced = useMemo(() => {
    return items.map(it => {
      const p = products.find(x => x._id === it.product_id)
      const sub = ((p?.unit_price || 0) + (p?.making_charges || 0)) * it.qty
      const tax = sub * (p?.tax_rate || 0) / 100
      const total = sub + tax
      return { ...it, sku: p?.sku, name: p?.name, sub, tax, total }
    })
  }, [items, products])

  const totals = useMemo(() => {
    const sub = priced.reduce((a, b) => a + b.sub, 0)
    const tax = priced.reduce((a, b) => a + b.tax, 0)
    return { sub, tax, grand: sub + tax }
  }, [priced])

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Customer</h3>
          <div className="grid grid-cols-3 gap-3">
            <input className="bg-slate-900/60 border border-white/10 rounded px-3 py-2 text-white" placeholder="Name" value={customer.name} onChange={e=>setCustomer({...customer, name:e.target.value})} />
            <input className="bg-slate-900/60 border border-white/10 rounded px-3 py-2 text-white" placeholder="Email" value={customer.email} onChange={e=>setCustomer({...customer, email:e.target.value})} />
            <input className="bg-slate-900/60 border border-white/10 rounded px-3 py-2 text-white" placeholder="Phone" value={customer.phone} onChange={e=>setCustomer({...customer, phone:e.target.value})} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Add Items</h3>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto">
            {products.map(p => (
              <button key={p._id} onClick={()=>addItem(p)} className="text-left bg-white/5 border border-white/10 rounded px-3 py-2 text-white hover:bg-white/10">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-slate-300">{p.sku} • In stock: {p.stock_qty}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Order Items</h3>
          <div className="space-y-2">
            {priced.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                <div className="text-white">{it.sku} — {it.name}</div>
                <div className="flex items-center gap-2">
                  <input type="number" min="1" className="w-20 bg-slate-900/60 border border-white/10 rounded px-2 py-1 text-white" value={it.qty} onChange={e=>setItems(items.map((x,i)=>i===idx?{...x, qty:Number(e.target.value)}:x))} />
                  <div className="text-slate-300">{it.total.toFixed(2)}</div>
                </div>
              </div>
            ))}
            {!priced.length && <div className="text-slate-400">No items added</div>}
          </div>
          <div className="border-t border-white/10 mt-3 pt-3 text-right text-white">
            <div>Subtotal: {totals.sub.toFixed(2)}</div>
            <div>Tax: {totals.tax.toFixed(2)}</div>
            <div className="font-semibold text-lg">Grand: {totals.grand.toFixed(2)}</div>
          </div>
          <div className="text-right mt-3">
            <button onClick={createOrder} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">Create Order</button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Recent Orders</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {orders.map(o => (
              <div key={o._id} className="flex items-center justify-between bg-white/5 rounded px-3 py-2 text-white">
                <div>{o.order_number}</div>
                <div className="text-slate-300">{o.items?.length} items • {o.grand_total?.toFixed?.(2) ?? o.grand_total}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
