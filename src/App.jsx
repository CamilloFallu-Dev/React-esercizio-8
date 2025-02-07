import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      // Aggiunge il messaggio inviato dall'utente alla lista dei messaggi
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simula una risposta automatica del bot dopo 1 secondo
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Ciao! Come posso aiutarti?", sender: "bot" },
        ]);
      }, 1000);
    }
  };
  return (
    <>
      <div className="flex flex-col h-screen justify-between">
        <div className="flex-grow p-4 overflow-y-auto bg-gray-100 border-b border-gray-300">
          {messages.map((message, index) => (
            <div
              key={index}
              // Allinea i messaggi in base al mittente: utente a destra, bot a sinistra
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-3`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-white border-t border-gray-300 flex items-center">
          <input
            type="text"
            value={input}
            // Aggiorna lo stato dell'input ogni volta che cambia
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-grow p-3 rounded-lg border border-gray-300 mr-3"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Invia
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
