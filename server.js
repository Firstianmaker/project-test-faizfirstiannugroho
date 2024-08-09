const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const target = "https://suitmedia-backend.suitdev.com/api";
const changeOrigin = true;
const pathRewrite = { "^/api": "" };

const proxy = createProxyMiddleware({
  target,
  changeOrigin,
  pathRewrite,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
});

app.use("/api", proxy);
app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

app.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
