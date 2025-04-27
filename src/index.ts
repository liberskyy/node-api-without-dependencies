import { createApp } from "./app.ts";

// Only run this if this file is the main module (not imported)
const PORT = parseInt(process.env.PORT) || 3000;
const { server, router } = createApp();

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  router.getRoutes().forEach((route) => {
    console.log(`${route.method} ${route.path} registered`);
  });
});
