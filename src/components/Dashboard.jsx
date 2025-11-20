import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function NumberCard({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <div className="text-sm text-slate-300">{title}</div>
      <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    </div>
  )
}

export default function Dashboard() {
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
      } catch (e) {
        // ignore
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-3 gap-4">
      <NumberCard title="Products in Catalog" value={stats.products} />
      <NumberCard title="Orders" value={stats.orders} />
      <NumberCard title="Invoices" value={stats.invoices} />
    </div>
  )
}
