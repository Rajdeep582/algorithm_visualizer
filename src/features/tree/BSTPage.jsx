import { motion } from 'framer-motion'
import BSTVisualizer from './BSTVisualizer'
import CodeBlock from '../../components/shared/CodeBlock'
import PageLayout from '../../components/layout/PageLayout'
import { ComplexityTable } from '../../components/shared/ComplexityBadge'

const COMPLEXITY = [
  { case: 'Search (avg)', time: 'O(log n)', space: 'O(h)' },
  { case: 'Search (worst)', time: 'O(n)', space: 'O(n)' },
  { case: 'Insert (avg)', time: 'O(log n)', space: 'O(h)' },
  { case: 'Delete (avg)', time: 'O(log n)', space: 'O(h)' },
  { case: 'Traversal', time: 'O(n)', space: 'O(h)' },
]

export default function BSTPage() {
  return (
    <PageLayout title="Binary Search Tree" subtitle="Ordered binary tree. Left < root < right. O(log n) average ops." tag="Data Structure">
      <Section title="What is a BST?">
        <p className="text-sm leading-relaxed" style={{ color: '#8888aa' }}>
          A BST enforces the invariant: all values in the <span style={{ color: '#a78bfa' }}>left subtree &lt; node</span>, all values in the <span style={{ color: '#a78bfa' }}>right subtree &gt; node</span>. This ordering allows binary search during lookup, achieving O(log n) on balanced trees. Degenerate (sorted) input degrades to O(n) — use AVL or Red-Black trees to maintain balance.
        </p>
      </Section>
      <Section title="Complexity"><ComplexityTable data={COMPLEXITY} /></Section>
      <Section title="Interactive Visualizer">
        <p className="text-sm mb-4" style={{ color: '#8888aa' }}>Insert, delete, search nodes. Watch inorder/preorder/postorder traversal animate.</p>
        <BSTVisualizer />
      </Section>
      <Section title="Insert">
        <CodeBlock snippetKey="bst-insert" />
      </Section>
      <Section title="Properties">
        <ul className="space-y-2 text-sm" style={{ color: '#8888aa' }}>
          {[
            'Inorder traversal yields sorted output',
            'Height determines performance — O(log n) for balanced, O(n) for skewed',
            'No duplicates in standard BST (handle by left/right convention or count field)',
            'BST enables O(log n) floor/ceiling/rank/select queries',
          ].map((e, i) => (
            <li key={i} className="flex items-start gap-2">
              <span style={{ color: '#8b5cf6', marginTop: 2 }}>▸</span>
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
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4 }} className="mb-10">
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f8' }}>{title}</h2>
      {children}
    </motion.section>
  )
}
