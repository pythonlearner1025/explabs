import styles from './styles/App.module.css';
import Navbar from './Navbar'
import LabPanel from './LabPanel'
import MenuBar from "./Menubar"
import Playground from './Playground'
import Split from 'split-grid'
import { onMount, createSignal } from 'solid-js';
import {defaultCharacter} from "./constants"

// default vectors for 

function App() {
  const [currentPlayground, setCurrentPlayground] = createSignal(crypto.randomUUID())
  const [characters, setCharacters] = createSignal([])
  const [character, setCharacter] = createSignal(defaultCharacter)
  const [gridRef, setGridRef] = createSignal();

  onMount(() => {
    Split({
      columnGutters: [{
        track: 1,
        element: gridRef().querySelector('[class*="gutter_col_1"]'),
      }, {
        track: 3,
        element: gridRef().querySelector('[class*="gutter_col_2"]'),
      }]
    });
  });

  const handleCharacterUpdate = (character) => {
    setCharacter(character)
  }

  const handleCharacterSelect = (character) => {
    setCharacter(character)
  }

  const handleCreateNewCharacter = (character) => {
    
  }

  return (
    <div ref={setGridRef} class={styles.App}>
      <Navbar/>
      <div class={styles.main}>
        <MenuBar characters={characters} onSelectCharacter={handleCharacterSelect} onCreateNewCharacter={handleCreateNewCharacter}/>
        <LabPanel character={character} onUpdateCharacter={handleCharacterUpdate}/>
        <div class={styles.gutter_col_1}></div>
        <Playground character={character} playId={currentPlayground()} clearPlayground={(newid) => {
          setCurrentPlayground(newid)
        }}/>
        <div class={styles.gutter_col_2}></div>
      </div>
    </div>
  );
}

export default App;