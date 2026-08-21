// Minimal receiver for FORM_WEBHOOK_URL in CI/e2e. Accepts any POST, returns 200, keeps nothing.
import { createServer } from "node:http";
const port = Number(process.env.PORT ?? 3999);
createServer((req, res) => {
  req.resume();
  req.on("end", () => {
    res.writeHead(req.method === "POST" ? 200 : 405, { "content-type": "application/json" });
    res.end('{"ok":true}');
  });
}).listen(port, () => console.log(`webhook sink on :${port}`));
