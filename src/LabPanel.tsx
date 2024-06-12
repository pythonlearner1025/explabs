import styles from './styles/App.module.css';
import Traits from "./Traits"
import {Trait, Character} from "./types"
import {onMount, Signal} from "solid-js"
import tempProfile from './assets/profile.jpeg'; // Importing the image as tempProfile
import TextareaAutosize from "solid-textarea-autosize"; // Import the TextareaAutosize component
import {emptyProfile} from "./constants"


function LabPanel({character, onUpdateCharacter, onNewProfile} : {character : any, onUpdateCharacter : (character: any) => void, onNewProfile : (character:any) => void}) {
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
          <img 
            src={character().profile}
            style={{width: '64px', height: '64px', 'border-radius': '50%'}}
          />
          <img
            class={styles.defaultImg}
            src={emptyProfile}
            style={{width: '64px', height: '64px', 'border-radius': '50%'}}
            onClick={() => {
              console.log("click!", character);
              if (character().name != '' || character().bio != '') {
                onNewProfile(character());
              } else {
                console.log("shit fuck");
                alert("Set name or bio to generate profile picture!");
              }
            }}
          />
          <div class={styles.hoverText}>Generate New</div>
        </div>
        <TextareaAutosize 
        class={styles.profileName} 
        value={character().name} 
        onChange={(e) => {
          onUpdateCharacter({...character(), name: e.target.value})
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); // Prevents adding new lines or spaces
            onUpdateCharacter({...character(), name: e.target.value})
          }
        }}
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
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevents adding new lines or spaces
              onUpdateCharacter({...character(), bio: e.target.value})
            }
          }}
          placeholder="Enter bio here"
          /> 
        </div>
      </div>
      <Traits character={character} onUpdateCharacter={(char)=>onUpdateCharacter(char)} />
    </div>
  );
}

export default LabPanel;
