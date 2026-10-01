import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import crypto from "crypto";
import { componentTagger } from "lovable-tagger";

// Dev API plugin to handle /api/create-razorpay-order and /api/verify-razorpay-payment during local development
const razorpayDevPlugin = (env) => ({
  name: "razorpay-dev-server",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === "/api/create-razorpay-order" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", async () => {
          try {
            const data = JSON.parse(body || "{}");
            const keyId = env.VITE_RAZORPAY_KEY_ID;
            const keySecret = env.RAZORPAY_KEY_SECRET;
            if (keyId && keySecret && !keyId.includes("placeholder")) {
              const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
              const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Basic ${auth}`,
                },
                body: JSON.stringify({
                  amount: data.amount,
                  currency: data.currency || "INR",
                  receipt: data.receipt || `rcpt_${Date.now()}`,
                  notes: data.notes || {},
                }),
              });
              const rzpData = await rzpRes.json();
              if (rzpRes.ok) {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ order_id: rzpData.id, amount: rzpData.amount, currency: rzpData.currency }));
                return;
              }
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ order_id: `order_dev_${Date.now()}`, amount: data.amount, currency: "INR" }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
        return;
      }

      if (req.url === "/api/verify-razorpay-payment" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", async () => {
          try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(body || "{}");
            const keySecret = env.RAZORPAY_KEY_SECRET;
            if (keySecret && razorpay_order_id && razorpay_signature) {
              const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
              const expectedSignature = crypto.createHmac("sha256", keySecret).update(payload).digest("hex");
              const isValid = expectedSignature.toLowerCase() === razorpay_signature.toLowerCase();
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ verified: isValid }));
              return;
            }
            const isValidPayment = Boolean(
              razorpay_payment_id &&
              (razorpay_payment_id.startsWith("pay_") || razorpay_payment_id.startsWith("internal_") || razorpay_payment_id.startsWith("free_"))
            );
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ verified: isValidPayment }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
        return;
      }
      next();
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      razorpayDevPlugin(env),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
