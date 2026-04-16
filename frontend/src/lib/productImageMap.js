export function resolveProductImage(imageKey) {
  if (typeof imageKey === "string" && /^https?:\/\//i.test(imageKey.trim())) {
    return imageKey.trim();
  }

  return "";
}

export function resolveProductImages(imageKeys = []) {
  if (!Array.isArray(imageKeys) || imageKeys.length === 0) {
    return [];
  }

  return imageKeys
    .map((key) => resolveProductImage(key))
    .filter((url) => Boolean(url));
}
