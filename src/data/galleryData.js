// ดึงรูปทั้งหมดใน src/gallery/<หมวด>/ อัตโนมัติ
const files = import.meta.glob(
  "../gallery/*/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP}",
  { eager: true, import: "default" }
);

// ลำดับหมวดตอนกด All (หมวดไหนอยู่บนสุด) ถ้าอยากสลับ ให้สลับในลิสต์นี้
const CATEGORY_ORDER = [
  "shiyo-tomu-dabi",
  "shiyo-tomura",
  "shiyo-dabi",
  "shiyo",
  "templates",
  "others",
];
const rank = (path) => {
  const category = path.split("/").slice(-2, -1)[0];
  const i = CATEGORY_ORDER.indexOf(category);
  return i === -1 ? CATEGORY_ORDER.length : i;
};

const galleryItems = Object.entries(files)
  .sort(([a], [b]) =>
    rank(a) - rank(b) ||
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