const { APP_KEY } = process.env;
export const sessionConfig = {
  secret: APP_KEY,
  resave: false,
  saveUninitialized: true,
};
