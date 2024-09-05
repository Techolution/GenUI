import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb"
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

export async function mkChromaDBConnection() {
    const client = new ChromaClient()
    const embeddingFunction = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY || "",
    })
    return await client.getCollection({
        name: "car-collection",
        embeddingFunction: embeddingFunction,
    })
}

export async function mkChromaDB() {
    const client = new ChromaClient()
    const embeddingFunction = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY || "",
    })
    return await client.createCollection({
        name: "car-collection",
        embeddingFunction: embeddingFunction,
    })
}
