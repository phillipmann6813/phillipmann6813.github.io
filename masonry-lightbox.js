// Masonry + Animated Lightbox Script
document.addEventListener("DOMContentLoaded", () => {
    // ---- Masonry Layout ----
    const setupMasonry = () => {
      const galleries = document.querySelectorAll(".gallery");
      galleries.forEach(gallery => {
        const imgs = gallery.querySelectorAll("img");
        let loaded = 0;
        imgs.forEach(img => {
          if (img.complete) loaded++;
          else img.onload = () => {
            loaded++;
            if (loaded === imgs.length) new MasonryLayout(gallery, 10);
          };
        });
        if (loaded === imgs.length) new MasonryLayout(gallery, 10);
      });
    };
  
    class MasonryLayout {
      constructor(container, gap) {
        this.container = container;
        this.gap = gap;
        this.columns = [];
        this.resize();
        window.addEventListener("resize", () => this.resize());
      }
  
      resize() {
        this.container.style.position = "relative";
        const columnCount = Math.max(1, Math.floor(this.container.clientWidth / 300));
        this.columns = Array(columnCount).fill(0);
        this.layout();
      }
  
      layout() {
        const items = this.container.querySelectorAll("img, video");
        items.forEach(item => {
          const minCol = this.columns.indexOf(Math.min(...this.columns));
          const columnWidth = this.container.clientWidth / this.columns.length;
          const x = columnWidth * minCol;
          const y = this.columns[minCol];
          const width = columnWidth - this.gap;
  
          item.style.position = "absolute";
          item.style.width = `${width}px`;
          item.style.left = `${x}px`;
          item.style.top = `${y}px`;
          item.style.borderRadius = "10px";
          item.style.transition = "transform 0.3s ease";
  
          this.columns[minCol] += item.clientHeight + this.gap;
        });
        this.container.style.height = Math.max(...this.columns) + "px";
      }
    }
  
    // ---- Lightbox ----
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.innerHTML = `
      <span id="close">&times;</span>
      <img id="lightbox-img">
      <button id="prev">&#10094;</button>
      <button id="next">&#10095;</button>
    `;
    document.body.appendChild(lightbox);
  
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
  
    let currentIndex = 0;
    let currentGallery = [];
  
    const openLightbox = (src, gallery, index) => {
      currentGallery = Array.from(gallery.querySelectorAll("img"));
      currentIndex = index;
      lightbox.style.display = "flex";
      lightbox.classList.add("fade-in");
      lightboxImg.src = src;
      document.body.style.overflow = "hidden"; // Prevent background scroll
    };
  
    const closeLightbox = () => {
      lightbox.classList.remove("fade-in");
      lightbox.classList.add("fade-out");
      setTimeout(() => {
        lightbox.style.display = "none";
        lightbox.classList.remove("fade-out");
        document.body.style.overflow = "auto";
      }, 200);
    };
  
    const showImage = index => {
      if (currentGallery.length === 0) return;
      currentIndex = (index + currentGallery.length) % currentGallery.length;
      lightboxImg.classList.add("fade-img");
      setTimeout(() => {
        lightboxImg.src = currentGallery[currentIndex].src;
        lightboxImg.classList.remove("fade-img");
      }, 150);
    };
  
    // Event listeners
    document.querySelectorAll(".gallery img").forEach((img, index) => {
      img.addEventListener("click", e => {
        const gallery = e.target.closest(".gallery");
        const imgs = Array.from(gallery.querySelectorAll("img"));
        const idx = imgs.indexOf(e.target);
        openLightbox(e.target.src, gallery, idx);
      });
    });
  
    closeBtn.onclick = closeLightbox;
    prevBtn.onclick = () => showImage(currentIndex - 1);
    nextBtn.onclick = () => showImage(currentIndex + 1);
  
    // Keyboard navigation
    document.addEventListener("keydown", e => {
      if (lightbox.style.display !== "flex") return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    });
  
    setupMasonry();
  });
  