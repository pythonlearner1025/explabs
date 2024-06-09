import { Signal, createSignal, createEffect, onCleanup, onMount } from "solid-js";
import "./styles/slider.css";
import { Vector } from "./types";

const maxCoeff = 1.0;
const scrollSpeed = 0.1; // Adjust this value to increase/decrease scroll sensitivity

const Slider = ({ vector, onChangeVectorCoeff }: { vector: Vector, onChangeVectorCoeff: (vector: Vector, coeff: number) => void }) => {
  const [sliderRef, setSliderRef] = createSignal(null)
  const [coeff, setCoeff] = createSignal(vector.coeff);
  const [isDragging, setIsDragging] = createSignal(false);
  const [startX, setStartX] = createSignal(0);
  const [rect, setRect] = createSignal(null);

  onMount(() => {
    setRect(sliderRef().getBoundingClientRect())
    window.addEventListener('resize', ()=> {setRect(sliderRef().getBoundingClientRect())});
  });

  const handleScroll = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -scrollSpeed : scrollSpeed;
    setCoeff((prev) => {
      const newCoeff = Math.min(Math.max(prev + delta, 0), maxCoeff);
      onChangeVectorCoeff(vector, newCoeff);
      return newCoeff;
    });
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (rect()) {
      //console.log(rect())
      const clickX = event.clientX - rect().left;
      const newCoeff = Math.min(Math.max(clickX / rect().width, 0), maxCoeff);
      setCoeff(newCoeff);
      onChangeVectorCoeff(vector, newCoeff);
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
    const dx =  mouseX - startX();
    //console.log(dx)
    var newCoeff = coeff() + dx/rect().width;
    setStartX(mouseX);
    setCoeff(Math.min(Math.max(newCoeff, 0), maxCoeff));
    onChangeVectorCoeff(vector, newCoeff);
  };

  const handleMouseUp = () => {
    //console.log("called")
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleClick = (event: MouseEvent) => {
    if (rect()) {
      const clickX = event.clientX - rect().left;
      const newCoeff = Math.min(Math.max(clickX / rect().width, 0), maxCoeff);
      setCoeff(newCoeff);
      onChangeVectorCoeff(vector, newCoeff);
    }
  };

  function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }
  
  function computeColor(hexColor: string, coeff: number): string {
    const rgb = hexToRgb(hexColor);
    const [r, g, b] = rgb;
    const scaledR = Math.round(r);
    const scaledG = Math.round(g);
    const scaledB = Math.round(b);
    return `rgba(${scaledR}, ${scaledG}, ${scaledB}, ${coeff})`;
  }

  return (
    <div class="slider">
      <div class="slider-container">
        <div class="slider-header">
          <div class="slider-header-desc">
          {vector.desc}
          </div>
          <div class="slider-header-name">
           {vector.name}
          </div>
        </div>
          <div class="slider-container-inner">
            <div
              class="slider-bar"
              ref={setSliderRef}
              onWheel={handleScroll}
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              style={{
                background: `linear-gradient(to right, ${computeColor(vector.color, coeff() / maxCoeff)} 0%, ${computeColor(vector.color, coeff() / maxCoeff)} ${(coeff() / maxCoeff) * 100}%, #eee ${(coeff() / maxCoeff) * 100}%, #eee 100%)`,

              }}
            >
              <div class="slider-dividers">
                {Array.from({ length: Math.floor(1 / scrollSpeed)+1}, (_, i) => (
                  <div class="slider-divider" />
                ))}
              </div>
            </div>
            <div class="slider-value">
              {(Math.min(Math.max(coeff(),0), 1.0)*100).toFixed(0)}%
            </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
