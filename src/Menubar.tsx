import './styles/menu.css';
import {createSignal, createEffect, onCleanup, onMount} from "solid-js"
import prof1 from "./assets/prof1.jpeg";
import prof2 from "./assets/prof2.jpeg";
import prof3 from "./assets/prof3.jpeg";
import question from "./assets/question.png"


function CharacterPreview({character, onSelectCharacter}) {
    return (
        <div class="characterPreview">
            <div class="characterPreview-container" onClick={()=>{
                onSelectCharacter(character)
            }}
                style={{background: character.selected ? "#f0f0f0" : '#ffffff'}}
            >
                <img src={character.profile} class="characterPreview-profile"/>
                <div class="characterPreview-name">{character.name}</div>
            </div>
        </div>
    )
}

function RandomPreview({onCreateNewCharacter}) {
    const [profs, setProfs] = createSignal([prof1, prof2, prof3]);
    const [names, setNames] = createSignal(["Brian", "Aileen", "Qstar"]);
    const [currentIndex, setCurrentIndex] = createSignal(0);
    const [interValid, setInterValid] = createSignal(null);

    const startAnimation = () => {
        const valid = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % profs().length);
        }, 135); // 1000ms / 3fps ≈ 333ms
        setInterValid(valid);
    };

    const stopAnimation = () => {
        clearInterval(interValid());
        setInterValid(null);
        setCurrentIndex(0); // Reset to -1 to show the default state
    };

    createEffect(() => {
        if (!interValid()) {
            clearInterval(interValid());
        }
    });

    return (
        <div class="characterPreview" onMouseEnter={startAnimation} onMouseLeave={stopAnimation}>
            <div class="characterPreview-container" onClick={onCreateNewCharacter}>
                {interValid() === null ? (
                    <>
                        <img src={question} class="characterPreview-profile" />
                        <div class="characterPreview-name">New</div>
                    </>
                ) : (
                    <>
                        <img src={profs()[currentIndex()]} class="characterPreview-profile" />
                        <div class="characterPreview-name">{names()[currentIndex()]}</div>
                    </>
                )}
            </div>
        </div>
    );
}

function Menubar({characters, onSelectCharacter, onCreateNewCharacter}) {
  return (
    <div class="menu">
        <div class="menu-title">
           Characters 
        </div>
        <div class="menu-characters">
            {characters().map(character => {
                return(
                    <CharacterPreview 
                    character={character} 
                    onSelectCharacter={onSelectCharacter}/>
                )
            })}
            <RandomPreview onCreateNewCharacter={onCreateNewCharacter}/>
        </div>
    </div>
  );
}

export default Menubar;
