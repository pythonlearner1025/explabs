import {Vector} from "./types"
import { createSignal, createEffect, onMount } from "solid-js";
import "./styles/cell.css";

const maxCoeff = 1.0

const coeffToAngle = (coeff : number) => {
    return (coeff / maxCoeff) * 360;
}

const angleToCoeff = (angle: number) => {
    return (angle / 360) * maxCoeff 
}

const Knob = ({ vector, onChangeVectorCoeff }: { vector : Vector, onChangeVectorCoeff: (vector : Vector, coeff: number) => void }) => {
  //const [knobRef, setKnobRef] = createSignal<HTMLDivElement>(undefined);
  const [angle, setAngle] = createSignal(coeffToAngle(vector.coeff));
  const [mdown, setMdown] = createSignal(false);
  let knob 
  onMount(() => {
    //const knob = knobRef();
    if (knob) {
      knob.addEventListener("mousedown", handleMouseDown);
      return () => {
        knob.removeEventListener("mousedown", handleMouseDown);
      };
    }
  });

  const handleDrag = (event: MouseEvent) => {
    //const knob = knobRef();
    if (!knob || !mdown()) return;

    const knobRect = knob.getBoundingClientRect();
    const centerX = knobRect.left + knobRect.width / 2;
    const centerY = knobRect.top + knobRect.height / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const radians = Math.atan2(mouseY - centerY, mouseX - centerX);
    const degrees = radians * (180 / Math.PI);
    const normalizedAngle = -90 + (degrees + 180) % 360;

    setAngle(normalizedAngle);
    onChangeVectorCoeff(vector, angleToCoeff(normalizedAngle));
  };

  const handleScroll = (event: WheelEvent) => {
    const delta = event.deltaY > 0 ? -5 : 5;
    setAngle((prev) => {
      const newAngle = (prev + delta + 360) % 360;
      onChangeVectorCoeff(vector, angleToCoeff(newAngle));
      return newAngle;
    });
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (event.buttons === 1) {
        setMdown(true)
        window.addEventListener("mousemove", handleDrag)
        window.addEventListener("mouseup", handleMouseUp)
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    setMdown(false)
    window.removeEventListener("mousemove", handleDrag)
    window.removeEventListener("mouseup", handleMouseUp)
  }

  return (
    <div class="knob-container">
      <div class="knob-name">
        {vector.name}
      </div>
      <div
        ref={knob}
        class="knob-inner"
        onMouseDown={handleDrag}
        onWheel={handleScroll}
        style={{ transform: `rotate(${angle()}deg)` }}
      >
        <svg width="50" height="50" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="14.75" fill={vector.color} stroke="#515151" stroke-width="0.5"/>
        <circle cx="15" cy="15" r="13.2246" fill="#FEFEFE" stroke="black" stroke-width="0.5"/>
        <rect x="15.1844" y="2.02542" width="1.01695" height="2.54237" fill="black"/>
        </svg>
      </div>
      <div class="knob-inner-meter">
        {vector.coeff.toFixed(2)}
      </div>
    </div>
  );
};

export default Knob;