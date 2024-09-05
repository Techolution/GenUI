# GenUI - The Next Generation of User Interfaces

GenUI is a demo of dynamically sellecting React components based off the schema reponse sent back by an LLM in a query. The idea is to use an LLM as a light-weight "reasoning" layer that sits behind a UI and allows the interface to be dynamically selected as a user interacts with it. This example is a simple approach giving the LLM the choice to choose between two components, a function search function (performs RAG), and invoked directly through user input (like a typically chat application).

This idea can be extended into much more complicated implementations such as using user heatmap data as an input to a model that can predict what componets to choose from that will provide the best experience for the user. This offers a completly new dimension of personalization that can provide more value to users and drive more successful outcomes for organizations. 

# High level dataflow

![NextGen UI](https://github.com/user-attachments/assets/52508a2a-ca34-4c47-8176-583658580ceb)

# Demo!

https://github.com/user-attachments/assets/d5583c07-2883-41ea-b99e-2245d6f209aa


# Getting started

To get this project up and running locally you need to have chroma installed:

activate environment:
`conda activate <env>`

install chroma:
`pip install chromadb`

run this command to start the chroma backend:
`chroma run --path db_path`

Then, you'll need to load the data. The data for this example is located in "./public/data/data-0.json"

You'll need to run:
`npm run load-data`

This will read in from the json file, initalize a chroma client, set up the embedding client, build the documents,
vectorize, and load the data into chroma.

Then you'll need to run the development server:
`npm run dev`
