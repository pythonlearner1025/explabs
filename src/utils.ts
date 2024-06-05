export const parseToken = (chunk: string) => {
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
