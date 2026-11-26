export default {
  async fetch(request, env) {
    const expectedUser = env.BASIC_USER;
    const expectedPass = env.BASIC_PASS;

    if (!expectedUser || !expectedPass) {
      return new Response("Authentication is not configured.", { status: 500 });
    }

    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Basic ")) {
      let decoded = "";
      try {
        decoded = atob(authHeader.slice(6).trim());
      } catch {
        return unauthorizedResponse();
      }

      const sepIndex = decoded.indexOf(":");
      if (sepIndex !== -1) {
        const user = decoded.slice(0, sepIndex);
        const pass = decoded.slice(sepIndex + 1);

        if (user === expectedUser && pass === expectedPass) {
          return env.ASSETS.fetch(request);
        }
      }
    }

    return unauthorizedResponse();
  },
};

function unauthorizedResponse() {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Check-Photo Audit", charset="UTF-8"',
    },
  });
}
