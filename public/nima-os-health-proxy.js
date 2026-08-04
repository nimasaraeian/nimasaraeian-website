(() => {
  const HEALTH_UPSTREAM = 'https://qmlacuiguaryobzoryyn.supabase.co/functions/v1/nima-health';
  const HEALTH_PROXY = '/api/health';
  const originalFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    try {
      const inputUrl = typeof input === 'string'
        ? input
        : input instanceof Request
          ? input.url
          : String(input);

      if (inputUrl === HEALTH_UPSTREAM) {
        if (input instanceof Request) {
          const replacement = new Request(new URL(HEALTH_PROXY, location.origin), input);
          return originalFetch(replacement, init);
        }
        return originalFetch(HEALTH_PROXY, init);
      }
    } catch {
      // Fall through to the browser's original fetch behavior.
    }

    return originalFetch(input, init);
  };
})();
