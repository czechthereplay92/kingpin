// Netlify sets this header on every request with the real client IP,
// for both classic and v2-style functions. context.ip is also present
// in most runtimes, so we check that first and fall back to headers.
export function getClientIp(req, context) {
  if (context && context.ip) return context.ip;
  const nfHeader = req.headers.get("x-nf-client-connection-ip");
  if (nfHeader) return nfHeader;
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
