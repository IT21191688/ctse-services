import express from "express";
import axios from "axios";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Service URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:8001";
const PRODUCT_SERVICE =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:8003";
const CART_SERVICE = process.env.CART_SERVICE_URL || "http://localhost:8002";
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || "http://localhost:8004";
const REVIEW_SERVICE =
  process.env.REVIEW_SERVICE_URL || "http://localhost:8005";

// Create uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(morgan("dev"));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Standard request forwarding (for JSON requests)
const forwardRequest = async (
  req: Request,
  res: Response,
  targetService: string,
  targetPath: string
) => {
  try {
    const url = `${targetService}${targetPath}`;
    console.log(`Forwarding ${req.method} request to: ${url}`);

    // For regular requests
    const contentType = req.headers["content-type"] || "";

    // If it's a multipart form, process it differently
    if (contentType.includes("multipart/form-data")) {
      return handleMultipartRequest(req, res, targetService, targetPath);
    }

    console.log(`Request body:`, req.body);

    // Standard request handling
    const requestConfig: any = {
      method: req.method,
      url: url,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        ...(req.headers.authorization && {
          Authorization: req.headers.authorization,
        }),
      },
      validateStatus: () => true,
    };

    if (req.method !== "GET") {
      requestConfig.data = req.body;
    }

    const response = await axios(requestConfig);
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error(`Error forwarding request to ${targetService}:`, error);

    if (error.response) {
      console.log(`Service responded with status ${error.response.status}`);
      console.log("Error response data:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }

    if (error.code === "ECONNREFUSED") {
      console.error(`Service connection refused: ${targetService}`);
      return res.status(503).json({
        error: "Service Unavailable",
        message:
          "Could not connect to service. Please ensure the service is running.",
      });
    }

    return res.status(500).json({
      error: "Gateway Error",
      message: error.message || "Unknown error occurred",
    });
  }
};

// Handle multipart form data
const handleMultipartRequest = (
  req: Request,
  res: Response,
  targetService: string,
  targetPath: string
) => {
  const multerMiddleware = upload.any();

  multerMiddleware(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res
        .status(500)
        .json({ error: "File upload error", message: err.message });
    }

    try {
      const url = `${targetService}${targetPath}`;
      console.log("Forwarding multipart request to:", url);
      console.log("Form data fields:", req.body);
      console.log("Files:", req.files);

      const formData = new FormData();

      // Add form fields
      if (req.body) {
        Object.keys(req.body).forEach((key) => {
          formData.append(key, req.body[key]);
        });
      }

      // Add files
      if (Array.isArray(req.files)) {
        req.files.forEach((file) => {
          formData.append(file.fieldname, fs.createReadStream(file.path), {
            filename: file.originalname,
            contentType: file.mimetype,
          });
        });
      }

      // Send the request with axios
      const response = await axios({
        method: req.method,
        url: url,
        data: formData,
        headers: {
          ...formData.getHeaders(),
          ...(req.headers.authorization && {
            Authorization: req.headers.authorization,
          }),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: () => true,
      });

      // Clean up temporary files
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          try {
            fs.unlinkSync(file.path);
          } catch (error) {
            console.error(`Failed to delete temp file ${file.path}:`, error);
          }
        }
      }

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error("Error in multipart request:", error);

      // Clean up temporary files
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          try {
            fs.unlinkSync(file.path);
          } catch (error) {
            console.error(`Failed to delete temp file ${file.path}:`, error);
          }
        }
      }

      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }

      return res.status(500).json({
        error: "Gateway Error",
        message: error.message || "Unknown error occurred",
      });
    }
  });
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "API Gateway is running" });
});

// Auth Service routes
app.all("/api/auth/*", (req, res) => {
  const targetPath = req.url.replace("/api/auth", "/api/v1/auth");
  return forwardRequest(req, res, AUTH_SERVICE, targetPath);
});

app.all("/api/v1/auth/*", (req, res) => {
  return forwardRequest(req, res, AUTH_SERVICE, req.url);
});

// Product Service routes
app.all("/api/products*", (req, res) => {
  const targetPath = req.url.replace("/api/products", "/api/v1/product");
  return forwardRequest(req, res, PRODUCT_SERVICE, targetPath);
});

app.all("/api/v1/product*", (req, res) => {
  return forwardRequest(req, res, PRODUCT_SERVICE, req.url);
});

app.all("/api/v1/categories*", (req, res) => {
  return forwardRequest(req, res, PRODUCT_SERVICE, req.url);
});

// Cart Service routes
app.all("/api/cart*", (req, res) => {
  const targetPath = req.url.replace("/api/cart", "");
  return forwardRequest(req, res, CART_SERVICE, targetPath);
});

// Order Service routes
app.all("/api/orders*", (req, res) => {
  const targetPath = req.url.replace("/api/orders", "/api/v1/order");
  return forwardRequest(req, res, ORDER_SERVICE, targetPath);
});

app.all("/api/v1/order*", (req, res) => {
  return forwardRequest(req, res, ORDER_SERVICE, req.url);
});

// Review Service routes
app.all("/api/reviews*", (req, res) => {
  const targetPath = req.url.replace("/api/reviews", "/api/v1/review");
  return forwardRequest(req, res, REVIEW_SERVICE, targetPath);
});

app.all("/api/v1/review*", (req, res) => {
  return forwardRequest(req, res, REVIEW_SERVICE, req.url);
});

// Webhook endpoint (usually for Stripe)
app.all("/webhook", (req, res) => {
  return forwardRequest(req, res, ORDER_SERVICE, "/webhook");
});

// 404 handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log("Service URLs:");
  console.log(`- Auth: ${AUTH_SERVICE}`);
  console.log(`- Product: ${PRODUCT_SERVICE}`);
  console.log(`- Cart: ${CART_SERVICE}`);
  console.log(`- Order: ${ORDER_SERVICE}`);
  console.log(`- Review: ${REVIEW_SERVICE}`);
});

export default app;
