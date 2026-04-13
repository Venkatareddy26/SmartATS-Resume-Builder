// Performance Optimization Utilities

// Debounce function for auto-save
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
function preloadResources() {
  const resources = [
    { href: '/js/api.js', as: 'script' },
    { href: '/css/styles.css', as: 'style' },
    { href: 'https://fonts.googleapis.com/css2?family=Inter', as: 'style' }
  ];
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });
}

// Cache API responses
class APICache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
}

// Request queue for batch operations
class RequestQueue {
  constructor(batchSize = 5, delay = 1000) {
    this.queue = [];
    this.batchSize = batchSize;
    this.delay = delay;
    this.processing = false;
  }
  
  add(request) {
    this.queue.push(request);
    if (!this.processing) {
      this.process();
    }
  }
  
  async process() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      await Promise.all(batch.map(req => req()));
      
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }
    
    this.processing = false;
  }
}

// Local storage with compression
class CompressedStorage {
  static set(key, value) {
    try {
      const compressed = LZString.compress(JSON.stringify(value));
      localStorage.setItem(key, compressed);
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
  
  static get(key) {
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;
      return JSON.parse(LZString.decompress(compressed));
    } catch (e) {
      console.error('Storage error:', e);
      return null;
    }
  }
}

// Performance monitoring
class PerformanceMonitor {
  static mark(name) {
    performance.mark(name);
  }
  
  static measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
    return measure.duration;
  }
  
  static getMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      load: navigation.loadEventEnd - navigation.loadEventStart,
      total: navigation.loadEventEnd - navigation.fetchStart
    };
  }
}

// Export utilities
window.debounce = debounce;
window.throttle = throttle;
window.lazyLoadImages = lazyLoadImages;
window.preloadResources = preloadResources;
window.APICache = APICache;
window.RequestQueue = RequestQueue;
window.CompressedStorage = CompressedStorage;
window.PerformanceMonitor = PerformanceMonitor;
