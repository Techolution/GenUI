import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { mkChromaDBConnection } from "@/lib/chromaDB";
import { z } from "zod";
import { Tool } from "@/types";

// Initialize the OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
//
// Response Schema
// this is the schema that the model will use to parse the response
const responseSchema = z.object({
    // register the types of components that we have avaliable in the frontend
    ResponseSchemaUnion: z.union([
        z.object({
            type: z.literal("CarComponent"),
            model: z.string(),
            price: z.string(),
            seats: z.string(),
            doors: z.string(),
            fuel: z.string(),
            transmition: z.string(),
            body_type: z.string(),
            image_url: z.string(),
            description: z.string(),
            message: z.string(),
        }),
        z.object({
            type: z.literal("TextComponent"),
            message: z.string(),
        }),
    ]),
});
//
// Function Definitions
// a funciton mapping keys to functions
// since all of these functiosn will be used by an LLM, it's best that they all return a string
// this will keep from having downstream code type check for type errors. Just return strings.
const funcs = {
    searchCars: async (query: string): Promise<string> => {
        console.log("Called Searching Funciton with query: ", query)
        let chromaDB = await mkChromaDBConnection()
        const results = await chromaDB.query({
            queryTexts: [query],
            nResults: 1,
            include: ["documents", "metadatas", "distances"]
        })
        console.log(results.documents[0])
        return `
        Here are the results of your search:
           ${results.documents[0]}
        `
    }
}
//
// Function Declarations
// a tool declaration that will be used to inform the model of the functions it has access to
// there should be a 1:1 relationship between the functions here and the functions in the funcs object
const searchCarsTool: Tool = {
    type: "function",
    function: {
        name: "searchCars",
        strict: true,
        description: "Search for cars",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The query to search for",
                },
            },
            required: ["query"],
            additionalProperties: false,
        }
    }
}
//
// Tools list
// this is the list of tools that the model has access to
const tools: Tool[] = [
    searchCarsTool
];
// Message List
// for this example, we're keeping state of the conversation history on the server,
// for a production implementation, you'll probaly want a more stateless approach
// where the client keeps the conversation history or you pull it from a database given a session id
const messages = [
    // system message, this will be used to set the behavior of the model
    {role: "system", content: `
        You are a virtual car salesperson. Parse the user's query and return a JSON object with the type of CarComponent or TextComponent.
        For a car component, you'll want to first make a search using your tools so that you can find the most
        relevant car to show to the user. Be sure to ask questions to the user so that you can get a good
        search query. Once you think you've got enough information, make sure to analyze the history of the chat
        to construct a really good search query. For example, if the user mentioned that they have a family
        of 4 in a previous message, that should be taken into consideration when searching for a car. You have access
        to a semantic search tool so you can query the database with natural language like. 

        "I'm looking for a car that can seat 4 people, budget friendly, and has good fuel economy."
        
        Once you've searched for a car, you'll then want to parse the results and
        return a CarComponent with the most relevant information. If the user is just asking questions, feel free to 
        just return TextComponent with the answers.
    `},
]
// POST request to handle incoming messages
export async function POST(req: Request, res: Response) {
    // get the input from the request
    const {role, content} = await req.json();
    // log the message
    messages.push({role: role, content: content})
    //
    // make the first call to the model passing in the list of messages, tools, and response schema
    let completion = await client.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: messages,
        tools: tools,
        response_format: zodResponseFormat(responseSchema, "response")
    })
    //
    // check if a message is a tool call
    if (completion.choices[0].message.tool_calls.length > 0) {
        // log the tool call
        messages.push(completion.choices[0].message)
        // evaluate the result of the tool call
        // tool name
        const toolCall = completion.choices[0].message.tool_calls[0]
        // parse the arguments
        const args = JSON.parse(toolCall.function.arguments)
        // call the function
        let result = await funcs[toolCall.function.name](...Object.values(args))
        // log the result of the tool call
        messages.push({
            role: "tool", 
            tool_call_id: toolCall.id,
            content: result
        })
        // make another call to the model to pass back the result of the tool call
        completion = await client.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: messages,
            tools: tools,
            response_format: zodResponseFormat(responseSchema, "response")
        })
        // at the second call, we know that this is just a normal structured resopnse and won't be a tool call
        // it's safe to just log the message with the role and content
        messages.push({role: completion.choices[0].message.role, content: completion.choices[0].message.content})
        // return the response
        // since this is a JSON mode call, we can just return the parsed response
        // this makes it easy for the frontend
        return new Response(JSON.stringify(completion.choices[0].message.parsed));
    }
    // no tool call, just return the parsed response
    return new Response(JSON.stringify(completion.choices[0].message.parsed));
}