import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const Counter = ({ value, duration = 1.5 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  // once: false enables triggering the animation every time the item scrolls into view (top or bottom)
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    let start = 0;
    const stringVal = String(value);
    
    // Parse the actual number out of strings like "50K+", "50,000+", "4.9/5", "100%", etc.
    // e.g. "50,000+" -> 50000, "4.9/5" -> 4.9, "100%" -> 100
    let cleanString = stringVal.split('/')[0]; // handle "4.9/5" -> "4.9"
    let numericValue = parseFloat(cleanString.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) numericValue = 0;

    let isDecimal = cleanString.includes(".");

    if (isInView) {
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsedTime = (currentTime - startTime) / 1000; // time in seconds
        
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          // Smooth ease-out quad animation
          const easeProgress = progress * (2 - progress);
          const currentCount = start + easeProgress * (numericValue - start);
          
          if (isDecimal) {
            setDisplayValue(currentCount.toFixed(1));
          } else {
            setDisplayValue(Math.floor(currentCount));
          }
          requestAnimationFrame(updateCounter);
        } else {
          setDisplayValue(numericValue);
        }
      };
      
      requestAnimationFrame(updateCounter);
    } else {
      // Reset to 0 when scrolled out of view, so it animates again when scrolled back
      setDisplayValue(0);
    }
  }, [value, isInView, duration]);

  // Format formatting rules based on the original string
  const stringVal = String(value);
  
  const renderFormatted = () => {
    // 1. If original has "50,000+"
    if (stringVal.includes("50,000")) {
      return `${displayValue.toLocaleString()}+`;
    }
    // 2. If original has "50K+"
    if (stringVal.includes("50K")) {
      return `${displayValue}K+`;
    }
    // 3. If original has "500K+"
    if (stringVal.includes("500K")) {
      return `${displayValue}K+`;
    }
    // 4. If original has "1000+"
    if (stringVal.includes("1000")) {
      return `${displayValue}+`;
    }
    // 5. If original has "4.9/5"
    if (stringVal.includes("/5")) {
      return `${displayValue}/5`;
    }
    // 6. If original has "100%"
    if (stringVal.includes("%")) {
      return `${displayValue}%`;
    }
    // 7. If original has a general "+" suffix
    if (stringVal.endsWith("+") && !stringVal.includes("K") && !stringVal.includes(",")) {
      return `${displayValue}+`;
    }
    
    return displayValue;
  };

  return <span ref={ref}>{renderFormatted()}</span>;
};

export default Counter;
