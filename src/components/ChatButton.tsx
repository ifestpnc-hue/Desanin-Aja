import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const ChatButton = () => (
  <Link
    to="/chat"
    className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
    aria-label="Chat Admin"
  >
    <MessageSquare className="h-6 w-6" />
  </Link>
);

export default ChatButton;
