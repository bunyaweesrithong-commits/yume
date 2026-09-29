import { useState, useEffect } from "react";
import galleryItems from "../data/galleryData.js";
import "../styles/Gallery.css";

 
function Gallery() {

const [adultConfirmed, setAdultConfirmed] = useState(false);
const [activeFilter, setActiveFilter] = useState("all");
const [selectedImage, setSelectedImage] = useState(null);
const [showAdultWarning, setShowAdultWarning] = useState(false);
  // กรองรูปตาม Category
  const filteredItems =
  activeFilter === "all"
    ? galleryItems.filter((item) => item.category !== "adult")
    : galleryItems.filter(
        (item) => item.category === activeFilter
      );

  // Keyboard controls
  useEffect(() => {

    if (!selectedImage) return;

    const handleKeyDown = (event) => {

      const currentIndex = filteredItems.findIndex(
        (item) => item.image === selectedImage.image
      );

      // ← Previous
      if (event.key === "ArrowLeft") {

        const previousIndex =
          currentIndex === 0
            ? filteredItems.length - 1
            : currentIndex - 1;

        setSelectedImage(filteredItems[previousIndex]);
      }

      // → Next
      if (event.key === "ArrowRight") {

        const nextIndex =
          currentIndex === filteredItems.length - 1
            ? 0
            : currentIndex + 1;

        setSelectedImage(filteredItems[nextIndex]);
      }

      // ESC
      if (event.key === "Escape") {
        setSelectedImage(null);
      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [selectedImage, filteredItems]);

  return (
    <main className="gallery-page">

      {/* =========================
          Gallery Header
      ========================= */}

      <header className="gallery-header">

        <p className="gallery-label">
          ARTWORK & ILLUSTRATION
        </p>

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

        <button
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>

        <button
  className={`shiyo-tomura-filter ${
    activeFilter === "shiyo-tomura" 
    ? "active" 
    : ""
                                              }`}
  onClick={() => setActiveFilter("shiyo-tomura")}
    >
      Shiyo × Tomura
      </button>

        <button
            className={`shiyo-dabi-filter ${
            activeFilter === "shiyo-dabi" 
            ? "active" 
            : ""
                                            }`}
            onClick={() => setActiveFilter("shiyo-dabi")}
              >
                    Shiyo × Dabi
              </button>

        <button
          className={
            activeFilter === "shiyo-tomu-dabi"
              ? "active"
              : ""
          }
          onClick={() => setActiveFilter("shiyo-tomu-dabi")}
        >
          Shiyo × Tomura × Dabi
        </button>

         <button
          className={
            activeFilter === "shiyo"
              ? "active"
              : ""
          }
          onClick={() => setActiveFilter("shiyo")}
        >
          Shiyo
        </button>

        <button
          className={
            activeFilter === "templates"
              ? "active"
              : ""
          }
          onClick={() => setActiveFilter("templates")}
        >
          Templates
        </button>

        <button
          className={
            activeFilter === "others"
              ? "active"
              : ""
          }
          onClick={() => setActiveFilter("others")}
        >
          Others
        </button>

       <button
  className={`adult-zone-filter ${
    activeFilter === "adult" ? "active" : ""
  }`}
  onClick={() => {
    setShowAdultWarning(true);
  }}
>
  🔞 Adult Zone
</button>

      </div>

{/* =========================
    Gallery Grid
========================= */}

<div className="gallery-grid">

  {filteredItems.map((item) => (

    <div
      className={`gallery-card ${
        item.category === "adult" && !adultConfirmed
          ? "adult-blurred"
          : ""
      }`}
      key={item.image}
      onClick={() => {
        if (item.category === "adult" && !adultConfirmed) {
          return;
        }

        setSelectedImage(item);
      }}
    >

      <img
        src={item.image}
        alt="Artwork"
        loading="lazy"
      />

    </div>

  ))}

</div>
        {/* =========================
          Lightbox
      ========================= */}

      {/* =========================
    Adult Warning
========================= */}

{showAdultWarning && (
  <div
    className="adult-warning-overlay"
    onClick={() => setShowAdultWarning(false)}
  >

    <div
      className="adult-warning-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="adult-warning-icon">
        🔞
      </div>

      <h2>Adult Zone</h2>

      <p>
        This section may contain mature content.
      </p>

      <p className="adult-warning-small">
        Please confirm that you want to enter this section.
      </p>

      <div className="adult-warning-buttons">

        <button
          className="adult-cancel"
          onClick={() => {
            setShowAdultWarning(false);
            setActiveFilter("all");
          }}
        >
          Cancel
        </button>

        <button
          className="adult-confirm"
          onClick={() => {
            setAdultConfirmed(true);
            setActiveFilter("adult");
            setShowAdultWarning(false);
          }}
        >
          I Understand
        </button>

      </div>

    </div>

  </div>
)}

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
  onClick={() => {
    const currentIndex = filteredItems.findIndex(
      (item) => item.image === selectedImage.image
    );

    const previousIndex =
      currentIndex === 0
        ? filteredItems.length - 1
        : currentIndex - 1;

    setSelectedImage(filteredItems[previousIndex]);
  }}
>
  ‹
</button>


          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={selectedImage.image}
              alt="Artwork"
            />

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
            onClick={() => {
              const currentIndex = filteredItems.findIndex(
                (item) => item.image === selectedImage.image
                );

    const nextIndex =
      currentIndex === filteredItems.length - 1
        ? 0
        : currentIndex + 1;

    setSelectedImage(filteredItems[nextIndex]);
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