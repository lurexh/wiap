import http from "node:http";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const PORT = Number(process.env.PORT || 10000);

const server = http.createServer((req, res) => {
    const url = new URL(
        req.url || "/",
        `http://${req.headers.host || "localhost"}`
    );

    if (url.pathname === "/") {
        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("Copium Wisp Server Online");
        return;
    }

    if (url.pathname === "/health") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "ok",
            service: "copium-wisp"
        }));

        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.on("upgrade", (req, socket, head) => {
    try {
        const pathname = new URL(
            req.url || "/",
            "http://localhost"
        ).pathname;

        if (pathname !== "/wisp/") {
            socket.end();
            return;
        }

        wisp.routeRequest(
            req,
            socket,
            head
        );

    } catch (error) {
        console.error(
            "Wisp upgrade error:",
            error
        );

        try {
            socket.end();
        } catch {}
    }
});

server.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(
            `Wisp listening on ${PORT}`
        );
    }
);
