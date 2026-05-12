export function ComplexityTable({ data }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0f0f17' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Case', 'Time', 'Space'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#555570' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < data.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <td className="px-4 py-3 text-xs font-medium" style={{ color: '#8888aa' }}>{row.case}</td>
              <td className="px-4 py-3">
                <ComplexityChip value={row.time} />
              </td>
              <td className="px-4 py-3">
                <ComplexityChip value={row.space} color="blue" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ComplexityChip({ value, color = 'purple' }) {
  const colors = {
    purple: { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
    blue: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
    green: { bg: 'rgba(16,185,129,0.1)', text: '#34d399', border: 'rgba(16,185,129,0.2)' },
    red: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.2)' },
  }
  const c = colors[color] || colors.purple

  return (
    <span
      className="inline-flex px-2 py-0.5 rounded text-xs font-mono font-medium"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {value}
    </span>
  )
}
