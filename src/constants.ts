import { CellData, Vector, ControlInput } from "./types.ts";

const happyVector: Vector = {
  name: "happy",
  desc: "",
  coeff: 0,
  color: "#FFE7AA",
};

const sadVector: Vector = {
  name: "sad",
  desc: "",
  coeff: 0,
  color: "#9CACFF",
};

const angryVector: Vector = {
  name: "angry",
  desc: "",
  coeff: 0,
  color: "#FF6F6F",
};

const refusalVector : Vector = {
    name: "refusal",
    desc: "",
    coeff: 0,
    color: "#A020F0"
}

export const defaultControlInput : ControlInput = {
    vectors: {
    [happyVector.name] : happyVector,
    [sadVector.name]: sadVector,
    [angryVector.name]: angryVector,
    [refusalVector.name]: refusalVector 
    }
}

export const defaultCell = () => ({
  id: crypto.randomUUID(),
  input: {
    prompt: "",
    vectors: {
      [happyVector.name]: happyVector,
      [sadVector.name]: sadVector,
      [angryVector.name]: angryVector,
      [refusalVector.name]: refusalVector
    },
  },
  output: {
    baseline: [],
    control: [],
    corrs: [],
  },
});
