import { motion } from 'framer-motion'
import SortingVisualizer from './SortingVisualizer'
import CodeBlock from '../../components/shared/CodeBlock'
import PageLayout from '../../components/layout/PageLayout'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'

const COMPLEXITY = [
  { case: 'Bubble Sort', time: 'O(n²)', space: 'O(1)' },
  { case: 'Selection Sort', time: 'O(n²)', space: 'O(1)' },
  { case: 'Insertion Sort', time: 'O(n²)', space: 'O(1)' },
  { case: 'Merge Sort', time: 'O(n log n)', space: 'O(n)' },
  { case: 'Quick Sort', time: 'O(n log n)*', space: 'O(log n)' },
]

const ALGOS = [
  { key: 'bubble-sort', name: 'Bubble Sort', desc: 'Repeatedly swap adjacent elements if out of order. Simple but slow — best for small or nearly sorted data.', snippet: 'bubble-sort' },
  { key: 'selection-sort', name: 'Selection Sort', desc: 'Find the minimum in the unsorted region and move it to the front. Exactly n-1 swaps regardless of input.', snippet: 'selection-sort' },
  { key: 'insertion-sort', name: 'Insertion Sort', desc: 'Build a sorted sub-array one element at a time. Excellent on small or nearly-sorted arrays; stable.', snippet: 'insertion-sort' },
  { key: 'merge-sort', name: 'Merge Sort', desc: 'Divide in half, sort each half, merge. Guaranteed O(n log n). Extra O(n) space. Stable.', snippet: 'merge-sort' },
  { key: 'quick-sort', name: 'Quick Sort', desc: 'Choose pivot, partition around it, recurse. Average O(n log n) but O(n²) worst case. In-place, cache-friendly.', snippet: 'quick-sort' },
]

export default function SortingPage() {
  return (
    <PageLayout
      title="Sorting Algorithms"
      subtitle="From O(n²) classics to O(n log n) powerhouses — animated step by step."
      tag="Algorithms"
    >
      <Section title="Overview">
        <p style={{ color: '#8888aa' }} className="leading-relaxed text-sm">
          Sorting transforms an unordered collection into a defined order. Algorithm choice depends on input size, stability requirements, and whether data is partially sorted.
        </p>
        <div className="mt-4">
          <ComplexityTable data={COMPLEXITY} />
        </div>
      </Section>

      <Section title="Interactive Visualizer">
        <p className="text-sm mb-4" style={{ color: '#8888aa' }}>
          Select any algorithm. Watch each comparison and swap animated in real-time.
        </p>
        <SortingVisualizer />
      </Section>

      <Section title="Algorithms">
        <div className="space-y-8">
          {ALGOS.map((a, i) => (
            <motion.div
              key={a.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <h3 className="text-base font-semibold mb-1" style={{ color: '#f0f0f8' }}>{a.name}</h3>
              <p className="text-sm mb-3" style={{ color: '#8888aa' }}>{a.desc}</p>
              <CodeBlock snippetKey={a.snippet} />
            </motion.div>
          ))}
        </div>
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
