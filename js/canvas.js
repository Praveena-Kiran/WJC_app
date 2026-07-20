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

    // Mouse drawing
    this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e.offsetX, e.offsetY));
    this.canvas.addEventListener("mousemove", (e) => this.draw(e.offsetX, e.offsetY));
    this.canvas.addEventListener("mouseup", () => this.stopDrawing());
    this.canvas.addEventListener("mouseout", () => this.stopDrawing());

    // Touch drawing (for responsive/mobile screens)
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.startDrawing(x, y);
    });

    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.draw(x, y);
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
    const width = rect.width || 320;
    const height = rect.height || 320;

    // Use Device Pixel Ratio for clean drawing
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    
    // Scale drawing context to match device scale
    this.ctx.scale(dpr, dpr);
    
    // Restore styling parameters
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    
    // Redraw guide parameters if needed, otherwise clear
    this.clear();
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    [this.lastX, this.lastY] = [x, y];
  }

  draw(x, y) {
    if (!this.isDrawing) return;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.currentBrushSize;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    
    this.ctx.stroke();
    [this.lastX, this.lastY] = [x, y];
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clear() {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);
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
}
export default TracingCanvas;
