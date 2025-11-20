import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function Invoices() {
  const [invoices, setInvoices] = useState([])

  async function load() {
    const res = await fetch(`${API_BASE}/invoices`)
    setInvoices(await res.json())
  }

  useEffect(() => { load() }, [])

  async function generate(orderId) {
    const res = await fetch(`${API_BASE}/invoices`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: orderId }) })
    if (res.ok) load(); else alert('Failed to create invoice')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Invoices</h3>
          <a href="#" onClick={load} className="text-blue-300">Refresh</a>
        </div>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-300">
              <tr>
                <th className="p-3">Invoice</th>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Download</th>
              </tr>
            </thead>
            <tbody className="text-white/90">
              {invoices.map(inv => (
                <tr key={inv._id} className="border-t border-white/10">
                  <td className="p-3">{inv.invoice_number}</td>
                  <td className="p-3">{inv.order_number}</td>
                  <td className="p-3">{inv.billed_to?.name}</td>
                  <td className="p-3">{inv.grand_total?.toFixed?.(2) ?? inv.grand_total}</td>
                  <td className="p-3">
                    {inv.html ? <a href={`data:text/html,${encodeURIComponent(inv.html)}`} download={`${inv.invoice_number}.html`} className="text-blue-300">HTML</a> : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderToInvoice onGenerate={generate} />
    </div>
  )
}

function OrderToInvoice({ onGenerate }) {
  const [orders, setOrders] = useState([])
  useEffect(() => { fetch(`${API_BASE}/orders`).then(r=>r.json()).then(setOrders) }, [])

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Generate from Order</h3>
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto">
        {orders.map(o => (
          <button key={o._id} onClick={()=>onGenerate(o._id)} className="text-left bg-white/5 border border-white/10 rounded px-3 py-2 text-white hover:bg-white/10">
            <div className="font-medium">{o.order_number}</div>
            <div className="text-sm text-slate-300">{o.items?.length} items • {o.grand_total?.toFixed?.(2) ?? o.grand_total}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
