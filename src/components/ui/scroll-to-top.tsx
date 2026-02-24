import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollToTopButtonProps {
  scrollThreshold?: number;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
}

export const ScrollToTopButton = ({
  scrollThreshold = 300,
  position = "bottom-right",
}: ScrollToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Show button if scrolled down more than threshold
      setIsVisible(scrollTop > scrollThreshold);

      // Check if near bottom (within 100px of bottom)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsAtBottom(isNearBottom && scrollTop > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    // Check initial state
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollThreshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2",
  };

  return (
    <div className={cn("fixed z-40", positionClasses[position])}>
      <div className="flex flex-col gap-2">
        {isAtBottom && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            title="Scroll to top">
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
        {!isAtBottom && (
          <>
            <Button
              onClick={scrollToTop}
              size="icon"
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              title="Scroll to top">
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              onClick={scrollToBottom}
              size="icon"
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white"
              title="Scroll to bottom">
              <ArrowDown className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

// Component that scrolls to top when route changes
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll main element to top
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
    // Also scroll window to top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
