import { CellData, Vector, ControlInput } from "./types.ts";

const happyVector: Vector = {
  name: "happy",
  desc: "+",
  coeff: 0,
  color: "#FFE7AA",
  sign: 1
};

const sadVector: Vector = {
  name: "sad",
  desc: "+",
  coeff: 0,
  color: "#9CACFF",
  sign: 1
};

const angryVector: Vector = {
  name: "angry",
  desc: "+",
  coeff: 0,
  color: "#FF6F6F",
  sign: 1
};

const refusalVector: Vector = {
  name: "refusal",
  desc: "-",
  coeff: 0,
  color: "#A020F0",
  sign: 1
};

const disgustVector: Vector = {
  name: "disgust",
  desc: "+",
  coeff: 0,
  color: "#8B4513",
  sign: 1
};

const fearVector: Vector = {
  name: "fear",
  desc: "+",
  coeff: 0,
  color: "#000000",
  sign: 1
};

const surpriseVector: Vector = {
  name: "surprise",
  desc: "+",
  coeff: 0,
  color: "#FFC0CB",
  sign: 1
};

const briefnessVector: Vector = {
  name: "briefness",
  desc: "+",
  coeff: 0,
  color: "#008000",
  sign: -1 
};

const honestyVector: Vector = {
  name: "honesty",
  desc:"+",
  coeff: 0,
  color: "#C0C0C0",
  sign: 1
};

export const defaultControlInput: ControlInput = {
  vectors: {
    [happyVector.name]: happyVector,
    [sadVector.name]: sadVector,
    [angryVector.name]: angryVector,
    [disgustVector.name]: disgustVector,
    [fearVector.name]: fearVector,
    [surpriseVector.name]: surpriseVector,
    [refusalVector.name]: refusalVector,
    [briefnessVector.name]: briefnessVector,
    [honestyVector.name]: honestyVector,
  },
};
