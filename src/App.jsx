import { useState, useRef, useEffect } from "react";
import useSWR from "swr";

// Funzione per fare fetch ai dati dal mock endpoint
const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userMessage, setUserMessage] = useState("");

  // Crea la ref
  const messagesEndRef = useRef(null);

  // Funzione per scorrere automaticamente verso il basso
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Esegui lo scroll ogni volta che i messaggi cambiano
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Funzione per gestire l'invio dei messaggi
  const handleSendMessage = () => {
    if (input.trim()) {
      // Aggiungi il messaggio dell'utente alla lista dei messaggi
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);
      setInput("");

      // Imposta il messaggio dell'utente per triggerare la chiamata SWR
      setUserMessage(input);
    }
  };

  // Utilizza SWR per ottenere la risposta del bot solo quando `userMessage` cambia
  const { data, error } = useSWR(
    userMessage
      ? `https://mocki.io/v1/d0983da6-4f44-46a1-bd4a-d1b107d8fd82?message=${userMessage}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      // Aggiungi la risposta del bot ai messaggi
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: "bot" },
      ]);
    }
  }, [data]);

  // Gestione degli errori e stato di caricamento
  if (error) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: "Si è verificato un errore nel recupero della risposta del bot.",
        sender: "bot",
      },
    ]);
  }

  return (
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
        {/* Questo div è il nostro ancoraggio per scorrere verso il basso */}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-300 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Aggiorna lo stato dell'input
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
  );
}

export default App;
