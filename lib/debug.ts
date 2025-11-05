import debug from 'debug';

// Enable debug in browser if NEXT_PUBLIC_DEBUG is set
if (typeof window !== 'undefined') {
  const debugEnv = process.env.NEXT_PUBLIC_DEBUG;
  // Always sync with environment variable (allows toggling by restarting server)
  if (debugEnv) {
    localStorage.debug = debugEnv;
  } else {
    // Clear if no DEBUG env var is set (allows disabling logs)
    localStorage.removeItem('debug');
  }
}

export default debug;
