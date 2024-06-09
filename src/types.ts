
// Define a type for a vector with specified fields
export type Trait = {
    name: string;
    coeff: number;
    desc: string;
    color: string;
    sign: number;
};

export interface Character {
    profile: string; // URL to the character's image
    name: string
    bio: string
    traits: Record<string, Trait>
}

export interface Token {
    text: string
    corrs: Record<string, number> 
}

export interface Message {
    role: string
    content: string
    tokens: Token[]
    controls: Trait[]
}