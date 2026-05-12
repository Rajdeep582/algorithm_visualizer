import { motion } from 'framer-motion'
import LinkedListVisualizer from './LinkedListVisualizer'
import CodeBlock from '../../components/shared/CodeBlock'
import PageLayout from '../../components/layout/PageLayout'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'

const COMPLEXITY = [
  { case: 'Access by index', time: 'O(n)', space: 'O(1)' },
  { case: 'Insert at head', time: 'O(1)', space: 'O(1)' },
  { case: 'Insert at tail', time: 'O(1)*', space: 'O(1)' },
  { case: 'Insert at middle', time: 'O(n)', space: 'O(1)' },
  { case: 'Delete head', time: 'O(1)', space: 'O(1)' },
  { case: 'Search', time: 'O(n)', space: 'O(1)' },
]

export default function LinkedListPage() {
  return (
    <PageLayout
      title="Linked List"
      subtitle="Nodes connected by pointers. Dynamic size, O(1) head insert."
      tag="Data Structure"
    >
      <Section title="What is a Linked List?">
        <p className="text-sm leading-relaxed" style={{ color: '#8888aa' }}>
          A linked list is a linear data structure where elements (nodes) are stored in non-contiguous memory. Each node holds a <span style={{ color: '#a78bfa' }}>data value</span> and a <span style={{ color: '#a78bfa' }}>pointer to the next node</span>. Unlike arrays, no random access — traversal must start from the head.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: '#8888aa' }}>
          Doubly linked lists add a previous pointer for O(1) bidirectional traversal. Circular linked lists connect the tail back to the head.
        </p>
      </Section>

      <Section title="Complexity">
        <ComplexityTable data={COMPLEXITY} />
      </Section>

      <Section title="Interactive Visualizer">
        <p className="text-sm mb-4" style={{ color: '#8888aa' }}>Insert/delete nodes and watch pointers rearrange in real-time.</p>
        <LinkedListVisualizer />
      </Section>

      <Section title="Operations">
        <div className="space-y-6">
          <OpBlock
            name="Insert at Head"
            time="O(1)"
            desc="Create new node, set next = old head, update head pointer. No traversal needed."
            snippet="linked-list-insert-head"
          />
        </div>
      </Section>

      <Section title="When to use">
        <ul className="space-y-2 text-sm" style={{ color: '#8888aa' }}>
          {[
            'Frequent insert/delete at head or tail (stacks, queues)',
            'Unknown or highly variable size — no wasted memory from over-allocation',
            'Implementing other ADTs: deque, LRU cache',
            'Avoid when you need random access or cache-locality (arrays win there)',
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

function OpBlock({ name, time, desc, snippet }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-base font-semibold" style={{ color: '#f0f0f8' }}>{name}</h3>
        <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>{time}</span>
      </div>
      <p className="text-sm mb-3" style={{ color: '#8888aa' }}>{desc}</p>
      <CodeBlock snippetKey={snippet} />
    </div>
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
