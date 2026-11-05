const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = readFileSync(new URL("../src/proxy.ts", `file://${__filename}`), "utf8");

function loadProxy(fetch) {
  const exports = {};
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  vm.runInNewContext(compiled.outputText, {
    exports,
    URL,
    fetch,
    require(name) {
      // Reject server auth, MongoDB, and any other dependency in the proxy.
      assert.equal(name, "next/server");
      return {
        NextResponse: {
          next: () => ({ type: "next" }),
          redirect: (url) => ({ type: "redirect", url }),
        },
      };
    },
  });
  return exports;
}

function request(cookie = "") {
  return {
    url: "https://example.com/product/rice",
    nextUrl: new URL("https://example.com/product/rice"),
    headers: new Headers(cookie ? { cookie } : {}),
  };
}

test("proxy validates sessions through the Node auth API without importing server dependencies", async () => {
  const { proxy, config } = loadProxy(async (url, options) => {
    assert.equal(url.href, "https://example.com/api/auth/get-session");
    assert.equal(options.headers.cookie, "session=test-token");
    assert.equal(options.cache, "no-store");
    return Response.json({ session: { id: "session" }, user: { id: "user" } });
  });
  assert.equal((await proxy(request("session=test-token"))).type, "next");
  assert.deepEqual(Array.from(config.matcher), [
    "/product/:path*", "/profile", "/profile/update-profile",
  ]);
});

test("missing or incomplete sessions redirect to sign in", async () => {
  for (const session of [null, {}, { session: {} }, { user: {} }]) {
    const { proxy } = loadProxy(async () => Response.json(session));
    const result = await proxy(request());
    assert.equal(result.type, "redirect");
    assert.equal(result.url.pathname, "/signin");
    assert.equal(result.url.searchParams.get("redirect"), "/product/rice");
  }
});

test("auth endpoint failures never allow access", async () => {
  for (const fetch of [
    async () => new Response(null, { status: 500 }),
    async () => { throw new Error("Network unavailable"); },
    async () => new Response("Invalid JSON"),
  ]) {
    const { proxy } = loadProxy(fetch);
    await assert.rejects(() => proxy(request()));
  }
});

test("database-backed auth endpoint explicitly uses the Node.js runtime", () => {
  const route = readFileSync(new URL("../src/app/api/auth/[...all]/route.ts", `file://${__filename}`), "utf8");
  assert.match(route, /export const runtime = "nodejs"/);
});
