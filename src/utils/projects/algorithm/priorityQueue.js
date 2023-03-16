/* eslint-disable no-param-reassign */
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  /**
   * Add an element to the queue with a specified priority
   * @param {any} element - The element to be added to the queue
   * @param {number} priority - The priority of the element
   */
  enqueue(element, priority) {
    const node = { element, priority };
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Remove and return the element with the highest priority
   * @returns {any} The element with the highest priority
   */
  dequeue() {
    const max = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }
    return max.element;
  }

  /**
   * Move a node up the heap to its correct position
   * @param {number} index - The index of the node to move up
   */
  bubbleUp(index) {
    const node = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (node.priority <= parent.priority) break;
      this.heap[parentIndex] = node;
      this.heap[index] = parent;
      index = parentIndex;
    }
  }

  /**
   * Move a node down the heap to its correct position
   * @param {number} index - The index of the node to move down
   */
  bubbleDown(index) {
    const node = this.heap[index];
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild;
      let rightChild;
      let swap = null;

      if (leftChildIndex < this.heap.length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild.priority > node.priority) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < this.heap.length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild.priority > node.priority) ||
          (swap !== null && rightChild.priority > leftChild.priority)
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = node;
      index = swap;
    }
  }

  /**
   * Get the element with the highest priority without removing it
   * @returns {any} The element with the highest priority
   */
  peek() {
    return this.heap[0].element;
  }

  /**
   * Check if the queue is empty
   * @returns {boolean} Whether the queue is empty
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Get the number of elements in the queue
   * @returns {number} The number of elements in the queue
   */
  size() {
    return this.heap.length;
  }
}

module.exports = PriorityQueue;
