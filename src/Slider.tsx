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
      console.log(rect())
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
    var newCoeff = coeff() + dx/rect().width;
    setStartX(mouseX);
    setCoeff(Math.min(Math.max(newCoeff, 0), maxCoeff));
    onChangeVectorCoeff(vector, newCoeff);
  };

  const handleMouseUp = () => {
    console.log("called")
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

  return (
    <div class="slider">
      <div class="slider-container">
        <div class="slider-name">{vector.name}</div>
          <div class="slider-container-inner">
            <div
              class="slider-bar"
              ref={setSliderRef}
              onWheel={handleScroll}
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              style={{
                background: `linear-gradient(to right, ${vector.color} 0%, ${vector.color} ${coeff()/maxCoeff*100}%, #eee ${coeff()/maxCoeff*100}%, #eee 100%)`,
              }}
            >
            </div>
            <div class="slider-value">
              {Math.min(Math.max(coeff(),0), 1.0).toFixed(2)}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
