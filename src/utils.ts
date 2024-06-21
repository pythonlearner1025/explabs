export type LLMToken = { data: string, error: string | undefined }

export const parseToken = (chunk: string): LLMToken | null  => {
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
    if (parsedData.data == null && parsedData.error == null) {
        console.log('null data', { parsedData });
        return null;
    }
    return parsedData;
    } catch (error) {
        console.error("Error parsing chunk:", error);
    return null;
    }
};

export const parseErrorMsg = (msg : string) => {
    if (msg.includes("CUDA out of memory")) {
        return "The message you submitted was too long, please reload and submit something shorter."
    }
}