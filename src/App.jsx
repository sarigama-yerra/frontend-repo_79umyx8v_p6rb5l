import { useEffect, useState } from 'react'
import Products from './components/Products'

function Stat({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <div className="text-sm text-slate-300">{label}</div>
      <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    </div>
  )
}

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function App() {
  const [stats, setStats] = useState({ products: 0, orders: 0, invoices: 0 })

  useEffect(() => {
    async function fetchStats() {
      try {
        const [p, o, i] = await Promise.all([
          fetch(`${API_BASE}/products`).then(r => r.json()),
          fetch(`${API_BASE}/orders`).then(r => r.json()),
          fetch(`${API_BASE}/invoices`).then(r => r.json()),
        ])
        setStats({ products: p.length || 0, orders: o.length || 0, invoices: i.length || 0 })
      } catch (e) {}
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Jewellery Management</h1>
            <p className="text-slate-300">Manage stock, orders, pricing and generate invoices</p>
          </div>
          <a href="/test" className="text-blue-300 hover:text-blue-200">Check Backend</a>
        </header>

        <section className="grid grid-cols-3 gap-4 mb-8">
          <Stat label="Products" value={stats.products} />
          <Stat label="Orders" value={stats.orders} />
          <Stat label="Invoices" value={stats.invoices} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Stock & Pricing</h2>
          <Products />
        </section>
      </div>
    </div>
  )
}
