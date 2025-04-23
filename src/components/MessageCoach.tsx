
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendIcon, BrainIcon } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "coach" | "ai";
  content: string;
  timestamp: Date;
}

export const MessageCoach = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<"coach" | "ai">("coach");

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Create a new user message
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date()
    };
    
    // Add message to the conversation
    setMessages(prev => [...prev, newMessage]);
    
    // Clear the input
    setMessage("");
    
    // Simulate reply based on active tab
    setTimeout(() => {
      let replyMessage: Message;
      
      if (activeTab === "coach") {
        replyMessage = {
          id: Date.now().toString(),
          sender: "coach",
          content: "Thanks for your message! I'll review it and get back to you soon.",
          timestamp: new Date()
        };
        toast.success("Message sent to your coach");
      } else {
        replyMessage = {
          id: Date.now().toString(),
          sender: "ai",
          content: "As your AI coach, I recommend focusing on progressive overload and ensuring you're getting adequate recovery between workouts. Based on your recent metrics, your progress is steady but you might benefit from increasing your protein intake slightly.",
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  return (
    <Card className="border border-border/50 bg-card/90 backdrop-blur-sm h-[400px] flex flex-col">
      <CardHeader className="px-4 py-3 border-b">
        <Tabs 
          defaultValue="coach" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "coach" | "ai")}
          className="w-full"
        >
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-lg">
              {activeTab === "coach" ? "Message Your Coach" : "AI Coach"}
            </CardTitle>
            <TabsList>
              <TabsTrigger value="coach">Human Coach</TabsTrigger>
              <TabsTrigger value="ai">AI Coach</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground italic">
            {activeTab === "coach"
              ? "Send a message to your coach for personalized feedback"
              : "Ask the AI coach for immediate guidance on your training"
            }
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : msg.sender === "coach"
                    ? "bg-secondary text-secondary-foreground" 
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <div className="flex w-full gap-2">
          <Textarea 
            placeholder={`Message your ${activeTab === "coach" ? "coach" : "AI coach"}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none h-20"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} className="h-20 px-3" variant="default">
            <SendIcon className="w-5 h-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageCoach;
