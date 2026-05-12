import { motion } from 'framer-motion'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'
import CodeBlock from '../../components/shared/CodeBlock'
import ArrayVisualizer from './ArrayVisualizer'
import PageLayout from '../../components/layout/PageLayout'

const COMPLEXITY = [
  { case: 'Access', time: 'O(1)', space: 'O(1)' },
  { case: 'Search', time: 'O(n)', space: 'O(1)' },
  { case: 'Insert (end)', time: 'O(1)*', space: 'O(1)' },
  { case: 'Insert (mid)', time: 'O(n)', space: 'O(1)' },
  { case: 'Delete', time: 'O(n)', space: 'O(1)' },
]

const OPERATIONS = [
  {
    id: 'append',
    name: 'Append',
    time: 'O(1)*',
    desc: 'Add element to the end. Amortized O(1) — occasional resize is O(n) but averages out.',
    snippet: 'array-append',
  },
  {
    id: 'insert',
    name: 'Insert at Index',
    time: 'O(n)',
    desc: 'Elements to the right of insertion point must shift by one position.',
    snippet: 'array-insert',
  },
  {
    id: 'delete',
    name: 'Delete',
    time: 'O(n)',
    desc: 'Removing an element requires shifting all subsequent elements left.',
    snippet: 'array-delete',
  },
  {
    id: 'search',
    name: 'Search (Linear)',
    time: 'O(n)',
    desc: 'Scan each element until target is found or array exhausted.',
    snippet: 'array-search',
  },
]

export default function ArrayPage() {
  return (
    <PageLayout
      title="Array"
      subtitle="Contiguous memory. O(1) access. The foundation of everything."
      tag="Data Structure"
    >
      {/* Introduction */}
      <Section title="What is an Array?">
        <p className="leading-relaxed" style={{ color: '#8888aa' }}>
          An array stores elements in <Highlight>contiguous memory locations</Highlight>, allowing direct access via index in O(1) time.
          Each element occupies a fixed-size slot, making offset calculation trivial: <code style={{ background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: 4, color: '#a78bfa', fontFamily: 'monospace', fontSize: '13px' }}>address = base + index × element_size</code>.
        </p>
        <p className="mt-3 leading-relaxed" style={{ color: '#8888aa' }}>
          Dynamic arrays (Python list, Java ArrayList, C++ vector) automatically resize — typically doubling capacity — keeping amortized insert cost at O(1).
        </p>
      </Section>

      {/* Complexity */}
      <Section title="Complexity Overview">
        <ComplexityTable data={COMPLEXITY} />
      </Section>

      {/* Live Visualizer */}
      <Section title="Interactive Visualizer">
        <p className="mb-4 text-sm" style={{ color: '#8888aa' }}>Select an operation, then press play to see it animated step-by-step.</p>
        <ArrayVisualizer />
      </Section>

      {/* Operations */}
      <Section title="Operations">
        <div className="space-y-8">
          {OPERATIONS.map((op, i) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-semibold" style={{ color: '#f0f0f8' }}>{op.name}</h3>
                <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>{op.time}</span>
              </div>
              <p className="text-sm mb-3" style={{ color: '#8888aa' }}>{op.desc}</p>
              <CodeBlock snippetKey={op.snippet} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Edge Cases */}
      <Section title="Edge Cases">
        <ul className="space-y-2 text-sm" style={{ color: '#8888aa' }}>
          {[
            'Empty array: always check length before accessing',
            'Index out of bounds: validate 0 ≤ index < length',
            'Single element: insert/delete still need shifting logic',
            'Resize collision: doubling strategy trades space for time',
          ].map((e, i) => (
            <li key={i} className="flex items-start gap-2">
              <span style={{ color: '#8b5cf6', marginTop: '2px' }}>▸</span>
              {e}
            </li>
          ))}
        </ul>
      </Section>
    </PageLayout>
  )
}

function Section({ title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="mb-10"
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f8' }}>{title}</h2>
      {children}
    </motion.section>
  )
}

function Highlight({ children }) {
  return <span style={{ color: '#a78bfa' }}>{children}</span>
}
