export const getImageSrc = (image, size = 100) => {
  // Case 1: Base64 image object (current system)
  if (image && image.data && image.contentType) {
    return `data:${image.contentType};base64,${image.data}`;
  }

  // Case 2: Already base64 string
  if (typeof image === "string" && image.startsWith("data:image")) {
    return image;
  }

  // Case 3: Full URL (e.g., Cloudinary or external images)
  if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
    return image;
  }

  // Case 4: Image path string (future-proof)
  if (typeof image === "string" && image.length > 0) {
    return `${import.meta.env.VITE_API_URL}/${image}`;
  }

  // Fallback
  return `https://via.placeholder.com/${size}`;
};
