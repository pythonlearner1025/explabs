import styles from './styles/App.module.css';
import './styles/cell.css'

// each cell has these subcomponents
// input
// - control
// output
// graphics

/*
   cell data structure
    - input
        - prompt
        - control
            - [vectors]
    - output
        - baseline
            - [str]
        - control  
            - [{text: str, control_corrs: [float]}]
        - graphics_track
            - [vectors]
        - graphics_panel
            - [vectors]

    TODO
        - use typescript
        - vector datatype 
        - leftpane;: vector library
        - rightpanel: model control
        - notebook: cells + metadata (title, date, history trace)
*/

function Cell({ data, onUpdate }) {
    const handleInputChange = (event) => {
        // Call the onUpdate function passed from the parent component
        onUpdate(data.id, event.target.value);
    };

    return (
        <div>
            <input value={data.content} onChange={handleInputChange} />
        </div>
    );
}

export default Cell;