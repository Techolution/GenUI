export interface CarComponent {
    type: string,
    model: string,
    price: string,
    seats: string,
    doors: string,
    fuel: string,
    transmition: string,
    body_type: string,
    image_url: string,
    description: string,
    message: string,
}

export interface Car {
    model: string
    price: string
    seats: string
    doors: string
    fuel: string
    transmition: string
    body_type: string
    image_url: string
    description: string
}

export interface TextComponent {
    type: string,
    message: string,
}

export interface QueryResult {
    ids: string[][]
    distances: number[][]
    metadatas: Record<string, any>[][];
    documents: string[][]
}

// Message interface
export interface Message {
    role: string,
    content: ComponentSchema
}

// Tool interface
export interface Tool {
    type: string
    function: {
        name: string;
        strict: boolean;
        description: string;
        parameters: {
            type: string
            properties: {
                [key: string]: {
                    type: string;
                    description: string;
                }
            }
            required: string[];
            additionalProperties: boolean;
        }
    }
}
//

export type ComponentSchema = CarComponent | TextComponent