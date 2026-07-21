// Tracing Canvas Controller for Kanji Practice Board

export class TracingCanvas {
  constructor(canvasElement, brushSizeElement, clearBtnElement, colorPaletteContainer) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.brushSizeInput = brushSizeElement;
    this.clearBtn = clearBtnElement;
    this.colorPalette = colorPaletteContainer;

    this.isDrawing = false;
    this.currentColor = "#ff7597"; // Default hot pink for dark, will sync with theme
    this.currentBrushSize = 5;
    
    this.lastX = 0;
    this.lastY = 0;

    this.setupListeners();
    this.resizeCanvas();
  }

  // Bind all mouse, touch, and controls listeners
  setupListeners() {
    // Resize handler
    window.addEventListener("resize", () => this.resizeCanvas());

    // Mouse drawing — use getBoundingClientRect so coords are correct inside modals
    this.canvas.addEventListener("mousedown", (e) => {
      const p = this._clientToCanvas(e.clientX, e.clientY);
      this.startDrawing(p.x, p.y);
    });
    this.canvas.addEventListener("mousemove", (e) => {
      const p = this._clientToCanvas(e.clientX, e.clientY);
      this.draw(p.x, p.y);
    });
    this.canvas.addEventListener("mouseup",  () => this.stopDrawing());
    this.canvas.addEventListener("mouseout", () => this.stopDrawing());

    // Touch drawing (for responsive/mobile screens)
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const p = this._clientToCanvas(touch.clientX, touch.clientY);
      this.startDrawing(p.x, p.y);
    });

    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const p = this._clientToCanvas(touch.clientX, touch.clientY);
      this.draw(p.x, p.y);
    });

    this.canvas.addEventListener("touchend", () => this.stopDrawing());

    // Brush Size
    if (this.brushSizeInput) {
      this.brushSizeInput.addEventListener("input", (e) => {
        this.currentBrushSize = parseInt(e.target.value, 10);
      });
    }

    // Clear Button
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => this.clear());
    }

    // Color Palette Selection
    if (this.colorPalette) {
      this.colorPalette.addEventListener("click", (e) => {
        const dot = e.target.closest(".color-dot");
        if (dot) {
          // Remove active class from all color dots
          this.colorPalette.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
          dot.classList.add("active");
          this.currentColor = dot.dataset.color;
        }
      });
    }
  }

  // Adjust canvas bounds to a fixed high-quality resolution (512x512)
  resizeCanvas() {
    const size = 512;
    if (this.canvas.width !== size || this.canvas.height !== size) {
      this.canvas.width = size;
      this.canvas.height = size;
    }
    this.ctx.lineCap  = "round";
    this.ctx.lineJoin = "round";
  }

  // Convert a client-space point to canvas coordinates (fixed 512x512 space)
  _clientToCanvas(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 1;
    const h = rect.height || 1;
    return {
      x: ((clientX - rect.left) / w) * 512,
      y: ((clientY - rect.top) / h) * 512
    };
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    this.lastX = x;
    this.lastY = y;
  }

  draw(x, y) {
    if (!this.isDrawing) return;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);

    // Dynamic stroke size relative to layout width to keep it matching selected brush size
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 512;
    const displayScale = 512 / w;

    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth   = this.currentBrushSize * displayScale;
    this.ctx.lineCap     = "round";
    this.ctx.lineJoin = "round";

    this.ctx.stroke();
    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clear() {
    this.ctx.clearRect(0, 0, 512, 512);
  }

  setColor(color) {
    this.currentColor = color;
    if (this.colorPalette) {
      this.colorPalette.querySelectorAll(".color-dot").forEach(dot => {
        if (dot.dataset.color === color) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }
  }

  // ─── Check Accuracy ────────────────────────────────────────────
  // Renders guide strokes on a 512x512 reference canvas, then compares overlap.
  checkDrawing(strokePaths) {
    const size = 512;

    // ── 1. Build reference canvas with the guide strokes ──
    const refCanvas = document.createElement("canvas");
    refCanvas.width  = size;
    refCanvas.height = size;
    const refCtx = refCanvas.getContext("2d");
    refCtx.clearRect(0, 0, size, size);

    // Draw each SVG path string using Path2D
    const scaleX = size / 109;
    const scaleY = size / 109;

    refCtx.strokeStyle = "#000";
    refCtx.lineWidth   = Math.max(10, size * 0.08) / scaleX;
    refCtx.lineCap     = "round";
    refCtx.lineJoin    = "round";

    refCtx.save();
    refCtx.scale(scaleX, scaleY);
    for (const d of strokePaths) {
      refCtx.stroke(new Path2D(d));
    }
    refCtx.restore();

    // ── 2. Get pixel data from both 512x512 canvases ──
    const refData  = refCtx.getImageData(0, 0, size, size).data;
    const userData = this.ctx.getImageData(0, 0, size, size).data;

    let refInked   = 0;
    let overlap    = 0;

    for (let i = 3; i < refData.length; i += 4) {
      if (refData[i] > 30) {
        refInked++;
        if (userData[i] > 30) overlap++;
      }
    }

    if (refInked === 0) return 0;
    return Math.round((overlap / refInked) * 100);
  }

  // Returns true if user drew something
  hasDrawing() {
    const data = this.ctx.getImageData(0, 0, 512, 512).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 10) return true;
    }
    return false;
  }
}
export default TracingCanvas;
