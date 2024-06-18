import { Signal, createSignal, createEffect, onCleanup, onMount } from "solid-js";
// import "./styles/slider.css";
import { Trait } from "./types";

const maxCoeff = 1.0;
const scrollSpeed = 0.1; // Adjust this value to increase/decrease scroll sensitivity

const Slider = ({ trait, onChangeTraitCoeff }: { trait: Trait, onChangeTraitCoeff: (trait: Trait, coeff: number) => void }) => {
  const [sliderRef, setSliderRef] = createSignal(null)
  const [coeff, setCoeff] = createSignal(trait.coeff);
  const [isDragging, setIsDragging] = createSignal(false);
  const [startX, setStartX] = createSignal(0);
  const [rect, setRect] = createSignal(null);

  onMount(() => {
    setRect(sliderRef().getBoundingClientRect())
    window.addEventListener('resize', () => {
      setRect(sliderRef().getBoundingClientRect())
    });
  });

  const handleScroll = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -scrollSpeed : scrollSpeed;
    setCoeff((prev) => {
      const newCoeff = Math.min(Math.max(prev + delta, 0), maxCoeff);
      onChangeTraitCoeff(trait, newCoeff);
      return newCoeff;
    });
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (rect()) {
      const clickX = event.clientX - rect().left;
      const newCoeff = Math.min(Math.max(clickX / rect().width, 0), maxCoeff);
      setCoeff(newCoeff);
      onChangeTraitCoeff(trait, newCoeff);
    }
    setIsDragging(true);
    setStartX(event.clientX);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const mouseX = event.clientX
    if (!isDragging()) return;
    if ((mouseX < rect().x && coeff() <= 0) || (mouseX > rect().x + rect().width && coeff() >= maxCoeff)) {
      return;
    }
    const dx = mouseX - startX();
    var newCoeff = coeff() + dx / rect().width;
    setStartX(mouseX);
    setCoeff(Math.min(Math.max(newCoeff, 0), maxCoeff));
    onChangeTraitCoeff(trait, newCoeff);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleClick = (event: MouseEvent) => {
    if (rect()) {
      const clickX = event.clientX - rect().left;
      const newCoeff = Math.min(Math.max(clickX / rect().width, 0), maxCoeff);
      setCoeff(newCoeff);
      onChangeTraitCoeff(trait, newCoeff);
    }
  };

  function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  function computeColor(hexColor: string, idx: number): string {
    const total = Math.floor(1 / scrollSpeed);
    const scale = idx / total;
    const rgb = hexToRgb(hexColor);
    const [r, g, b] = rgb;

    let scaledR = r;
    let scaledG = g;
    let scaledB = b;

    if (r === g && g === b) {
      // If all colors have the same value, scale by alpha only
      return `rgba(${r}, ${g}, ${b}, ${scale + 0.35})`;
    } else {
      // Find the dominant and least dominant color directions
      const maxColor = Math.max(r, g, b);
      const minColor = Math.min(r, g, b);
      const dominantColor = maxColor === r ? 'r' : maxColor === g ? 'g' : 'b';
      const leastDominantColor = minColor === r ? 'r' : minColor === g ? 'g' : 'b';

      // Scale the dominant color towards 255 and the least dominant color towards 0
      if (dominantColor === 'r') {
        scaledR = Math.round(r + (255 - r) * scale);
      } else if (dominantColor === 'g') {
        scaledG = Math.round(g + (255 - g) * scale);
      } else {
        scaledB = Math.round(b + (255 - b) * scale);
      }

      if (leastDominantColor === 'r') {
        scaledR = Math.round(r - r * scale);
      } else if (leastDominantColor === 'g') {
        scaledG = Math.round(g - g * scale);
      } else {
        scaledB = Math.round(b - b * scale);
      }
    }

    return `rgba(${scaledR}, ${scaledG}, ${scaledB}, ${scale + 0.35})`;
  }

  function unitWidth() {
    if (!rect()) return 0;
    const divRem = 0.15
    const total = Math.floor(1 / scrollSpeed)
    const unitWidth = (rect().width / 16 - divRem * (total - 1)) / total;
    return unitWidth
  }

  function calcWidth(i) {
    if (!rect()) return 0;
    const total = Math.floor(1 / scrollSpeed);
    const divRem = 0.15; // 2px / 16px (assuming default root font size is 16px)
    const unitWidth = (rect().width / 16 - divRem * (total - 1)) / total;
    const currWidth = coeff() * rect().width / 16;
    const currX = (i * divRem) + unitWidth * i;
    if (coeff() > 0) {
      const w = currWidth - currX > 0 ? Math.min(currWidth - currX, unitWidth) : 0;
      return w;
    }
    return 0;
  }
  return (
    <div class="w-full">
      <div class="flex flex-col items-center mb-1 w-full">
        <div class="text-left mt-2 text-xs self-start flex flex-row">
          <div class="mr-0.5">
            {trait.desc}
          </div>
          <div>
            {trait.name}
          </div>
        </div>
        <div class="flex flex-row items-center w-full">
          <div
            class="mt-2 mb-2 flex-grow h-5 w-full relative bg-[#2f2727] cursor-pointer"
            ref={setSliderRef}
            onWheel={handleScroll}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            style={{
              background: `#eee`,
            }}
          >
            <div class="absolute top-0 left-0 w-full h-full flex pointer-events-none z-1">
              {Array.from({ length: Math.floor(1 / scrollSpeed) }, (_, i) => (
                <>
                  <div class="h-full bg-[#f0f0f0]" style={{ width: `${unitWidth()}rem` }} />
                  {i !== Math.floor(1 / scrollSpeed) - 1 && (
                    <div class="w-0.5 h-full bg-white" />
                  )}
                </>
              ))}
            </div>
            <div class="absolute top-0 left-0 w-full h-full flex pointer-events-none z-2">
              {Array.from({ length: Math.floor(1 / scrollSpeed) }, (_, i) => (
                <>
                  <div
                    class="h-full"
                    style={{ width: `${calcWidth(i)}rem`, background: computeColor(trait.color, i) }}
                  />
                  {i !== Math.floor(1 / scrollSpeed) - 1 && (
                    <div class="w-0.5 h-full bg-transparent" />
                  )}
                </>
              ))}
            </div>
          </div>
          <div class="rounded text-center text-xs w-1/5">
            {(Math.min(Math.max(coeff(), 0), 1.0) * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
