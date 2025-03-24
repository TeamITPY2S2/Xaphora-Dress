import React, { useState, useRef, useEffect } from 'react';
import './XaphoraChatbot.css';

const XaphoraChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m the Xaphora Dress assistant. How can I help you with our clothing today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Replace with your actual OpenAI API key and settings
  const OPENAI_API_KEY = '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';
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant for Xaphora Dress, a clothing brand known for stylish and elegant dresses.
              
             About Xaphora Dress:
                - Premium clothing brand specializing in women's dresses
                - Known for high-quality fabrics and unique designs
                - Price range: LKR1500-LKR9000
                - Collections include: Casual, Formal, Evening, and Seasonal lines
                - Sizes range from XS to XXXL
                - Shipping available islandwide
                - Return policy: 30-day free returns

            Main features to highlight:
            - Sustainable production practices
            - Hand-crafted details
            - Inclusive sizing options
            - Seasonal collections
            - Limited edition designs

            Additional details:
            - Payment methods: cash on delivery, online transfer, and card payment
            - Delivery: within 3 working days
              
              Always be helpful, friendly, and knowledgeable about fashion. Recommend products based on customer needs but don't be pushy. If you don't know specific product details, offer to connect the customer with a human representative.`
            },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: input }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      const assistantMessage = { 
        role: 'assistant', 
        content: data.choices[0].message.content 
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: 'I apologize, but I"m having trouble connecting right now. Please try again later or contact customer support.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="xaphora-chatbot-container">
      {/* Chatbot toggle button */}
      <button 
        className="xaphora-chatbot-toggle" 
        onClick={toggleChatbot}
      >
        {isChatbotOpen ? 'Close Chat' : 'Chat with Xaphora'}
      </button>
      
      {/* Chatbot dialog */}
      <div className={`xaphora-chatbot-dialog ${isChatbotOpen ? 'open' : ''}`}>
        <div className="xaphora-chatbot-header">
          <img 
            src="/xaphora-logo.png" 
            alt="Xaphora Dress" 
            className="xaphora-chatbot-logo"
          />
          <h2>Xaphora Dress Assistant</h2>
          <button 
            className="xaphora-chatbot-close" 
            onClick={toggleChatbot}
          >
            ×
          </button>
        </div>
        
        <div className="xaphora-chatbot-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`xaphora-chatbot-message ${message.role === 'assistant' ? 'assistant' : 'user'}`}
            >
              {message.role === 'assistant' && (
                <div className="xaphora-chatbot-avatar">
                  <img 
                    src="/xaphora-avatar.png" 
                    alt="Xaphora Assistant"
                  />
                </div>
              )}
              <div className="xaphora-chatbot-bubble">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="xaphora-chatbot-message assistant">
              <div className="xaphora-chatbot-avatar">
                <img 
                  src="/xaphora-avatar.png" 
                  alt="Xaphora Assistant" 
                />
              </div>
              <div className="xaphora-chatbot-bubble typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="xaphora-chatbot-input" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about our dresses..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default XaphoraChatbot;