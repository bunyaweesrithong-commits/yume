import { useState, useEffect } from "react";
import galleryItems from "../data/galleryData.js";
import "../styles/Gallery.css";

// หมวดที่ต้องเตือนก่อนเข้า
const warningZones = {
  adult: {
    icon: "🔞",
    title: "Adult Zone",
    text: "This section may contain mature content.",
  },
  sims4: {
    icon: "🔞",
    title: "The Sims 4",
    text: "This section may contain mature content.",
  },
};

// ปุ่ม filter ปกติ
const filters = [
  { id: "all", label: "All" },
  { id: "shiyo-tomura", label: "Shiyo × Tomura", className: "shiyo-tomura-filter" },
  { id: "shiyo-dabi", label: "Shiyo × Dabi", className: "shiyo-dabi-filter" },
  { id: "shiyo-tomu-dabi", label: "Shiyo × Tomura × Dabi" },
  { id: "shiyo", label: "Shiyo" },
  { id: "templates", label: "Templates" },
  { id: "others", label: "Others" },
];

function Gallery() {

  const [confirmedZones, setConfirmedZones] = useState([]);
  const [pendingZone, setPendingZone] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  // กรองรูปตาม Category
  const filteredItems =
    activeFilter === "all"
      ? galleryItems.filter((item) => !warningZones[item.category])
      : galleryItems.filter((item) => item.category === activeFilter);

  const isLocked = (category) =>
    Boolean(warningZones[category]) && !confirmedZones.includes(category);

  // กดปุ่มหมวดที่มีคำเตือน
  const openZone = (zone) => {
    if (confirmedZones.includes(zone)) {
      setActiveFilter(zone);
    } else {
      setPendingZone(zone);
    }
  };

  const showPrevious = () => {
    const currentIndex = filteredItems.findIndex(
      (item) => item.image === selectedImage.image
    );
    const previousIndex =
      currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    setSelectedImage(filteredItems[previousIndex]);
  };

  const showNext = () => {
    const currentIndex = filteredItems.findIndex(
      (item) => item.image === selectedImage.image
    );
    const nextIndex =
      currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(filteredItems[nextIndex]);
  };

  // Keyboard controls
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <main className="gallery-page">

      {/* =========================
          Gallery Header
      ========================= */}

      <header className="gallery-header">

        <p className="gallery-label">ARTWORK & ILLUSTRATION</p>

        <h1>Gallery</h1>

        <p className="gallery-intro">
          A collection of artwork, illustrations,
          and moments from Commission.
        </p>

        <p className="gallery-note">
          📌 หมายเหตุ: เครดิตนักวาดดูได้ที่อัลบั้ม Facebook
          เนื่องจากรูปเยอะมาก ไม่สามารถใส่เครดิตแยกทีละรูปได้
          <br />
          <a
            href="https://www.facebook.com/media/set/?set=a.4571749323092464&type=3"
            target="_blank"
            rel="noopener"
          >
            ดูเครดิตนักวาดในอัลบั้ม Facebook →
          </a>
        </p>

      </header>


      {/* =========================
          Filter
      ========================= */}

      <div className="gallery-filter">

        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`${filter.className ?? ""} ${
              activeFilter === filter.id ? "active" : ""
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}

        {Object.entries(warningZones).map(([zone, info]) => (
          <button
            key={zone}
            className={`adult-zone-filter ${
              activeFilter === zone ? "active" : ""
            }`}
            onClick={() => openZone(zone)}
          >
            {info.icon} {info.title}
          </button>
        ))}

      </div>


      {/* =========================
          Gallery Grid
      ========================= */}

      <div className="gallery-grid">

        {filteredItems.map((item) => (
          <div
            className={`gallery-card ${
              isLocked(item.category) ? "adult-blurred" : ""
            }`}
            key={item.image}
            onClick={() => {
              if (isLocked(item.category)) return;
              setSelectedImage(item);
            }}
          >
            <img src={item.image} alt="Artwork" loading="lazy" />
          </div>
        ))}

      </div>


      {/* =========================
          Warning Modal
      ========================= */}

      {pendingZone && (
        <div
          className="adult-warning-overlay"
          onClick={() => setPendingZone(null)}
        >
          <div
            className="adult-warning-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="adult-warning-icon">
              {warningZones[pendingZone].icon}
            </div>

            <h2>{warningZones[pendingZone].title}</h2>

            <p>{warningZones[pendingZone].text}</p>

            <p className="adult-warning-small">
              Please confirm that you want to enter this section.
            </p>

            <div className="adult-warning-buttons">

              <button
                className="adult-cancel"
                onClick={() => {
                  setPendingZone(null);
                  setActiveFilter("all");
                }}
              >
                Cancel
              </button>

              <button
                className="adult-confirm"
                onClick={() => {
                  setConfirmedZones((zones) => [...zones, pendingZone]);
                  setActiveFilter(pendingZone);
                  setPendingZone(null);
                }}
              >
                I Understand
              </button>

            </div>

          </div>
        </div>
      )}


      {/* =========================
          Lightbox
      ========================= */}

      {selectedImage && (
        <div
          className="lightbox"
          onClick={() => setSelectedImage(null)}
        >

          <button
            className="lightbox-close"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>

          <button
            className="lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrevious();
            }}
          >
            ‹
          </button>

          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedImage.image} alt="Artwork" />
          </div>

          <div className="lightbox-counter">
            {filteredItems.findIndex(
              (item) => item.image === selectedImage.image
            ) + 1}
            {" / "}
            {filteredItems.length}
          </div>

          <button
            className="lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            ›
          </button>

        </div>
      )}

    </main>
  );
}

export default Gallery;