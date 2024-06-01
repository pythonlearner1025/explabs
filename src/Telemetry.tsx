import "./styles/cell.css"
import {CellOutput, Vector} from './types'

function Telemetry({ cellOutput }: { cellOutput: CellOutput}) {
    return (
        <div class="content-text">
            Telemetry here
        </div>
    );
}
export default Telemetry;