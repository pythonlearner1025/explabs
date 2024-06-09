import styles from './styles/App.module.css';
import Traits from "./Traits"
import {Trait, Character} from "./types"
import {onMount, Signal} from "solid-js"
import tempProfile from './assets/profile.jpeg'; // Importing the image as tempProfile
import TextareaAutosize from "solid-textarea-autosize"; // Import the TextareaAutosize component


function CharacterPanel({character, onUpdateCharacter} : {character : any, onUpdateCharacter : (character: any) => void}) {
  onMount(()=> {
    character()
  })
  return (
    <div class={styles.leftpanel}>
      <div class={styles.controlheader}>
         Laboratory   
      </div>
      <div class={styles.profile}>
        <div class={styles.profilePic}>
          <img src={tempProfile} style={{ width: '64px', height: '64px', 'border-radius': '50%' }}></img> {/* Using the imported image in a circular frame */}
        </div>
        <TextareaAutosize 
        class={styles.profileName} 
        value={character().name} 
        onChange={(e) => 
          onUpdateCharacter({...character(), name: e.target.value})
        }
        placeholder="Enter name here"
         /> 
        <div class={styles.profileBio}>
          <div class={styles.profileBioTitle}>Bio</div>
          <TextareaAutosize 
          class={styles.profileBioContent} 
          value={character().bio} 
          onChange={(e) => 
            onUpdateCharacter({...character(), bio: e.target.value})
          } 
          placeholder="Enter bio here"
          /> 
        </div>
        <Traits character={character} onUpdateCharacter={(char)=>onUpdateCharacter(char)} />
      </div>
    </div>
  );
}

export default CharacterPanel;
