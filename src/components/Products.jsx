import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function Products() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ sku: '', name: '', unit_price: '', making_charges: '', stock_qty: '' })
  const [q, setQ] = useState('')

  async function load() {
    const res = await fetch(`${API_BASE}/products${q ? `?q=${encodeURIComponent(q)}` : ''}`)
    setItems(await res.json())
  }

  useEffect(() => { load() }, [])

  async function addProduct(e) {
    e.preventDefault()
    const payload = {
      sku: form.sku,
      name: form.name,
      unit_price: Number(form.unit_price || 0),
      making_charges: Number(form.making_charges || 0),
      stock_qty: Number(form.stock_qty || 0),
      tax_rate: 3.0,
    }
    const res = await fetch(`${API_BASE}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setForm({ sku: '', name: '', unit_price: '', making_charges: '', stock_qty: '' })
      load()
    } else {
      alert('Error creating product')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <form className="grid grid-cols-5 gap-3" onSubmit={addProduct}>
          <input className="bg-slate-900/60 border border-white/10 rounded px-3 py-2 text-white" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} required />
          <input className="bg-slate-900/60 border border-white/10 rounded px-3 py-2 text-white" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input type="number" step="0.01" className="bg-slate-900/60 border border-white/10 rounded px-3 py-2 text-white" placeholder="Unit Price" value={form.unit_price} onChange={e=>setForm({...form, unit_price:e.target.value})} required />
          <input type="number" step="0.01" className="bg-slate-900/60 border border-white/10 rounded px-3 py-2 text-white" placeholder="Making" value={form.making_charges} onChange={e=>setForm({...form, making_charges:e.target.value})} />
          <div className="flex gap-2">
            <input type="number" className="flex-1 bg-slate-900/60 border border-white/10 rounded px-3 py-2 text-white" placeholder="Stock" value={form.stock_qty} onChange={e=>setForm({...form, stock_qty:e.target.value})} />
            <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4">Add</button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Products</h3>
        <div>
          <input className="bg-slate-900/60 border border-white/10 rounded px-3 py-2 text-white" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
          <button onClick={load} className="ml-2 bg-white/10 hover:bg-white/20 text-white rounded px-3 py-2">Search</button>
        </div>
      </div>

      <div className="overflow-auto bg-white/5 border border-white/10 rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-300">
            <tr>
              <th className="p-3">SKU</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Making</th>
              <th className="p-3">Stock</th>
            </tr>
          </thead>
          <tbody className="text-white/90">
            {items.map(p => (
              <tr key={p._id} className="border-t border-white/10">
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.unit_price?.toFixed?.(2) ?? p.unit_price}</td>
                <td className="p-3">{p.making_charges?.toFixed?.(2) ?? p.making_charges}</td>
                <td className="p-3">{p.stock_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
