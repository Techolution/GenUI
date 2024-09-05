"use client";

import { ComponentSchema, TextComponent, Message } from "@/types";
import { CarCard } from "./CarCard";
import { TextResponse } from "./TextResponse";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Component Map
// this is the component map, this is where we will look up the component to render
// dynamically
const componentMap: { [key: string]: React.FC<ComponentSchema> } = {
    "CarComponent": CarCard as React.FC<ComponentSchema>,
    "TextComponent": TextResponse as React.FC<ComponentSchema>,
}
//
// Dynamic Component
// this is the dynamic component that will select the component to render on the client
// in other words, this is the entry point for the components the system has access to
const DynamicComponent = ( { type, ...props }: { type: string, props: ComponentSchema } ) => {
    const Component = componentMap[type];
    if (!Component) {
        return <div>Unknown component type: {type}</div>;
    }
    return <Component {...props} />;
}
//
// Chat Interface
// this component manages state and logic for the Dyanmic Component
// This manages a set of messages, input, and the api call
// it will then pass the result of the api call to the Dynamic Component to render
export default function ChatInterface() {
    // messages is not passed to the chat api, it provides the client a unified interface to 
    // to select styling for different types of messages
    const [messages, setMessages] = useState<Message[]>([]);
    // input is the current message the user is typing
    const [input, setInput] = useState<string>("");
    // messagesEndRef is a reference to the bottom of the chat interface
    const messagesEndRef = useRef<HTMLDivElement>(null)
    // This is a function that will scroll to the bottom of the chat interface
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [])
    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])
    //
    // Send Message
    // calls the chat api with the input and updates the message state with the wrapped response
    const sendMessage = async () => {
        // don't send empty messages
        if (input.trim() === "") return;
        // create a new message object
        // we know the structure here so it's easy
        // and the content is a "TextComponent" so we hard code it
        const newMessage: Message = {
            role: "user",
            content: {
                type: "TextComponent",
                message: input
            } as ComponentSchema
        }
        // update the message 
        setMessages(prevMessages => [...prevMessages, newMessage])
        // clear the input
        setInput("")
        // send the input to the backend
        try {
            // make the call to the api
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // notice here that we are just using the newMessage object we created
                // the call to the model will only ever get the role and newest input
                // we keep the message history state on the backend
                body: JSON.stringify({role: newMessage.role, content: newMessage.content.message})
            })

            const data = await response.json()
            // this is the part that is important, we update the messages with a new item where the role
            // is "assistant" and the content is the response from the model
            // here you'll see that it's data.ResponseSchemaUnion which is what we expect to get back
            // from the model which is the union of the different component structures
            setMessages(prevMessages => [...prevMessages, {role: "assistant", content: data.ResponseSchemaUnion}])
        } catch(e) { console.error("Error calling API: ", e)}
    }
  return (
    <div className="flex flex-col mx-20 h-screen bg-background">
    <div className="flex-1 overflow-y-auto p-2">
        {/* loop through massage history and render each messages as either a user or assistant message */}
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} rounded-lg p-3`}>
            {/* if the message is from the user, render the message as text */}
            {message.role === 'user' ? (
              <p>
                {(message.content as TextComponent).message}
              </p>
            ) : (
                //if the message is from the assistant, render the message as a dynamic component 
              <DynamicComponent {...message.content} />
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
    <div className="p-4 border-t">
      <div className="flex space-x-2 max-w-4xl mx-auto">
        <Input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  </div>
  )
}








