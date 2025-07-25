import index from "../ui";
import { toHtml } from "jsx-compat/ssr";

function respondHtml(jsx: object) {
  const content = toHtml(jsx);
  return new Response(content, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

async function respondBundledAsset({ entrypoint, contentType }) {
  const { stdout } = await Bun.$`mktemp -d`;
  const tempDir = stdout.toString().trim();
  const result = await Bun.build({
    entrypoints: [entrypoint],
    outdir: tempDir,
  });
  if (result.success) {
    const artifact = result.outputs[0];
    const bytes = await Bun.file(artifact.path).bytes();
    await Bun.$`rm -rf ${tempDir}`;
    return new Response(bytes, {
      headers: {
        "Content-Type": contentType,
      },
    });
  }
  console.log(result);
  return new Response("Not Found", { status: 404 });
}

const server = Bun.serve({
  development: true,
  routes: {
    "/": () => respondHtml(index()),
    "/static/main.css": async () =>
      respondBundledAsset({
        entrypoint: "./src/ui/css/base.css",
        contentType: "text/css",
      }),
    "/static/main.js": async () =>
      respondBundledAsset({
        entrypoint: "./src/client/index.ts",
        contentType: "text/javascript",
      }),
  },
  fetch() {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`HTTP server listening at ${server.hostname}:${server.port}`);
