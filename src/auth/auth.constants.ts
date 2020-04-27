const { NODE_ENV } = process.env;
export const jwtSecretKey = process.env.APP_KEY;
export const expiresIn = NODE_ENV !== 'production' ? '7 days' : '1 year';
export const jwtQueryParameterWebSocket = 'token';
