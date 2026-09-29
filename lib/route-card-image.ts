/** Home route circles — files under /public/images/routes/ */
const ROUTE_CIRCLE_IMAGES: Record<string, string> = {
  "chennai-to-coimbatore": "/images/routes/chennai-to-coimbatore.jpg",
  "chennai-to-salem": "/images/routes/chennai-to-salem.jpg",
  "chennai-to-trichy": "/images/routes/chennai-to-trichy.png",
};

export function getRouteCardImagePath(slug: string): string {
  return ROUTE_CIRCLE_IMAGES[slug] ?? "/images/routes/route-default.jpg";
}
