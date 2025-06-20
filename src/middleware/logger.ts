import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.socket.remoteAddress;
  const userAgent = req.get("User-Agent") || "Unknown";

  console.log(
    `[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`
  );

  next();
};
