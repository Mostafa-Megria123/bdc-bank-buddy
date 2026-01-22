import React from "react";
import { Button } from "@/components/ui/button";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: string[];
  startIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  startIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = React.useState<
    number | null
  >(null);
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);

  React.useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  const resetZoomAndPan = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleClose = React.useCallback(() => {
    resetZoomAndPan();
    setIsPanning(false);
    setInitialPinchDistance(null);
    setTouchStartX(null);
    onClose();
  }, [onClose]);

  const showNextImage = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      resetZoomAndPan();
    },
    [images.length],
  );

  const showPrevImage = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length,
      );
      resetZoomAndPan();
    },
    [images.length],
  );

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowRight") showNextImage();
      else if (e.key === "ArrowLeft") showPrevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose, showNextImage, showPrevImage]);

  const handleCloseOrResetZoom = () => {
    if (zoom > 1) {
      resetZoomAndPan();
    } else {
      handleClose();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      const zoomFactor = 0.1;
      const newZoom = e.deltaY > 0 ? zoom - zoomFactor : zoom + zoomFactor;
      const clampedZoom = Math.max(1, newZoom);
      setZoom(clampedZoom);
      if (clampedZoom <= 1) {
        setPan({ x: 0, y: 0 });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1 || e.button !== 0) return;
    e.preventDefault();
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const getDistance = (touches: React.TouchList | TouchList) => {
    return Math.sqrt(
      Math.pow(touches[0].clientX - touches[1].clientX, 2) +
        Math.pow(touches[0].clientY - touches[1].clientY, 2),
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStartX(e.targetTouches[0].clientX);
      if (zoom > 1) {
        setIsPanning(true);
        setPanStart({
          x: e.touches[0].clientX - pan.x,
          y: e.touches[0].clientY - pan.y,
        });
      }
    } else if (e.touches.length === 2) {
      e.preventDefault();
      setInitialPinchDistance(getDistance(e.touches));
      setIsPanning(false);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null && !isPanning && e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchDiff = touchStartX - touchEndX;
      const minSwipeDistance = 50;
      if (zoom <= 1) {
        if (touchDiff > minSwipeDistance) {
          showNextImage();
        } else if (touchDiff < -minSwipeDistance) {
          showPrevImage();
        }
      }
    }
    setTouchStartX(null);
    setIsPanning(false);
    if (e.touches.length < 2) {
      setInitialPinchDistance(null);
    }
    if (zoom <= 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance !== null) {
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      const newZoom = zoom * (newDistance / initialPinchDistance);
      setZoom(Math.max(1, newZoom));
      setInitialPinchDistance(newDistance);
    } else if (e.touches.length === 1 && isPanning) {
      e.preventDefault();
      setPan({
        x: e.touches[0].clientX - panStart.x,
        y: e.touches[0].clientY - panStart.y,
      });
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageSrc = images[currentIndex];
    if (!imageSrc) return;

    try {
      const response = await fetch(imageSrc);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      const filename = imageSrc.split("/").pop()?.split("?")[0] || "image.jpg";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error downloading image:", error);
      window.open(imageSrc, "_blank");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/80 animate-in fade-in duration-300"
      onClick={handleCloseOrResetZoom}>
      <div
        className="absolute top-4 right-4 z-10 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300"
        style={{ animationDelay: "200ms" }}>
        <Button
          variant="ghost"
          className="h-auto w-auto p-2 rounded-full text-white hover:bg-black/20 hover:text-white/80"
          onClick={handleDownload}
          aria-label="Download image">
          <Download className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          className="h-auto w-auto p-1 rounded-full text-white hover:bg-black/20 hover:text-white/80"
          onClick={handleClose}>
          <X className="h-8 w-8" />
          <span className="sr-only">Close lightbox</span>
        </Button>
      </div>
      <Button
        variant="ghost"
        className="absolute left-4 top-1/2 z-10 h-auto w-auto -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 transition-colors hover:bg-black/40 hover:text-white md:left-10 animate-in fade-in slide-in-from-left-4 duration-300"
        style={{ animationDelay: "200ms" }}
        onClick={showPrevImage}
        aria-label="Previous image">
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <img
        src={images[currentIndex]}
        alt="Lightbox view"
        className="max-w-[90vw] max-h-[90vh] animate-in fade-in zoom-in-95 duration-300 object-contain transition-transform"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          cursor: isPanning ? "grabbing" : zoom > 1 ? "grab" : "default",
          touchAction: "none",
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      />
      <Button
        variant="ghost"
        className="absolute right-4 top-1/2 z-10 h-auto w-auto -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 transition-colors hover:bg-black/40 hover:text-white md:right-10 animate-in fade-in slide-in-from-right-4 duration-300"
        style={{ animationDelay: "200ms" }}
        onClick={showNextImage}
        aria-label="Next image">
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  );
};
