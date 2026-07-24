import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Sun,
  Contrast,
  SlidersHorizontal,
  Sparkles,
  Download,
  Check,
  X,
  Image as ImageIcon,
  Wand2,
  ZoomIn,
  ZoomOut,
  Type,
  Maximize2,
  Undo2,
  RefreshCw,
  Upload,
  Link as LinkIcon,
  Copy,
  Layers,
  Circle,
  Square,
  BadgeAlert,
} from "lucide-react";

export interface ImageEditorProps {
  initialImage?: string;
  onSave?: (editedDataUrl: string) => void;
  onClose?: () => void;
  title?: string;
}

export type AspectRatioPreset = "free" | "1:1" | "4:3" | "16:9" | "4:5" | "3:1";

export interface FilterPreset {
  name: string;
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  blur: number;
}

const FILTER_PRESETS: FilterPreset[] = [
  {
    name: "Normal",
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    blur: 0,
  },
  {
    name: "Vintage",
    brightness: 105,
    contrast: 110,
    saturation: 85,
    sepia: 35,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    blur: 0,
  },
  {
    name: "Cyber Neon",
    brightness: 110,
    contrast: 130,
    saturation: 150,
    sepia: 0,
    grayscale: 0,
    hueRotate: 180,
    invert: 0,
    blur: 0,
  },
  {
    name: "Noir B&W",
    brightness: 100,
    contrast: 140,
    saturation: 0,
    sepia: 0,
    grayscale: 100,
    hueRotate: 0,
    invert: 0,
    blur: 0,
  },
  {
    name: "Warm Glow",
    brightness: 110,
    contrast: 105,
    saturation: 125,
    sepia: 15,
    grayscale: 0,
    hueRotate: -15,
    invert: 0,
    blur: 0,
  },
  {
    name: "Cool Tone",
    brightness: 100,
    contrast: 110,
    saturation: 110,
    sepia: 0,
    grayscale: 0,
    hueRotate: 45,
    invert: 0,
    blur: 0,
  },
  {
    name: "Dramatic",
    brightness: 95,
    contrast: 150,
    saturation: 130,
    sepia: 10,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    blur: 0,
  },
];

export const ImageEditor: React.FC<ImageEditorProps> = ({
  initialImage = "",
  onSave,
  onClose,
  title = "TWA Photo Editor & Studio",
}) => {
  const [imageSrc, setImageSrc] = useState<string>(initialImage);
  const [urlInput, setUrlInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"crop" | "adjust" | "filter" | "text" | "export">(
    "crop",
  );

  // Transformations
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>("free");
  const [isCircleCrop, setIsCircleCrop] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0); // degrees: 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(100); // 100% to 300%
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  // Adjustments
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [sepia, setSepia] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [hueRotate, setHueRotate] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);

  // Overlay / Watermark
  const [watermarkText, setWatermarkText] = useState<string>("");
  const [watermarkPos, setWatermarkPos] = useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  >("bottom-right");
  const [watermarkColor, setWatermarkColor] = useState<string>("#ffffff");
  const [showTwaBadge, setShowTwaBadge] = useState<boolean>(false);

  // Export settings
  const [exportQuality, setExportQuality] = useState<number>(92);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setImageSrc(evt.target.result as string);
          resetTransforms();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Load URL
  const handleUrlLoad = () => {
    if (urlInput.trim()) {
      setImageSrc(urlInput.trim());
      setUrlInput("");
      resetTransforms();
    }
  };

  // Reset transforms
  const resetTransforms = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(100);
    setPanX(0);
    setPanY(0);
    setAspectRatio("free");
    setIsCircleCrop(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSepia(0);
    setGrayscale(0);
    setHueRotate(0);
    setInvert(0);
    setBlur(0);
    setWatermarkText("");
    setShowTwaBadge(false);
  };

  // Apply filter preset
  const applyPreset = (preset: FilterPreset) => {
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setSepia(preset.sepia);
    setGrayscale(preset.grayscale);
    setHueRotate(preset.hueRotate);
    setInvert(preset.invert);
    setBlur(preset.blur);
  };

  // Render canvas
  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      imgRef.current = img;
      let targetWidth = img.naturalWidth || 800;
      let targetHeight = img.naturalHeight || 600;

      // Determine aspect ratio dimensions if enforced
      if (aspectRatio === "1:1") {
        const side = Math.min(targetWidth, targetHeight);
        targetWidth = side;
        targetHeight = side;
      } else if (aspectRatio === "4:3") {
        targetHeight = Math.round(targetWidth * (3 / 4));
      } else if (aspectRatio === "16:9") {
        targetHeight = Math.round(targetWidth * (9 / 16));
      } else if (aspectRatio === "4:5") {
        targetHeight = Math.round(targetWidth * (5 / 4));
      } else if (aspectRatio === "3:1") {
        targetHeight = Math.round(targetWidth * (1 / 3));
      }

      // Handle swap if rotated 90 or 270 deg
      const isRotatedVertical = rotation === 90 || rotation === 270;
      canvas.width = isRotatedVertical ? targetHeight : targetWidth;
      canvas.height = isRotatedVertical ? targetWidth : targetHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Apply CSS style filters to canvas context
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) invert(${invert}%) blur(${blur}px)`;

      // Move context origin to center for rotation & scaling
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Rotation & Flip
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Zoom & Pan
      const scaleFactor = zoom / 100;
      ctx.scale(scaleFactor, scaleFactor);
      ctx.translate(panX, panY);

      // Draw Image centered
      ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);

      ctx.restore();

      // Circle Masking if enabled
      if (isCircleCrop) {
        ctx.globalCompositeOperation = "destination-in";
        ctx.beginPath();
        const minRadius = Math.min(canvas.width, canvas.height) / 2;
        ctx.arc(canvas.width / 2, canvas.height / 2, minRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      // Add Text Watermark / Caption
      if (watermarkText.trim()) {
        ctx.save();
        const fontSize = Math.max(16, Math.round(canvas.width / 25));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = watermarkColor;
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 6;

        const textMetrics = ctx.measureText(watermarkText);
        const padding = 12;
        let x = padding;
        let y = padding + fontSize;

        if (watermarkPos === "top-right") {
          x = canvas.width - textMetrics.width - padding;
        } else if (watermarkPos === "bottom-left") {
          y = canvas.height - padding;
        } else if (watermarkPos === "bottom-right") {
          x = canvas.width - textMetrics.width - padding;
          y = canvas.height - padding;
        } else if (watermarkPos === "center") {
          x = (canvas.width - textMetrics.width) / 2;
          y = (canvas.height + fontSize) / 2;
        }

        // Draw pill background
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.roundRect(x - 8, y - fontSize + 2, textMetrics.width + 16, fontSize + 8, 6);
        ctx.fill();

        ctx.fillStyle = watermarkColor;
        ctx.fillText(watermarkText, x, y);
        ctx.restore();
      }

      // Add Official TWA Badge Overlay
      if (showTwaBadge) {
        ctx.save();
        const badgeSize = Math.max(28, Math.round(canvas.width / 18));
        const margin = 16;
        const bx = canvas.width - margin - 140;
        const by = margin;

        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, 130, badgeSize + 10, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("⚡ TECH WIZARD", bx + 10, by + 16);
        ctx.fillStyle = "#60a5fa";
        ctx.font = "10px sans-serif";
        ctx.fillText("SHASC Verified", bx + 10, by + 28);
        ctx.restore();
      }
    };
  }, [
    imageSrc,
    aspectRatio,
    isCircleCrop,
    rotation,
    flipH,
    flipV,
    zoom,
    panX,
    panY,
    brightness,
    contrast,
    saturation,
    sepia,
    grayscale,
    hueRotate,
    invert,
    blur,
    watermarkText,
    watermarkPos,
    watermarkColor,
    showTwaBadge,
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Save / Export
  const getCanvasDataUrl = (): string => {
    if (!canvasRef.current) return "";
    return canvasRef.current.toDataURL("image/png", exportQuality / 100);
  };

  const handleSave = () => {
    const dataUrl = getCanvasDataUrl();
    if (dataUrl && onSave) {
      onSave(dataUrl);
    }
  };

  const handleDownload = () => {
    const dataUrl = getCanvasDataUrl();
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `twa-edited-photo-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    const dataUrl = getCanvasDataUrl();
    if (dataUrl) {
      navigator.clipboard.writeText(dataUrl);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh] w-full max-w-5xl rounded-2xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">{title}</h3>
            <p className="text-[11px] text-muted-foreground">
              Crop, rotate, filter, sharpen &amp; watermark event or profile photos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {imageSrc && (
            <button
              onClick={resetTransforms}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-accent transition-smooth"
              title="Reset all edits"
            >
              <Undo2 className="h-3.5 w-3.5" /> Reset
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-smooth"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-[420px]">
        {/* Left: Canvas / Image Preview Area */}
        <div className="lg:col-span-8 bg-black/90 p-4 flex flex-col items-center justify-center relative overflow-hidden group">
          {imageSrc ? (
            <div className="relative max-w-full max-h-[50vh] lg:max-h-[60vh] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[52vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                <ImageIcon className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Upload or Paste an Image</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Select a local photo from your device or enter an image URL to begin editing
                </p>
              </div>

              {/* Upload controls */}
              <div className="flex flex-col w-full gap-3 pt-2">
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:opacity-90 shadow transition-smooth">
                  <Upload className="h-4 w-4" /> Browse Photo from Device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleUrlLoad}
                    className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-smooth"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Sample buttons */}
                <div className="pt-2 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Or try sample image:
                  </span>
                  <div className="flex gap-2 mt-1.5">
                    <button
                      onClick={() =>
                        setImageSrc(
                          "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
                        )
                      }
                      className="text-xs px-2.5 py-1 rounded-lg border border-white/20 bg-white/5 text-slate-300 hover:bg-white/15"
                    >
                      Tech Event
                    </button>
                    <button
                      onClick={() =>
                        setImageSrc(
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
                        )
                      }
                      className="text-xs px-2.5 py-1 rounded-lg border border-white/20 bg-white/5 text-slate-300 hover:bg-white/15"
                    >
                      Member Avatar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Canvas Toolbar if image is loaded */}
          {imageSrc && (
            <div className="mt-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-smooth">
                <Upload className="h-3.5 w-3.5" /> Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-white/20">|</span>
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1 hover:text-primary transition-smooth"
                title="Rotate 90 degrees"
              >
                <RotateCw className="h-3.5 w-3.5" /> Rotate
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => setFlipH((f) => !f)}
                className={`flex items-center gap-1 hover:text-primary transition-smooth ${flipH ? "text-primary" : ""}`}
                title="Flip horizontal"
              >
                <FlipHorizontal className="h-3.5 w-3.5" /> Flip H
              </button>
            </div>
          )}
        </div>

        {/* Right: Controls & Adjustments Tab Panel */}
        <div className="lg:col-span-4 border-l border-border bg-card flex flex-col h-full overflow-hidden">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-5 border-b border-border bg-muted/20 text-xs">
            {[
              { id: "crop", label: "Crop", icon: Crop },
              { id: "adjust", label: "Tune", icon: SlidersHorizontal },
              { id: "filter", label: "Filter", icon: Sparkles },
              { id: "text", label: "Text", icon: Type },
              { id: "export", label: "Export", icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "crop" | "adjust" | "filter" | "text" | "export")
                  }
                  className={`flex flex-col items-center justify-center py-2.5 gap-1 transition-smooth ${
                    isActive
                      ? "border-b-2 border-primary text-primary font-bold bg-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px]">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
            {/* CROP & TRANSFORM TAB */}
            {activeTab === "crop" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Aspect Ratio Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "free", label: "Free / Original" },
                      { id: "1:1", label: "1:1 Square" },
                      { id: "4:3", label: "4:3 Standard" },
                      { id: "16:9", label: "16:9 Banner" },
                      { id: "4:5", label: "4:5 Portrait" },
                      { id: "3:1", label: "3:1 Header" },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setAspectRatio(preset.id as AspectRatioPreset);
                          setIsCircleCrop(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-smooth ${
                          aspectRatio === preset.id && !isCircleCrop
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-muted/40 border-border hover:bg-accent"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Shape Framing
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsCircleCrop(false)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold transition-smooth ${
                        !isCircleCrop
                          ? "bg-primary/10 border-primary text-primary font-bold"
                          : "bg-muted/30 border-border text-muted-foreground"
                      }`}
                    >
                      <Square className="h-3.5 w-3.5" /> Rectangle
                    </button>
                    <button
                      onClick={() => {
                        setIsCircleCrop(true);
                        setAspectRatio("1:1");
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold transition-smooth ${
                        isCircleCrop
                          ? "bg-primary/10 border-primary text-primary font-bold"
                          : "bg-muted/30 border-border text-muted-foreground"
                      }`}
                    >
                      <Circle className="h-3.5 w-3.5" /> Circle Avatar
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Rotation &amp; Scale
                  </label>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Zoom Level</span>
                      <span className="font-semibold">{zoom}%</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="300"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full accent-primary h-1.5 rounded-lg bg-muted cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setFlipH(!flipH)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-semibold transition-smooth ${
                        flipH
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <FlipHorizontal className="h-3.5 w-3.5" /> Flip H
                    </button>
                    <button
                      onClick={() => setFlipV(!flipV)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-semibold transition-smooth ${
                        flipV
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <FlipVertical className="h-3.5 w-3.5" /> Flip V
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ADJUSTMENTS / TUNE TAB */}
            {activeTab === "adjust" && (
              <div className="space-y-3.5">
                {[
                  {
                    label: "Brightness",
                    value: brightness,
                    set: setBrightness,
                    min: 0,
                    max: 200,
                    def: 100,
                  },
                  {
                    label: "Contrast",
                    value: contrast,
                    set: setContrast,
                    min: 0,
                    max: 200,
                    def: 100,
                  },
                  {
                    label: "Saturation",
                    value: saturation,
                    set: setSaturation,
                    min: 0,
                    max: 200,
                    def: 100,
                  },
                  {
                    label: "Hue Rotate",
                    value: hueRotate,
                    set: setHueRotate,
                    min: 0,
                    max: 360,
                    def: 0,
                    unit: "°",
                  },
                  {
                    label: "Sepia Tones",
                    value: sepia,
                    set: setSepia,
                    min: 0,
                    max: 100,
                    def: 0,
                    unit: "%",
                  },
                  {
                    label: "Grayscale",
                    value: grayscale,
                    set: setGrayscale,
                    min: 0,
                    max: 100,
                    def: 0,
                    unit: "%",
                  },
                  {
                    label: "Blur Softening",
                    value: blur,
                    set: setBlur,
                    min: 0,
                    max: 10,
                    def: 0,
                    unit: "px",
                  },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {item.value}
                        {item.unit || "%"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        value={item.value}
                        onChange={(e) => item.set(Number(e.target.value))}
                        className="flex-1 accent-primary h-1.5 rounded-lg bg-muted cursor-pointer"
                      />
                      {item.value !== item.def && (
                        <button
                          onClick={() => item.set(item.def)}
                          className="text-[10px] text-muted-foreground hover:text-foreground underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FILTERS TAB */}
            {activeTab === "filter" && (
              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Preset Color Effects
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="flex flex-col items-start p-2.5 rounded-xl border border-border bg-muted/30 hover:border-primary/50 hover:bg-accent transition-smooth text-left group"
                    >
                      <span className="font-bold text-xs group-hover:text-primary transition-smooth">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Sat {preset.saturation}% • Con {preset.contrast}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TEXT & WATERMARK TAB */}
            {activeTab === "text" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Text Watermark / Caption
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TWA Hackathon 2026"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {watermarkText && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Caption Position
                      </label>
                      <select
                        value={watermarkPos}
                        onChange={(e) =>
                          setWatermarkPos(
                            e.target.value as
                              "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center",
                          )
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                        <option value="center">Center</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Text Color
                      </label>
                      <div className="flex gap-2">
                        {["#ffffff", "#facc15", "#38bdf8", "#4ade80", "#f87171", "#c084fc"].map(
                          (c) => (
                            <button
                              key={c}
                              onClick={() => setWatermarkColor(c)}
                              style={{ backgroundColor: c }}
                              className={`h-6 w-6 rounded-full border border-black/20 ${
                                watermarkColor === c ? "ring-2 ring-primary ring-offset-1" : ""
                              }`}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-3 border-t border-border">
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-accent transition-smooth">
                    <input
                      type="checkbox"
                      checked={showTwaBadge}
                      onChange={(e) => setShowTwaBadge(e.target.checked)}
                      className="rounded border-border text-primary accent-primary h-4 w-4"
                    />
                    <div>
                      <span className="font-bold text-xs block text-foreground">
                        Add Official TWA Association Watermark
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Includes "Tech Wizard SHASC Verified" badge
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* EXPORT TAB */}
            {activeTab === "export" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      PNG / JPEG Quality
                    </label>
                    <span className="font-mono font-bold text-xs">{exportQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={exportQuality}
                    onChange={(e) => setExportQuality(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 rounded-lg bg-muted cursor-pointer"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground font-semibold text-xs hover:bg-accent transition-smooth"
                  >
                    <Download className="h-4 w-4 text-primary" /> Download High-Res File
                  </button>

                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground font-semibold text-xs hover:bg-accent transition-smooth"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" /> Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-muted-foreground" /> Copy Data URL to
                        Clipboard
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-semibold hover:bg-accent transition-smooth"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!imageSrc}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow hover:opacity-90 disabled:opacity-50 transition-smooth"
            >
              <Check className="h-4 w-4" /> Apply &amp; Save Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface ImageEditorModalProps extends ImageEditorProps {
  isOpen: boolean;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  onClose,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <ImageEditor onClose={onClose} {...props} />
    </div>
  );
};
