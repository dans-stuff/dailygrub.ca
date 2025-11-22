// Worker for handling non-asset requests (404s, etc.)
// Assets are served directly by Cloudflare - this only handles fallback

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Log every worker invocation to understand what's hitting the worker
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: request.method,
      path: url.pathname,
      search: url.search,
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'none',
      cfRay: request.headers.get('cf-ray') || 'unknown',
    }));

    // Return 404 for any request that reaches the worker
    // (static assets are served directly and don't hit this)
    return new Response("Not found", {
      status: 404,
      headers: {
        'content-type': 'text/plain',
      }
    });
  },
};
