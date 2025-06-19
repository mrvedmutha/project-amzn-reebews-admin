import { NextRequest } from "next/server";
import { errorResponse } from "@/lib/api/responses";

interface ApiKeyValidationResult {
  isValid: boolean;
  error?: string;
  environment?: 'development' | 'production';
}

/**
 * Validates API key against environment variables
 * Supports both environment-specific keys and single key approach
 */
function validateApiKey(providedKey: string): ApiKeyValidationResult {
  if (!providedKey) {
    return { isValid: false, error: "No API key provided" };
  }

  // Remove 'Bearer ' prefix if present
  const cleanKey = providedKey.replace(/^Bearer\s+/i, '').trim();

  // Get environment keys
  const prodKey = process.env.PAYMENT_FLOW_API_KEY_PROD;
  const devKey = process.env.PAYMENT_FLOW_API_KEY_DEV;
  const singleKey = process.env.PAYMENT_FLOW_API_KEY;
  const currentEnv = process.env.NODE_ENV;

  // Approach 1: Environment-specific keys
  if (prodKey || devKey) {
    if (currentEnv === 'production' && cleanKey === prodKey) {
      return { isValid: true, environment: 'production' };
    }
    
    if (currentEnv !== 'production' && cleanKey === devKey) {
      return { isValid: true, environment: 'development' };
    }

    // Allow cross-environment for flexibility (optional)
    if (cleanKey === prodKey) {
      return { isValid: true, environment: 'production' };
    }
    
    if (cleanKey === devKey) {
      return { isValid: true, environment: 'development' };
    }
  }

  // Approach 2: Single key for all environments
  if (singleKey && cleanKey === singleKey) {
    return { 
      isValid: true, 
      environment: currentEnv === 'production' ? 'production' : 'development' 
    };
  }

  return { isValid: false, error: "Invalid API key" };
}

/**
 * Middleware to authenticate API requests using environment-based API keys
 */
export async function authenticateApiKey(req: NextRequest) {
  try {
    // Extract API key from Authorization header
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader) {
      return errorResponse("Missing Authorization header", 401);
    }

    // Validate the API key
    const validation = validateApiKey(authHeader);
    
    if (!validation.isValid) {
      return errorResponse(validation.error || "Invalid API key", 401);
    }

    // Log successful authentication (optional)
    console.log(`API Key authenticated successfully for ${validation.environment} environment`);
    
    return null; // Successful validation, continue to next middleware/handler
  } catch (error) {
    console.error("API key authentication error:", error);
    return errorResponse("Authentication failed", 500);
  }
}

/**
 * Higher-order function to wrap API routes with API key authentication
 */
export function withApiKeyAuth(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const authResult = await authenticateApiKey(req);
    
    if (authResult) {
      return authResult; // Return error response
    }
    
    return handler(req, ...args); // Continue to original handler
  };
}

/**
 * Get client IP address from request
 */
export function getClientIP(req: NextRequest): string | undefined {
  // Check for X-Forwarded-For header (common in production)
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // Check for X-Real-IP header
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback to connection remote address
  return req.ip || undefined;
}

/**
 * Rate limiting cache (in production, use Redis)
 */
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for API key
 */
export function checkRateLimit(
  keyId: string,
  limit: number,
  windowMs: number = 60000 // 1 minute default
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `rateLimit:${keyId}`;

  const current = rateLimitCache.get(key);

  if (!current || now > current.resetTime) {
    // Reset or initialize
    const resetTime = now + windowMs;
    rateLimitCache.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    };
  }

  // Increment count
  current.count += 1;
  rateLimitCache.set(key, current);

  return {
    allowed: true,
    remaining: limit - current.count,
    resetTime: current.resetTime,
  };
}
