import { Options } from 'express-rate-limit';
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } = process.env;
export const rateLimitConfig: Options = {
  windowMs: (parseInt(RATE_LIMIT_WINDOW_MS) || 60) * 1000,
  max: parseInt(RATE_LIMIT_MAX) || 20,
};
