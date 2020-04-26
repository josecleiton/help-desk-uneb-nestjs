import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

type CallbackType = (err: Error, stat?: boolean) => void;

const whiteList: string[] = [];

if (process.env.NODE_ENV !== 'production') {
  whiteList.push('http://localhost:3000');
}

function origin(origin: string, callback: CallbackType) {
  if (!origin || whiteList.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    callback(
      new Error(`Origem não autorizada pelo CORS Middleware. ${origin}`),
    );
  }
}

export const corsConfig: CorsOptions = {
  origin,
  optionsSuccessStatus: 200,
};
