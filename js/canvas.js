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

  // Adjust canvas bounds for high DPI screens
  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const width  = rect.width  || 320;
    const height = rect.height || 320;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width  = Math.round(width  * dpr);
    this.canvas.height = Math.round(height * dpr);

    // Reset transform first to avoid cumulative scaling on repeated calls
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    this.ctx.lineCap  = "round";
    this.ctx.lineJoin = "round";
  }

  // Convert a client-space point to canvas CSS-pixel space
  _clientToCanvas(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
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

    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth   = this.currentBrushSize;
    this.ctx.lineCap     = "round";
    this.ctx.lineJoin    = "round";

    this.ctx.stroke();
    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clear() {
    // Context is scaled by DPR, so clear in CSS pixel space
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width  || this.canvas.width;
    const h = rect.height || this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);
  }

  setColor(color) {
    this.currentColor = color;
    // Update active class on palette indicators if they exist
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
  // Renders guide strokes on a hidden offscreen canvas, then compares
  // how much of the user's drawn pixels land on top of those guide pixels.
  // Returns a score 0-100 (percentage overlap).
  checkDrawing(strokePaths) {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.round(rect.width)  || 320;
    const h = Math.round(rect.height) || 320;
    const dpr = window.devicePixelRatio || 1;

    // ── 1. Build reference canvas with the guide strokes ──
    const refCanvas = document.createElement("canvas");
    refCanvas.width  = w * dpr;
    refCanvas.height = h * dpr;
    const refCtx = refCanvas.getContext("2d");
    refCtx.scale(dpr, dpr);
    refCtx.clearRect(0, 0, w, h);

    // Draw each SVG path string as a canvas path using Path2D
    const scaleX = w / 109;
    const scaleY = h / 109;

    refCtx.strokeStyle = "#000";
    refCtx.lineWidth   = Math.max(10, w * 0.08) / scaleX; // adjusted for context scaling
    refCtx.lineCap     = "round";
    refCtx.lineJoin    = "round";

    refCtx.save();
    refCtx.scale(scaleX, scaleY);
    for (const d of strokePaths) {
      refCtx.stroke(new Path2D(d));
    }
    refCtx.restore();

    // ── 2. Get pixel data from both canvases ──
    const refData  = refCtx.getImageData(0, 0, refCanvas.width, refCanvas.height).data;
    const userData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;

    let refInked   = 0; // pixels with ink in the reference
    let overlap    = 0; // pixels inked in both

    for (let i = 3; i < refData.length; i += 4) {
      if (refData[i] > 30) {          // reference pixel is opaque
        refInked++;
        if (userData[i] > 30) overlap++; // user also drew here
      }
    }

    if (refInked === 0) return 0;
    return Math.round((overlap / refInked) * 100);
  }

  // Returns true if user drew something (any non-transparent pixels)
  hasDrawing() {
    const data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 10) return true;
    }
    return false;
  }
}
export default TracingCanvas;
