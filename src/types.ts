
// Define a type for a vector with specified fields
export type Vector = {
    name: string;
    coeff: number;
    desc: string;
    color: string;
    sign: number;
};

// Define the structure for the input part of a cell
export interface CellInput {
    prompt: string;
    vectors: Record<string, Vector>;
}

export interface ControlInput {
    vectors: Record<string, Vector>
}

// Define the structure for the output part of a cell
export interface CellOutput {
    baseline: string[];
    control: string[];
    corrs: number[];
}

// Define the complete cell data structure
export interface CellData {
    id: string;
    input: CellInput;
    output: CellOutput;
}

export interface Token {
    text: string
    corrs: Record<string, number> 
}

export interface Message {
    role: string
    content: string
    tokens: Token[]
    controls: Vector[]
}