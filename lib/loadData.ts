import fs from "fs"
import { mkChromaDB } from "./chromaDB"
import { Car } from "../types"

// helper function to load data from a json file
export async function loadData() {
    const rawData = fs.readFileSync("public/data-0.json", "utf8")
    const data: Car[] = JSON.parse(rawData)
    const documents = data.map((car) => 
        `Model: ${car.model}\nPrice: ${car.price}\nSeats: ${car.seats}\nDoors: ${car.doors}\nFuel: ${car.fuel}\nTransmition: ${car.transmition}\nBody Type: ${car.body_type}\nImage URL: ${car.image_url}\nDescription: ${car.description}`
    )
    const metadatas = data.map((car) => ({
        model: car.model,
        price: car.price,
        seats: car.seats,
        doors: car.doors,
        fuel: car.fuel,
        transmition: car.transmition,
        body_type: car.body_type,
        image_url: car.image_url,
        description: car.description,
    }))
    const ids = data.map((_, index) => index.toString())
    let chromaDB = await mkChromaDB()
    await chromaDB.add({
        documents,
        metadatas,
        ids,
    })
    console.log("Data loaded successfully")
}
loadData()