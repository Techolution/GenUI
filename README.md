To get this project up and running locally you need to have chroma installed:


https://github.com/user-attachments/assets/d5583c07-2883-41ea-b99e-2245d6f209aa


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
