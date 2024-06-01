import styles from "./styles/App.module.css";
import { createSignal, onCleanup } from "solid-js";
import Cell from "./Cell";
import { Vector, CellData, ControlInput } from "./types.ts";
import { defaultCell } from "./constants.ts";
import "./styles/playground.css";

function Playground({ playId, clearPlayground, ctrlInput }: { playId: string, clearPlayground : (id: string) => void, ctrlInput:any }) {
  const [cells, setCells] = createSignal([defaultCell()]);

  const saveState = () => {
    // Implement saving to backend here
  };

  // Warn user about unsaved changes on page refresh
  const handleBeforeUnload = (event: any) => {
    event.preventDefault();
    event.returnValue = ""; // Standard for most browsers
    return "You have unsaved changes! Are you sure you want to leave?";
  };

  const handleResetPlayground = () => {
    fetch(`http://localhost:4000/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playId,
        }),
        }
    )
    setCells([defaultCell()])
    clearPlayground(crypto.randomUUID())
  }

  // TODO enable in prod
  //window.addEventListener('beforeunload', handleBeforeUnload);

  // Cleanup before component unmounts
  onCleanup(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  return (
    <div class="playground-container">
      <div class="header-container">
        <div class="header-title">Playground</div>
        <div class="playground-clear" onClick={handleResetPlayground}>reset</div>
      </div>
      <div class="cells-container">
        {cells().map((cellData, idx) => (
            <Cell playId={playId} cellIdx={idx} data={cellData} setCells={setCells} ctrlInput={ctrlInput} />
        ))}
      </div>
    </div>
  );
}

export default Playground;
