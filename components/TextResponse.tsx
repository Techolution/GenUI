import { TextComponent } from "@/types"
import ReactMarkdown from "react-markdown"

// TextResponse component: Displays a text message
export const TextResponse: React.FC<TextComponent> = ({ message }) => (
    <div className="text-foreground prose dark:prose-invert max-w-none">
    {message ? (
      <ReactMarkdown>{message}</ReactMarkdown>
    ) : (
      "No message available"
    )}
  </div>
  )