import "./styles/traits.css"
import {Character, Trait} from './types'
import Slider from "./Slider"
import {Signal, onMount} from "solid-js"

function Traits({ character, onUpdateCharacter }: 
    { character: any, onUpdateCharacter: (character: Character) => void }) {

    onMount(()=>{
        console.log(character())
    })

    const handleTraitChange = (trait : Trait, newCoeff : number) => {
        console.log('b')
        const updatedTrait = {...trait, coeff: newCoeff};
        console.log(character())
        const newCharacter : Character = {
            ...character(),
            traits: {
                ...character().traits,
                [trait.name]: updatedTrait
            }
        };
        onUpdateCharacter(newCharacter);
    };

    const handleResetTraits = () => {
        console.log('a')
        Object.values(character().traits).map(trait => {
            handleTraitChange(trait, 0)
        })
    }

    return (
        <div class="traits">
            <div class="traits-header">
                <div class="traits-title">Traits</div>
                <div class="traits-reset" onClick={handleResetTraits}>reset</div>
            </div>
            <div class="traits-container">
                {character().traits && Object.values(character().traits).map((trait, idx) => {
                    return (
                        <Slider
                        trait={trait}
                        onChangeTraitCoeff={handleTraitChange}
                        />
                    );
                })}
            </div>
        </div>
    ); 
}
export default Traits;