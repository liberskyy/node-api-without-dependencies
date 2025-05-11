import { createApp } from "./app.ts";

const PORT = parseInt(process.env.PORT) || 3000;
const { server, router } = createApp();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  router.getRoutes().forEach((route) => {
    console.log(`${route.method} ${route.path} registered`);
  });
});
