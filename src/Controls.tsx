import "./styles/cell.css"
import {CellInput, Vector, ControlInput} from './types'
import Knob from "./Knob"
import Slider from "./Slider"
import {onMount} from "solid-js"

function Controls({ ctrlInput, onUpdateVector }: { ctrlInput: Signal<ControlInput>, onUpdateVector: (newVector: Vector) => void }) {

    onMount(()=>{
        console.log(ctrlInput().vectors)
    })

    const handleVectorChange = (vector : Vector, newCoeff : number) => {
        // Call the onUpdate function passed from the parent component
        const updatedVector = {...vector, coeff: newCoeff};
        onUpdateVector(updatedVector);
    };

    const handleResetCoeffs = () => {
        Object.values(ctrlInput().vectors).map(vector => {
            const updatedVector = {...vector, coeff: 0}; 
            onUpdateVector(updatedVector)
        })
    }

    return (
        <div class="controls">
            <div class="controls-reset" onClick={handleResetCoeffs}>reset</div>
            <div class="controls-container">
                {Object.values(ctrlInput().vectors).map((vector, idx) => {
                    return (
                        <Slider
                        vector={vector}
                        onChangeVectorCoeff={handleVectorChange}
                        />
                    );
                })}
            </div>
        </div>
    ); 
}
export default Controls;