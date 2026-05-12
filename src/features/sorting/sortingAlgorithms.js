// Each step: { arr, comparing:[], swapping:[], sorted:Set->array, pivot:null|idx, label }

function step(arr, comparing=[], swapping=[], sorted=[], label='', pivot=null) {
  return { arr: [...arr], comparing, swapping, sorted, label, pivot }
}

export function bubbleSortSteps(arr) {
  const a = [...arr], n = a.length, steps = [], sortedSet = new Set()
  steps.push(step(a,[],[],[],'Start: compare adjacent pairs'))
  for (let i = 0; i < n-1; i++) {
    for (let j = 0; j < n-i-1; j++) {
      steps.push(step(a,[j,j+1],[],[...sortedSet],`Compare [${j}]=${a[j]} and [${j+1}]=${a[j+1]}`))
      if (a[j] > a[j+1]) {
        ;[a[j],a[j+1]]=[a[j+1],a[j]]
        steps.push(step(a,[],[j,j+1],[...sortedSet],`Swap ${a[j+1]} ↔ ${a[j]}`))
      }
    }
    sortedSet.add(n-1-i)
    steps.push(step(a,[],[],[...sortedSet],`Pass ${i+1} done`))
  }
  sortedSet.add(0)
  steps.push(step(a,[],[],[...Array(n).keys()],'Sorted!'))
  return steps
}

export function selectionSortSteps(arr) {
  const a = [...arr], n = a.length, steps = [], sortedSet = new Set()
  steps.push(step(a,[],[],[],'Find min each pass'))
  for (let i = 0; i < n-1; i++) {
    let min = i
    for (let j = i+1; j < n; j++) {
      steps.push(step(a,[min,j],[],[...sortedSet],`min=${a[min]}, check [${j}]=${a[j]}`))
      if (a[j] < a[min]) min = j
    }
    if (min !== i) { ;[a[i],a[min]]=[a[min],a[i]]; steps.push(step(a,[],[i,min],[...sortedSet],`Swap ${a[min]} ↔ ${a[i]}`)) }
    sortedSet.add(i)
  }
  sortedSet.add(n-1)
  steps.push(step(a,[],[],[...Array(n).keys()],'Sorted!'))
  return steps
}

export function insertionSortSteps(arr) {
  const a = [...arr], n = a.length, steps = [], sortedSet = new Set([0])
  steps.push(step(a,[],[],[0],'index 0 sorted'))
  for (let i = 1; i < n; i++) {
    const key = a[i]; let j = i-1
    steps.push(step(a,[i],[],[...sortedSet],`Insert key=${key}`))
    while (j >= 0 && a[j] > key) {
      steps.push(step(a,[j,j+1],[],[...sortedSet],`${a[j]} > ${key}, shift right`))
      a[j+1] = a[j]; j--
      steps.push(step(a,[],[j+1,j+2],[...sortedSet],`Shifted`))
    }
    a[j+1] = key; sortedSet.add(i)
    steps.push(step(a,[],[],[...sortedSet],`Placed ${key} at [${j+1}]`))
  }
  steps.push(step(a,[],[],[...Array(n).keys()],'Sorted!'))
  return steps
}

export function mergeSortSteps(arr) {
  const a = [...arr], steps = []
  steps.push(step(a,[],[],[],'Divide and conquer'))
  function merge(arr, l, m, r) {
    const L = arr.slice(l,m+1), R = arr.slice(m+1,r+1)
    let i=0,j=0,k=l
    while (i<L.length && j<R.length) {
      steps.push(step(arr,[l+i,m+1+j],[],[],`Compare ${L[i]} vs ${R[j]}`))
      if (L[i]<=R[j]) arr[k++]=L[i++]; else arr[k++]=R[j++]
      steps.push(step(arr,[],[k-1],[],`Placed ${arr[k-1]}`))
    }
    while (i<L.length) arr[k++]=L[i++]
    while (j<R.length) arr[k++]=R[j++]
    const merged = Array.from({length:r-l+1},(_,x)=>l+x)
    steps.push(step(arr,[],[],merged,`Merged [${l}..${r}]`))
  }
  function ms(arr,l,r) {
    if (l>=r) return
    const m = Math.floor((l+r)/2)
    steps.push(step(arr,[l,r],[],[],`Split [${l}..${r}]`))
    ms(arr,l,m); ms(arr,m+1,r); merge(arr,l,m,r)
  }
  ms(a,0,a.length-1)
  steps.push(step(a,[],[],[...Array(a.length).keys()],'Sorted!'))
  return steps
}

export function quickSortSteps(arr) {
  const a = [...arr], steps = []
  steps.push(step(a,[],[],[],'Pivot, partition, recurse'))
  function partition(arr,low,high) {
    const pivot=arr[high]; let i=low-1
    steps.push(step(arr,[high],[],[],`Pivot=${pivot} at [${high}]`,high))
    for (let j=low;j<high;j++) {
      steps.push(step(arr,[j],[],[],`${arr[j]} ≤ ${pivot}?`,high))
      if (arr[j]<=pivot) { i++; ;[arr[i],arr[j]]=[arr[j],arr[i]]; if(i!==j) steps.push(step(arr,[],[i,j],[],`Swap`,high)) }
    }
    ;[arr[i+1],arr[high]]=[arr[high],arr[i+1]]
    steps.push(step(arr,[],[i+1,high],[i+1],`Pivot ${pivot} final pos [${i+1}]`))
    return i+1
  }
  function qs(arr,l,h) { if(l<h){ const p=partition(arr,l,h); qs(arr,l,p-1); qs(arr,p+1,h) } }
  qs(a,0,a.length-1)
  steps.push(step(a,[],[],[...Array(a.length).keys()],'Sorted!'))
  return steps
}

export function heapSortSteps(arr) {
  const a = [...arr], n = a.length, steps = []
  steps.push(step(a,[],[],[],'Build max-heap, then extract'))
  function heapify(arr,n,i) {
    let largest=i, l=2*i+1, r=2*i+2
    steps.push(step(arr,[i,l,r].filter(x=>x<n),[],[],`Heapify at [${i}]`))
    if (l<n && arr[l]>arr[largest]) largest=l
    if (r<n && arr[r]>arr[largest]) largest=r
    if (largest!==i) {
      ;[arr[i],arr[largest]]=[arr[largest],arr[i]]
      steps.push(step(arr,[],[i,largest],[],`Swap ${arr[largest]} ↔ ${arr[i]}`))
      heapify(arr,n,largest)
    }
  }
  for (let i=Math.floor(n/2)-1;i>=0;i--) heapify(a,n,i)
  steps.push(step(a,[],[],[],'Max-heap built'))
  const sortedSet = new Set()
  for (let i=n-1;i>0;i--) {
    steps.push(step(a,[0,i],[],[...sortedSet],`Extract max ${a[0]}`))
    ;[a[0],a[i]]=[a[i],a[0]]
    steps.push(step(a,[],[0,i],[...sortedSet],`Swapped to end`))
    sortedSet.add(i)
    heapify(a,i,0)
  }
  steps.push(step(a,[],[],[...Array(n).keys()],'Sorted!'))
  return steps
}

export function countingSortSteps(arr) {
  const a = [...arr], steps = [], max = Math.max(...a), min = Math.min(...a)
  const range = max - min + 1
  const count = new Array(range).fill(0)
  steps.push(step(a,[],[],[],'Count occurrences'))
  for (let i=0;i<a.length;i++) {
    count[a[i]-min]++
    steps.push(step(a,[i],[],[],`count[${a[i]}]=${count[a[i]-min]}`))
  }
  steps.push(step(a,[],[],[],'Prefix sums'))
  for (let i=1;i<range;i++) {
    count[i]+=count[i-1]
    steps.push(step(a,[],[],[],`prefix[${i+min}]=${count[i]}`))
  }
  const out = new Array(a.length)
  steps.push(step(a,[],[],[],'Place elements'))
  for (let i=a.length-1;i>=0;i--) {
    out[--count[a[i]-min]] = a[i]
    steps.push(step(a,[i],[],[],`Place ${a[i]} at output[${count[a[i]-min]}]`))
  }
  for (let i=0;i<a.length;i++) a[i]=out[i]
  steps.push(step(a,[],[],[...Array(a.length).keys()],'Sorted!'))
  return steps
}

export function shellSortSteps(arr) {
  const a = [...arr], n = a.length, steps = []
  steps.push(step(a,[],[],[],'Shell sort: insertion with gaps'))
  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    steps.push(step(a,[],[],[],`Gap = ${gap}`))
    for (let i = gap; i < n; i++) {
      const temp = a[i]; let j = i
      steps.push(step(a,[i],[],[],`Insert a[${i}]=${temp} with gap ${gap}`))
      while (j >= gap && a[j-gap] > temp) {
        steps.push(step(a,[j-gap,j],[],[],`${a[j-gap]} > ${temp}, shift`))
        a[j] = a[j-gap]
        steps.push(step(a,[],[j-gap,j],[],`Shifted`))
        j -= gap
      }
      a[j] = temp
      steps.push(step(a,[],[],[],`Placed ${temp} at [${j}]`))
    }
  }
  steps.push(step(a,[],[],[...Array(n).keys()],'Sorted!'))
  return steps
}

export const ALGO_META = {
  bubble:    { name: 'Bubble Sort',    best:'O(n)',       avg:'O(n²)',       worst:'O(n²)',    space:'O(1)',      fn: bubbleSortSteps },
  selection: { name: 'Selection Sort', best:'O(n²)',      avg:'O(n²)',       worst:'O(n²)',    space:'O(1)',      fn: selectionSortSteps },
  insertion: { name: 'Insertion Sort', best:'O(n)',       avg:'O(n²)',       worst:'O(n²)',    space:'O(1)',      fn: insertionSortSteps },
  merge:     { name: 'Merge Sort',     best:'O(n log n)', avg:'O(n log n)',  worst:'O(n log n)',space:'O(n)',     fn: mergeSortSteps },
  quick:     { name: 'Quick Sort',     best:'O(n log n)', avg:'O(n log n)',  worst:'O(n²)',    space:'O(log n)', fn: quickSortSteps },
  heap:      { name: 'Heap Sort',      best:'O(n log n)', avg:'O(n log n)',  worst:'O(n log n)',space:'O(1)',    fn: heapSortSteps },
  counting:  { name: 'Counting Sort',  best:'O(n+k)',     avg:'O(n+k)',      worst:'O(n+k)',   space:'O(k)',     fn: countingSortSteps },
  shell:     { name: 'Shell Sort',     best:'O(n log n)', avg:'O(n log² n)', worst:'O(n²)',    space:'O(1)',     fn: shellSortSteps },
}
