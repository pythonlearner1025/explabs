import { Trait, Character } from "./types.ts";

const happyTrait: Trait = {
  name: "happy",
  desc: "+",
  coeff: 0,
  color: "#FFE7AA",
  sign: 1
};

const sadTrait: Trait = {
  name: "sad",
  desc: "+",
  coeff: 0,
  color: "#9CACFF",
  sign: 1
};

const angryTrait: Trait = {
  name: "angry",
  desc: "+",
  coeff: 0,
  color: "#FF6F6F",
  sign: 1
};

const refusalTrait: Trait = {
  name: "refusal",
  desc: "-",
  coeff: 0,
  color: "#A020F0",
  sign: 1
};

const disgustTrait: Trait = {
  name: "disgust",
  desc: "+",
  coeff: 0,
  color: "#8B4513",
  sign: 1
};

const fearTrait: Trait = {
  name: "fear",
  desc: "+",
  coeff: 0,
  color: "#000000",
  sign: 1
};

const surpriseTrait: Trait = {
  name: "surprise",
  desc: "+",
  coeff: 0,
  color: "#FFC0CB",
  sign: 1
};

const briefnessTrait: Trait = {
  name: "briefness",
  desc: "+",
  coeff: 0,
  color: "#008000",
  sign: -1 
};

const honestyTrait: Trait = {
  name: "honesty",
  desc:"-",
  coeff: 0,
  color: "#C0C0C0",
  sign: -1
};

export const defaultCharacter: Character = {
  name: "minjunes",
  profile: "",
  bio: "A latent Von Neumann probe",
  traits: {
    [happyTrait.name]: happyTrait,
    [sadTrait.name]: sadTrait,
    [angryTrait.name]: angryTrait,
    [disgustTrait.name]: disgustTrait,
    [fearTrait.name]: fearTrait,
    [surpriseTrait.name]: surpriseTrait,
    [refusalTrait.name]: refusalTrait,
    [briefnessTrait.name]: briefnessTrait,
    [honestyTrait.name]: honestyTrait,
  },
};
