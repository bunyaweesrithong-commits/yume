// ดึงรูปทั้งหมดใน src/gallery/<หมวด>/ อัตโนมัติ
const files = import.meta.glob(
  "../gallery/*/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP}",
  { eager: true, import: "default" }
);

const galleryItems = Object.entries(files)
  .sort(([a], [b]) =>
    a.localeCompare(b, undefined, { numeric: true })
  )
  .map(([path, url]) => {
    const parts = path.split("/");
    parts.pop();
    const category = parts.pop();

    return {
      image: url,
      category,
    };
  });

export default galleryItems;