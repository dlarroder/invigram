export function injectInterceptor(initialActive: boolean): void {
  let isActive = initialActive;

  window.addEventListener('invigram-setActive', (e) => {
    isActive = (e as CustomEvent<{ isActive: boolean }>).detail.isActive;
  });

  function isSeen(vars: any, friendlyName: string): boolean {
    if (!vars || !('viewSeenAt' in vars)) return false;
    if (!friendlyName) return false;
    return (
      friendlyName.includes('Seen') &&
      friendlyName.includes('Polaris') &&
      friendlyName.includes('Mutation')
    );
  }

  function looksLikeSeen(body: any, friendly?: string): boolean {
    if (!body) return false;

    if (body instanceof FormData) {
      const variables = body.get('variables') as string | null;
      const friendlyName = (body.get('fb_api_req_friendly_name') as string | null) || friendly || '';
      if (variables && isSeen(JSON.parse(variables), friendlyName)) return true;
    }

    if (body instanceof URLSearchParams) {
      const variables = body.get('variables');
      const friendlyName = body.get('fb_api_req_friendly_name') || friendly || '';
      if (variables && isSeen(JSON.parse(variables), friendlyName)) return true;
    }

    if (typeof body === 'string') {
      const s = body.trim();
      if (s.startsWith('{')) {
        const obj = JSON.parse(s);
        if (obj.variables && 'viewSeenAt' in obj.variables) return true;
      } else {
        const params = new URLSearchParams(s);
        const variables = params.get('variables');
        const friendlyName = params.get('fb_api_req_friendly_name') || friendly || '';
        if (variables && isSeen(JSON.parse(variables), friendlyName)) return true;
      }
    }

    if (typeof body === 'object') {
      const variables = (body.variables) || body;
      if (variables && 'viewSeenAt' in variables) return true;
    }

    return false;
  }

  const _fetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    if (isActive) {
      const method = (
        (init && init.method) ||
        (input instanceof Request ? input.method : null) ||
        'GET'
      ).toUpperCase();
      if (method === 'POST' && looksLikeSeen(init && init.body)) {
        return Promise.resolve(new Response(null, { status: 204 }));
      }
    }
    return _fetch(input as RequestInfo, init as RequestInit);
  };

  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  (XMLHttpRequest.prototype as any).open = function (this: any, method: string, ...rest: any[]) {
    this.__inv_method = method;
    return origOpen.apply(this, [method, ...rest] as any);
  };

  (XMLHttpRequest.prototype as any).send = function (this: any, body?: any) {
    const method = (this.__inv_method || 'GET').toUpperCase();
    if (isActive && method === 'POST' && looksLikeSeen(body)) {
      return;
    }
    return origSend.call(this, body);
  };
}
