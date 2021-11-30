const excludeRoutes = (endpoints, middleware) => (req, res, next) => (
  endpoints.find((endpoint) => req.path === endpoint.path && req.method === endpoint.method)
    ? next() : middleware(req, res, next)
);

export default excludeRoutes;
