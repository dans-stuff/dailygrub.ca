// Worker for handling non-asset requests (404s, etc.)
// Assets are served directly by Cloudflare - this only handles fallback

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
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

    // Serve the site's real 404 page (static assets are served directly
    // and don't hit this; anything reaching the worker is a miss).
    const page = await env.ASSETS.fetch(new Request(new URL('/404.html', url.origin)));
    return new Response(page.body, {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  },
};

export default worker;
