import styles from './styles/App.module.css';
import Controls from "./Controls"
import {Vector, ControlInput} from "./types"
import {onMount, Signal} from "solid-js"

function LeftPanel({ctrlInput, onUpdateVector} : {ctrlInput: any, onUpdateVector : (vec : Vector) => void}) {
  onMount(()=> {
    console.log("leftpanel")
    console.log(ctrlInput)
  })
  return (
    <div class={styles.leftpanel}>
      <div class={styles.controlheader}>
          Controls
      </div>
      <Controls ctrlInput={ctrlInput} onUpdateVector={(vector)=>onUpdateVector(vector)} />
    </div>
  );
}

export default LeftPanel;
