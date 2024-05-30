import styles from './styles/App.module.css';
import Navbar from './Navbar'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import Playground from './Playground'
import Split from 'split-grid'
import { onMount, createSignal } from 'solid-js';

function App() {
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

  return (
    <div ref={setGridRef} class={styles.App}>
      <Navbar/>
      <div class={styles.main}>
        <LeftPanel/>
        <div class={styles.gutter_col_1}></div>
        <Playground/>
        <div class={styles.gutter_col_2}></div>
        <RightPanel/>
      </div>
    </div>
  );
}

export default App;