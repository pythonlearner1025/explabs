import styles from "./styles/App.module.css";
import "./styles/cell.css";
import Controls from "./Controls";
import Telemetry from "./Telemetry";
import { Vector, CellData, CellOutput, ControlInput } from "./types.ts";
import {defaultCell} from "./constants.ts"
import TextareaAutosize from "solid-textarea-autosize";
import {createSignal} from "solid-js"

const parseToken = (chunk: string) => {
    const trimmedChunk = chunk.trim();

    if (trimmedChunk === "") return null;

    if (trimmedChunk.includes('<|begin_of_text|>')) {
    return null;
    }

    let parsedChunk = trimmedChunk;
    if (parsedChunk.includes('<|eot_id|>')) {
    parsedChunk = parsedChunk.replace("<|eot_id|>", "");
    }

    try {
    const parsedData = JSON.parse(parsedChunk.replace(/\s+$/, ''));
    if (parsedData.data == null) {
        console.log('null data', { parsedData });
        return null;
    }
    return parsedData;
    } catch (error) {
    console.error("Error parsing chunk:", error);
    return null;
    }
};

function Cell({ 
    playId, 
    cellIdx, 
    data, 
    setCells, 
    ctrlInput
 }: {
    playId : string ,
    cellIdx : number, 
    data: CellData, 
    setCells: any,
    ctrlInput: any
 }) {
  const [lastCtrlInput, setLastCtrlInput] = createSignal(ctrlInput())
  const handlePromptChange = (event: any) => {
    setCells((cells: CellData[]) =>
      cells.map((cell) =>
        cell.id === data.id ? { ...cell, input: { ...cell.input, prompt: event.target.value } } : cell
      )
    );
  };

  const handleVectorChange = (newVector: Vector) => {
    setCells((cells: CellData[]) =>
      cells.map((cell) =>
        cell.id === data.id
          ? { ...cell, input: { ...cell.input, vectors: { ...cell.input.vectors, [newVector.name]: newVector } } }
          : cell
      )
    );
  };

  const handleBaselineChange = (baseline: string[]) => {
    setCells((cells: CellData[]) =>
      cells.map((cell) =>
        cell.id === data.id ? { ...cell, output: { ...cell.output, baseline: baseline } } : cell
      )
    );
  };

  const handleControlChange = (control: string[]) => {
    setCells((cells: CellData[]) =>
      cells.map((cell) =>
        cell.id === data.id ? { ...cell, output: { ...cell.output, control: control } } : cell
      )
    );
  };

  const handleCorrsChange = (corrs: number[]) => {
    setCells((cells: CellData[]) =>
      cells.map((cell) =>
        cell.id === data.id ? { ...cell, output: { ...cell.output, corrs: corrs } } : cell
      )
    );
  };

  const clearControl = () => {
    setCells((cells: CellData[]) => 
      cells.map((cell) => 
        cell.id == data.id ? {...cell, output: {...cell.output, control: []}} : cell 
      )
    );
  };

  const clearBaseline = () => {
    setCells((cells: CellData[]) => 
      cells.map((cell) => 
        cell.id == data.id ? {...cell, output: {...cell.output, baseline: []}} : cell 
      )
    );
  };

  const addNextCell = () => {
    console.log("adding next")
    setCells((cells: CellData[]) => [...cells, defaultCell()]);
  };

  const handlePromptSubmit = async (event: any) => {
    event.preventDefault();
    clearControl();
    //addNextCell();
    const prompt = event.target.value.trim();
    if (prompt !== "") {
      try {
        const isInputEqual = (prevInput: string, currentInput: string): boolean => {
            console.log('isInputEqual')
            console.log(prevInput, currentInput)
            console.log(lastCtrlInput(), ctrlInput())
            
          return prevInput == currentInput //&& lastCtrlInput() == ctrlInput() ;
          // Add more fields to compare here in the future, e.g.:
          // && prevInput.max_length === currentInput.max_length
          // && prevInput.temperature === currentInput.temperature
          // ...
        };

        var inputEq = isInputEqual(prompt, data.input.prompt)
        console.log(inputEq)

        setCells((cells: CellData[]) =>
            cells.map((cell) =>
            cell.id === data.id ? { ...cell, input: { ...cell.input, prompt: event.target.value } } : cell
        ));
        setLastCtrlInput({
            vectors: ctrlInput().vectors
        })
        console.log(lastCtrlInput())

        if (!inputEq) {
            clearBaseline();
        }
        /*
        LOAD TESTING LOL
        for (let i = 0; i < 100; i++) {
            fetch(`http://localhost:4000/chat`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                playId,
                cellIdx,
                prompt,
                type: 'control',
                vecs: Object.values(ctrlInput().vectors),
              }),
            })
        }
        */
        const [baselineResponse, controlResponse] = await Promise.all([
            inputEq && data.output.baseline.length > 0
            ? Promise.resolve(null)
            : fetch(`http://localhost:4000/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  playId,
                  cellIdx,
                  prompt,
                  type: 'baseline',
                  vecs: Object.values(data.input.vectors),
                }),
              }),
              fetch(`http://localhost:4000/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  playId,
                  cellIdx,
                  prompt,
                  type: 'control',
                  vecs: Object.values(ctrlInput().vectors),
                }),
            })
        ]);
  
        const baselineReader = baselineResponse?.body?.getReader();
        const controlReader = controlResponse.body?.getReader();
        const decoder = new TextDecoder("utf-8");
  
        async function readStream(
          reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
          outputKey: keyof CellOutput
        ) {
          if (!reader) {
            return;
          }
          const { done, value } = await reader.read();
          if (done) {
            return;
          }
          const decodedValue = decoder.decode(value, { stream: true });
          const chunks = decodedValue.split("\n");
          for (const chunk of chunks) {
            const tokenObj = parseToken(chunk);
            console.log(tokenObj);
            if (tokenObj !== null) {
              setCells((cells: CellData[]) =>
                cells.map((cell) =>
                  cell.id === data.id
                    ? {
                        ...cell,
                        output: {
                          ...cell.output,
                          [outputKey]: [...cell.output[outputKey], tokenObj.data],
                        },
                      }
                    : cell
                )
              );
            }
          }
          await readStream(reader, outputKey);
        }
  
        await Promise.all([
          readStream(baselineReader, "baseline"),
          readStream(controlReader, "control"),
        ]);
      } catch (error) {
        console.error("Error streaming response:", error);
      } finally {
                
      }
    }
  };

  const handleClear = (type : string) => {
    setCells((cells: CellData[]) => 
        cells.map((cell) => 
          cell.id == data.id ? {...cell, output: {...cell.output, [type]: []}} : cell 
        )
      );
  }

  return (
    <div class="master-container">
      <div class="cell">
        <div class="cell-header">Input</div>
        <div class="cell-contents">
          <div class="content">
            <div class="content-header">Prompt</div>
            <TextareaAutosize
              value={data.input.prompt}
              onChange={handlePromptChange}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  handlePromptSubmit(event);
                }
              }}
              class="prompt-input"
              placeholder="Type here"
            />
          </div>
        </div>
      </div>
      <div class="cell">
        <div class="cell-header">Output</div>
        <div class="cell-contents">
          <div class="content">
            <div class="content-header">Baseline</div>
            {data.output.baseline.length == 0 ? <div class="content-placeholder">Baseline text</div> : 
            <div class="content-text">{data.output.baseline}</div>}
            <div class="content-clear-text" onClick={() => handleClear('baseline')}>clear</div>
          </div>
          <div class="content">
            <div class="content-header">Control</div>
            {data.output.control.length == 0 ? <div class="content-placeholder">Control text</div> : 
            <div class="content-text">{data.output.control}</div>}
            <div class="content-clear-text" onClick={() => handleClear('control')}>clear</div>
          </div>
        </div>
      </div>
      <div class="cell">
        <div class="cell-header">Telemetry</div>
        <div class="cell-contents">
          <div class="content">
            <Telemetry cellOutput={data.output} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cell;
