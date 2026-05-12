import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LANGS = ['Python', 'Java', 'C++']

const SNIPPETS = {
  // Array operations
  'array-append': {
    Python: `arr = [1, 2, 3]
arr.append(4)   # O(1) amortized
print(arr)      # [1, 2, 3, 4]`,
    Java: `import java.util.ArrayList;
ArrayList<Integer> arr = new ArrayList<>();
arr.add(1); arr.add(2); arr.add(3);
arr.add(4);  // O(1) amortized`,
    'C++': `#include <vector>
std::vector<int> arr = {1, 2, 3};
arr.push_back(4);  // O(1) amortized`,
  },
  'array-insert': {
    Python: `arr = [1, 2, 3, 4]
arr.insert(2, 99)  # insert 99 at index 2 — O(n)
print(arr)         # [1, 2, 99, 3, 4]`,
    Java: `arr.add(2, 99);  // O(n)`,
    'C++': `arr.insert(arr.begin() + 2, 99);  // O(n)`,
  },
  'array-delete': {
    Python: `arr = [1, 2, 3, 4]
arr.pop(2)   # delete index 2 — O(n)
print(arr)   # [1, 2, 4]`,
    Java: `arr.remove(2);  // O(n)`,
    'C++': `arr.erase(arr.begin() + 2);  // O(n)`,
  },
  'array-search': {
    Python: `arr = [5, 3, 8, 1, 9]
# Linear search — O(n)
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

idx = linear_search(arr, 8)  # returns 2`,
    Java: `int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++)
        if (arr[i] == target) return i;
    return -1;
}`,
    'C++': `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
  },
  // Sorting
  'bubble-sort': {
    Python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    Java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
}`,
    'C++': `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
}`,
  },
  'selection-sort': {
    Python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    Java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        int tmp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = tmp;
    }
}`,
    'C++': `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        swap(arr[i], arr[minIdx]);
    }
}`,
  },
  'insertion-sort': {
    Python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    Java: `void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    'C++': `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; j--;
        }
        arr[j + 1] = key;
    }
}`,
  },
  'merge-sort': {
    Python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
    Java: `void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int mid = (l + r) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }
}`,
    'C++': `void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int mid = (l + r) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }
}`,
  },
  'quick-sort': {
    Python: `def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    Java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot) {
            i++;
            int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
    int tmp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = tmp;
    return i + 1;
}`,
    'C++': `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot) swap(arr[++i], arr[j]);
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
  },
  // Linked List
  'linked-list-insert-head': {
    Python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_head(self, data):  # O(1)
        node = Node(data)
        node.next = self.head
        self.head = node`,
    Java: `void insertHead(int data) {  // O(1)
    Node node = new Node(data);
    node.next = head;
    head = node;
}`,
    'C++': `void insertHead(int data) {  // O(1)
    Node* node = new Node(data);
    node->next = head;
    head = node;
}`,
  },
  // BST
  'bst-insert': {
    Python: `class BST:
    def insert(self, root, val):
        if not root:
            return TreeNode(val)
        if val < root.val:
            root.left = self.insert(root.left, val)
        else:
            root.right = self.insert(root.right, val)
        return root`,
    Java: `TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
}`,
    'C++': `TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}`,
  },
  // Stack
  'stack-push-pop': {
    Python: `stack = []
stack.append(1)   # push — O(1)
stack.append(2)
stack.append(3)
top = stack.pop() # pop  — O(1)  → 3
peek = stack[-1]  # peek — O(1)  → 2`,
    Java: `Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);  // O(1)
stack.push(2);
stack.push(3);
int top = stack.pop();   // O(1) → 3
int peek = stack.peek(); // O(1) → 2`,
    'C++': `stack<int> s;
s.push(1);  // O(1)
s.push(2);
s.push(3);
int top = s.top(); s.pop();  // O(1) → 3`,
  },
  // Queue
  'queue-enqueue-dequeue': {
    Python: `from collections import deque
q = deque()
q.append(1)     # enqueue — O(1)
q.append(2)
q.append(3)
front = q.popleft()  # dequeue — O(1) → 1`,
    Java: `Queue<Integer> q = new LinkedList<>();
q.offer(1);  // enqueue — O(1)
q.offer(2);
q.offer(3);
int front = q.poll();  // dequeue — O(1) → 1`,
    'C++': `queue<int> q;
q.push(1);  // enqueue — O(1)
q.push(2);
q.push(3);
int front = q.front(); q.pop();  // O(1) → 1`,
  },
}

export { SNIPPETS }

export default function CodeBlock({ snippetKey, title }) {
  const [lang, setLang] = useState('Python')
  const [copied, setCopied] = useState(false)
  const snippets = SNIPPETS[snippetKey] || {}
  const code = snippets[lang] || '// Not available'

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0d0d16' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-1">
          {LANGS.filter(l => snippets[l]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="px-3 py-1 rounded text-xs font-medium transition-all"
              style={{
                background: lang === l ? 'rgba(139,92,246,0.15)' : 'transparent',
                color: lang === l ? '#a78bfa' : '#555570',
                border: lang === l ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all"
          style={{ color: copied ? '#10b981' : '#555570' }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={12} />
              </motion.div>
            ) : (
              <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Copy size={12} />
              </motion.div>
            )}
          </AnimatePresence>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <AnimatePresence mode="wait">
        <motion.pre
          key={lang}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="px-4 py-4 text-xs leading-relaxed overflow-x-auto"
          style={{ color: '#c9d1d9', fontFamily: 'ui-monospace, monospace' }}
        >
          <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
        </motion.pre>
      </AnimatePresence>
    </div>
  )
}

function highlightCode(code) {
  const keywords = ['def', 'class', 'return', 'if', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'import', 'from', 'void', 'int', 'new', 'public', 'private', 'static', 'None', 'True', 'False', 'null', 'auto', 'include']
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // strings
  html = html.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, m => `<span style="color:#a5d6ff">${m}</span>`)
  // comments
  html = html.replace(/(#[^\n]*)/g, '<span style="color:#6a737d">$1</span>')
  // numbers
  html = html.replace(/\b(\d+)\b/g, '<span style="color:#f8c555">$1</span>')
  // keywords
  keywords.forEach(k => {
    html = html.replace(new RegExp(`\\b(${k})\\b`, 'g'), '<span style="color:#ff79c6">$1</span>')
  })
  // function calls
  html = html.replace(/(\w+)(?=\()/g, '<span style="color:#79c0ff">$1</span>')

  return html
}
