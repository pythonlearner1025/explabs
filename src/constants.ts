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
  color: "#008000",
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
  color: "#8B4513",
  sign: -1 
};

const honestyTrait: Trait = {
  name: "honesty",
  desc:"-",
  coeff: 0,
  color: "#C0C0C0",
  sign: -1
};

export const emptyProfile = 'https://preview.colorkit.co/color/f0f0f0.png?size=wallpaper&static=true'

export const blankCharacter: Character = {
  name: "",
  profile: emptyProfile,
  bio: "",
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
  selected: false,
  id: crypto.randomUUID()
};

export const tintinCharacter: Character = {
  name: "TinTin",
  profile: "https://cdn001.tintin.com/public/tintin/img/static/tintin/tintin-motobike.png",
  bio: "Tintin is a Belgian reporter and adventurer known for his bravery, intelligence, and keen sense of justice. Tintin travels the world solving mysteries and uncovering criminal activities.  ",
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
  selected: false,
  id: crypto.randomUUID()
};

export const paulCharacter: Character = {
  name: "Paul Atreides",
  profile: "https://pbs.twimg.com/profile_images/1315296052279468032/CPsWl148_400x400.jpg",
  bio: "Born into a web of intrigue and power struggles, I've honed my skills in strategy, combat, and justice. Fighting for what's right, one way or another.",
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
  selected: false,
  id: crypto.randomUUID()
};

export const elonCharacter: Character = {
  name: "Elon Musk",
  profile: "https://pbs.twimg.com/profile_images/1780044485541699584/p78MCn3B_400x400.jpg",
  bio: "Entrepreneur, Engineer, Rocketman and friend",
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
  selected: false,
  id: crypto.randomUUID()
};


export const ninaCharacter: Character = {
  name: "Nina Sayers",
  profile: "https://static1.personality-database.com/profile_images/538fecf2938849ee8ed685d7d73a139f.png",
  bio: "A talented but fragile ballerina who wins the lead role in Swan Lake. Her drive for perfection and the pressure of embodying both the innocent White Swan and the seductive Black Swan lead to her gradual mental breakdown.",
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
  selected: false,
  id: crypto.randomUUID()
};