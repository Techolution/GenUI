import { CarComponent } from "@/types"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { TextResponse } from "./TextResponse"

// CarDetailCard component: Displays details of a car
export const CarCard: React.FC<CarComponent> = ( car ) => {
    const { model, 
            price,  
            seats,
            doors,
            fuel,
            transmition,
            body_type,
            image_url,
            description,
            message
        } = car

    return (
      <>
       <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{model || 'Unknown Model'}</CardTitle>
          <CardDescription>{description || 'No description available'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {image_url && (
            <div className="w-full h-64 relative">
              <Image
                src={image_url}
                alt={model}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Price:</strong> ${price != null ? price.toLocaleString() : 'N/A'}</p>
            <p><strong>Seats:</strong> {seats || 'N/A'}</p>
            <p><strong>Doors:</strong> {doors || 'N/A'}</p>
            <p><strong>Fuel:</strong> {fuel || 'N/A'}</p>
            <p><strong>Transmission:</strong> {transmition || 'N/A'}</p>
            <p><strong>Body Type:</strong> {body_type || 'N/A'}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Book a test drive</Button>
        </CardFooter>
      </Card>
  
      <TextResponse message={message}/>
      </>
    )
  }
