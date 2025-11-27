/**
 * Request Queue Module
 * Manages API requests with rate limiting and retry logic
 */

export class RequestQueue {
  constructor(options = {}) {
    this.queue = [];
    this.processing = false;
    this.maxConcurrent = options.maxConcurrent || 3;
    this.delayBetweenRequests = options.delay || 150; // ms
    this.activeRequests = 0;
    this.retryAttempts = options.retryAttempts || 2;
    this.retryDelay = options.retryDelay || 1000; // ms
  }

  /**
   * Add request to queue
   * @param {Function} requestFn - Function that returns a Promise
   * @param {number} priority - Higher number = higher priority (default: 0)
   * @returns {Promise} Promise that resolves when request completes
   */
  async enqueue(requestFn, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        fn: requestFn,
        resolve,
        reject,
        priority,
        attempts: 0,
      });

      // Sort by priority (higher first)
      this.queue.sort((a, b) => b.priority - a.priority);

      // Start processing if not already
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process queue with rate limiting
   */
  async processQueue() {
    if (this.processing) return;

    this.processing = true;

    while (this.queue.length > 0 || this.activeRequests > 0) {
      // Wait if max concurrent reached
      while (this.activeRequests >= this.maxConcurrent) {
        await this.delay(50);
      }

      // No more items in queue
      if (this.queue.length === 0) {
        if (this.activeRequests === 0) break;
        await this.delay(50);
        continue;
      }

      const item = this.queue.shift();
      this.activeRequests++;

      // Execute request with retry logic
      this.executeWithRetry(item)
        .then(item.resolve)
        .catch(item.reject)
        .finally(() => {
          this.activeRequests--;
        });

      // Delay before next request
      if (this.queue.length > 0) {
        await this.delay(this.delayBetweenRequests);
      }
    }

    this.processing = false;
  }

  /**
   * Execute request with exponential backoff retry
   */
  async executeWithRetry(item) {
    try {
      const result = await item.fn();
      return result;
    } catch (error) {
      // Check if error is rate limit (429)
      if (
        error.message.includes("429") ||
        error.message.includes("Too Many Requests")
      ) {
        if (item.attempts < this.retryAttempts) {
          item.attempts++;
          const backoffDelay = this.retryDelay * Math.pow(2, item.attempts - 1);

          console.warn(
            `Rate limited. Retrying in ${backoffDelay}ms (attempt ${item.attempts}/${this.retryAttempts})...`
          );

          await this.delay(backoffDelay);

          // Re-queue with higher priority
          return this.executeWithRetry(item);
        }
      }

      throw error;
    }
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clear queue
   */
  clear() {
    this.queue = [];
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queued: this.queue.length,
      active: this.activeRequests,
      processing: this.processing,
    };
  }
}
