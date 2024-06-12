import styles from './styles/App.module.css';
import Navbar from './Navbar'
import LabPanel from './LabPanel'
import MenuBar from "./Menubar"
import Playground from './Playground'
import Split from 'split-grid'
import { onMount, createSignal } from 'solid-js';
import {
  tintinCharacter, 
  paulCharacter, 
  elonCharacter, 
  blankCharacter, 
  ninaCharacter,
  emptyProfile}
 from "./constants"

// default vectors for 

function generateNewProfile(character) {
  return ''
} 

function App() {
  const [currentPlayground, setCurrentPlayground] = createSignal(crypto.randomUUID())
  const [characters, setCharacters] = createSignal([tintinCharacter, elonCharacter, ninaCharacter, paulCharacter])
  const [selectedCharacter, setSelectedCharacter] = createSignal(tintinCharacter)
  const [gridRef, setGridRef] = createSignal();

  onMount(() => {
    console.log(characters())
    characters().map(char => {
      console.log(char.id)
    })
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
  const handleNewProfile = (character) => {
    const newCharacter = {...character, profile: generateNewProfile(character)}
    const updatedCharacters = characters().map(char => 
      char.id === character.id ? newCharacter : char
    );
    setCharacters(updatedCharacters);
    setSelectedCharacter(newCharacter);
  }

  const handleCharacterUpdate = (character) => {
    const updatedCharacters = characters().map(char => 
      char.id === character.id ? character : char
    );
    setCharacters(updatedCharacters);
    setSelectedCharacter(character)
  }

  const handleCharacterSelect = (character) => {
    const updatedCharacters = characters().map(char => ({
      ...char,
      selected: char === character
    }));
    setCharacters(updatedCharacters);
    setSelectedCharacter(character);
  }

  const handleCreateNewCharacter = () => {
    const newBlankCharacter = {...blankCharacter, id: crypto.randomUUID()};
    setCharacters([...characters(), newBlankCharacter]);
    handleCharacterSelect(newBlankCharacter);
  }

  return (
    <div ref={setGridRef} class={styles.App}>
      <Navbar/>
      <div class={styles.main}>
        <MenuBar characters={characters} onSelectCharacter={handleCharacterSelect} onCreateNewCharacter={handleCreateNewCharacter}/>
        <LabPanel character={selectedCharacter} onUpdateCharacter={handleCharacterUpdate} onNewProfile={handleNewProfile}/>
        <div class={styles.gutter_col_1}></div>
        <Playground character={selectedCharacter} playId={currentPlayground()} clearPlayground={(newid) => {
          setCurrentPlayground(newid)
        }}/>
        <div class={styles.gutter_col_2}></div>
      </div>
    </div>
  );
}

export default App;