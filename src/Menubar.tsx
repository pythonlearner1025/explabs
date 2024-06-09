import './styles/menu.css';
import logo from './assets/favicon.ico';
import {defaultCharacter} from "./constants.ts"
import {createSignal, createEffect, onCleanup} from "solid-js"
import profile from "./assets/profile.jpeg"
import prof1 from "./assets/prof1.jpeg";
import prof2 from "./assets/prof2.jpeg";
import prof3 from "./assets/prof3.jpeg";
import question from "./assets/question.png"

function CharacterPreview({character, onSelectCharacter}) {
    const [selected, setSelected] = createSignal(false)
    return (
        <div class="characterPreview">
            <div class="characterPreview-container" onClick={()=>{
                onSelectCharacter(defaultCharacter)
                setSelected(selected() ? false : true)
            }}
                style={{background: selected() == true ? "#f0f0f0" : '#fffff'}}
            >
                <img src={profile} class="characterPreview-profile"/>
                <div class="characterPreview-name">{defaultCharacter.name}</div>
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
        }, 333); // 1000ms / 3fps ≈ 333ms
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
  //<img src={null} alt="Logo" className={styles.logo} />
  return (
    <div class="menu">
        <div class="menu-title">
           Characters 
        </div>
        <div class="menu-characters">
            <CharacterPreview
                character={null}
                onSelectCharacter={onSelectCharacter}/>
             <CharacterPreview
                character={null}
                onSelectCharacter={onSelectCharacter}/>
            {characters().map(character => {
                <CharacterPreview 
                character={character} 
                onSelectCharacter={onSelectCharacter}/>
            })}
            <RandomPreview onCreateNewCharacter={onCreateNewCharacter}/>
        </div>
    </div>
  );
}

export default Menubar;
