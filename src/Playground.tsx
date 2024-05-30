import styles from "./styles/App.module.css"
import { createSignal, onCleanup } from "solid-js";
import Cell from "./Cell";

const defaultCell = {
  content: "test"
}

function Playground() {
    const [cells, setCells] = createSignal([defaultCell]);

    const saveState = () => {
        // Implement saving to backend here
    };

    const updateCellContent = (id, newContent) => {
      setCells(cells => cells.map(cell => 
          cell.id === id ? { ...cell, content: newContent } : cell
      ));
  };
    // Warn user about unsaved changes on page refresh
    const handleBeforeUnload = (event: any) => {
        event.preventDefault();
        event.returnValue = ''; // Standard for most browsers
        return 'You have unsaved changes! Are you sure you want to leave?';
    };

    // Add event listener when component mounts
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup before component unmounts
    onCleanup(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    });

    return (
        <div class={styles.playground}>
            {cells().map(cellData => (
                <Cell key={cellData.id} data={cellData} onUpdate={updateCellContent} />
            ))}
        </div>
    );
}

export default Playground;