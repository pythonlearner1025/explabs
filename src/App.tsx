// App.jsx
import { onMount, createSignal } from 'solid-js';
import Split from 'split-grid';
import TextareaAutosize from "solid-textarea-autosize";
import { tintinCharacter, paulCharacter, elonCharacter, blankCharacter, ninaCharacter, emptyProfile } from "./constants";
import prof1 from "./assets/prof1.jpeg";
import prof2 from "./assets/prof2.jpeg";
import prof3 from "./assets/prof3.jpeg";
import question from "./assets/question.png";
import Traits from "./Traits";
import Playground from './Playground';

function generateNewProfile(character) {
  return '';
}

function CharacterPreview({ character, onSelectCharacter }) {
  return (
    <div >
      <div

        onClick={() => {
          onSelectCharacter(character);
        }}

      >
        <img src={character.profile} class="w-16 h-16 rounded-full" />
        <div >{character.name}</div>
      </div>
    </div>
  );
}

function RandomPreview({ onCreateNewCharacter }) {
  const [profs, setProfs] = createSignal([prof1, prof2, prof3]);
  const [names, setNames] = createSignal(["Brian", "Aileen", "Qstar"]);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [interValid, setInterValid] = createSignal(null);

  const startAnimation = () => {
    const valid = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % profs().length);
    }, 135);
    setInterValid(valid);
  };

  const stopAnimation = () => {
    clearInterval(interValid());
    setInterValid(null);
    setCurrentIndex(0);
  };

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
            <img src={profs()[currentIndex()]} class="w-16 h-16 rounded-full" />
            <div class="characterPreview-name">{names()[currentIndex()]}</div>
          </>
        )}
      </div>
    </div>
  );
}

function Menubar({ characters, onSelectCharacter, onCreateNewCharacter }) {
  return (
    <div class="flex flex-col w-full">
      <div class="flex">
        {characters().map((character) => (
          <CharacterPreview character={character} onSelectCharacter={onSelectCharacter} />
        ))}
        {/* <RandomPreview onCreateNewCharacter={onCreateNewCharacter} /> */}
      </div>
    </div>
  );
}

function LabPanel({ character, onUpdateCharacter, onNewProfile }) {
  onMount(() => {
    character();
  });

  return (
    <div class="flex flex-col w-full">
      <div class="flex flex-col items-center">
        <div class="relative">
          <img
            src={character().profile}
            class="w-2 h-2 rounded-full"
          />
          <img
            src={emptyProfile}
            class="w-2 h-2 rounded-full absolute top-0 left-0 cursor-pointer"
            onClick={() => {
              if (character().name !== '' || character().bio !== '') {
                onNewProfile(character());
              } else {
                alert("Set name or bio to generate profile picture!");
              }
            }}
          />
          <div class="absolute top-0 left-0 w-16 h-16 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 text-white text-xs">
            Generate New
          </div>
        </div>
        <TextareaAutosize
          class="w-full text-center text-lg font-bold my-2"
          value={character().name}
          onChange={(e) => {
            onUpdateCharacter({ ...character(), name: e.target.value });
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onUpdateCharacter({ ...character(), name: e.target.value });
            }
          }}
          placeholder="Enter name here"
        />
        <div class="w-full">
          <div class="text-sm font-bold mb-1">Bio</div>
          <TextareaAutosize
            class="w-full text-sm"
            value={character().bio}
            onChange={(e) => onUpdateCharacter({ ...character(), bio: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onUpdateCharacter({ ...character(), bio: e.target.value });
              }
            }}
            placeholder="Enter bio here"
          />
        </div>
      </div>
      <Traits character={character} onUpdateCharacter={(char) => onUpdateCharacter(char)} />
    </div>
  );
}


function App() {
  const [currentPlayground, setCurrentPlayground] = createSignal(crypto.randomUUID());
  const [characters, setCharacters] = createSignal([tintinCharacter, elonCharacter, ninaCharacter, paulCharacter]);
  const [selectedCharacter, setSelectedCharacter] = createSignal(tintinCharacter);
  const [gridRef, setGridRef] = createSignal();

  const handleNewProfile = (character) => {
    const newCharacter = { ...character, profile: generateNewProfile(character) };
    const updatedCharacters = characters().map((char) => (char.id === character.id ? newCharacter : char));
    setCharacters(updatedCharacters);
    setSelectedCharacter(newCharacter);
  };

  const handleCharacterUpdate = (character) => {
    const updatedCharacters = characters().map((char) => (char.id === character.id ? character : char));
    setCharacters(updatedCharacters);
    setSelectedCharacter(character);
  };

  const handleCharacterSelect = (character) => {
    const updatedCharacters = characters().map((char) => ({
      ...char,
      selected: char === character,
    }));
    setCharacters(updatedCharacters);
    setSelectedCharacter(character);
  };

  const handleCreateNewCharacter = () => {
    const newBlankCharacter = { ...blankCharacter, id: crypto.randomUUID() };
    setCharacters([...characters(), newBlankCharacter]);
    handleCharacterSelect(newBlankCharacter);
  };

  return (
    <div ref={setGridRef} class="flex p-8 h-screen">
      <div class="flex flex-col w-1/5" >
        <Menubar
          characters={characters}
          onSelectCharacter={handleCharacterSelect}
          onCreateNewCharacter={handleCreateNewCharacter}
        />
        <LabPanel
          character={selectedCharacter}
          onUpdateCharacter={handleCharacterUpdate}
          onNewProfile={handleNewProfile}
        />
      </div>
      <div class='w-4/5 h-full'>
        <Playground
          character={selectedCharacter}
          playId={currentPlayground()}
          clearPlayground={(newid) => {
            setCurrentPlayground(newid);
          }}
        />
      </div>
    </div>
  );
}

export default App;