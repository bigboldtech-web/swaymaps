/**
 * Custom Node entry point.
 *
 * Hosts Next.js + a WebSocket server on the same port. Used in production
 * (`npm run start`) to enable Yjs real-time collaboration on hosts that
 * support long-lived connections (Fly, Render, EC2, etc.).
 *
 * On platforms without WebSocket support (e.g. Vercel serverless) you can
 * run this server elsewhere and point clients at its origin via
 * NEXT_PUBLIC_YJS_URL.
 *
 * Local dev still uses `next dev` (npm run dev) — the WebSocket route is
 * mounted there too via the same module, see `npm run dev:ws` for the
 * combined dev server.
 */

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer } from "ws";
import { attachYjsServer } from "./lib/yjs/server";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT ?? "3000", 10);
const hostname = process.env.HOST ?? "0.0.0.0";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsed = parse(req.url ?? "/", true);
    handle(req, res, parsed);
  });

  // Yjs WebSocket server, mounted at /api/yjs.
  // We use `noServer: true` and gate WebSocket upgrades on the path so
  // Next.js HMR and other websocket consumers stay independent.
  const wss = new WebSocketServer({ noServer: true });
  attachYjsServer(wss);

  httpServer.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url ?? "/", true);
    if (pathname === "/api/yjs") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      // Let Next handle anything else (HMR, etc.)
      socket.destroy();
    }
  });

  httpServer.listen(port, () => {
    console.log(
      `[swaymaps] ready on http://${hostname}:${port}` +
        (dev ? "  (dev mode)" : "  (production)")
    );
    console.log(`[swaymaps] yjs WebSocket on ws://${hostname}:${port}/api/yjs`);
  });
});
