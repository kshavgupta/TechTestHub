export default function notFoundMiddleware(req, res) {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found on this server.",
  });
}
