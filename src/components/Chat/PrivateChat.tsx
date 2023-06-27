import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import {
  PaperAirplaneIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export const PrivateChat = ({ arxivId }) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hi there! How can I help you today?",
      type: "apiMessage",
    },
  ]);

  const messageListRef = useRef(null);
  const textAreaRef: any = useRef(null);

  useEffect(() => {
    const messageList: any = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  const handleError = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: "Oops! There seems to be an error. Please try again.",
        type: "apiMessage",
      },
    ]);
    setLoading(false);
    setUserInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: userInput, type: "userMessage" },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: userInput,
        arxivId: arxivId,
      }),
    });

    if (!response.ok) {
      handleError();
      return;
    }

    const stream = response.body;
    const reader = stream.getReader();

    let isFirst = true;
    let text = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const decodedValue = new TextDecoder().decode(value);
        if (isFirst) {
          isFirst = false;
          text = decodedValue;
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: text, type: "apiMessage" },
          ]);
        } else {
          text += decodedValue;
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { message: text, type: "apiMessage" },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      reader.releaseLock();
    }

    setUserInput("");
    setLoading(false);

    // save conversation history to local storage
    const conversationHistory = localStorage.getItem("arxivGPTHistory");
    const history = conversationHistory ? JSON.parse(conversationHistory) : {};

    if (!history[arxivId]) {
      history[arxivId] = [];
    }

    history[arxivId].push({
      question: userInput.trim(),
      answer: text,
    });

    localStorage.setItem("arxivGPTHistory", JSON.stringify(history));
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const clearLocalStorage = () => {
    const conversationHistory = localStorage.getItem("arxivGPTHistory");
    let history = conversationHistory ? JSON.parse(conversationHistory) : {};

    history[arxivId] = [];
    setMessages([
      {
        message: "Hi there! How can I help you today?",
        type: "apiMessage",
      },
    ]);

    localStorage.setItem("arxivGPTHistory", JSON.stringify(history));
  };

  useEffect(() => {
    if (arxivId) {
      const conversationHistory = localStorage.getItem("arxivGPTHistory");
      const history = conversationHistory
        ? JSON.parse(conversationHistory)
        : {};

      if (Array.isArray(history[arxivId])) {
        history[arxivId].forEach((conversation) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: conversation.question, type: "userMessage" },
            { message: conversation.answer, type: "apiMessage" },
          ]);
        });
      }
    }
  }, []);

  return (
    <>
      <main className="h-screen">
        <div className="border-2 border-slate-200 rounded-lg flex flex-col h-1/2">
          <div
            ref={messageListRef}
            className="messagelist flex-grow overflow-y-auto"
          >
            {messages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 ${
                    message.type === "apiMessage" ? "bg-slate-100" : "bg-white"
                  }`}
                >
                  {message.type === "apiMessage" ? (
                    <div className="flex-shrink-0">
                      <Image
                        src="/gpt-3.svg"
                        alt="AI"
                        width={30}
                        height={30}
                        priority={true}
                      />
                    </div>
                  ) : (
                    <UserIcon className="w-8 h-8" />
                  )}
                  <div className="flex-1 pt-1 text-gray-600">
                    <ReactMarkdown linkTarget="_blank">
                      {message.message}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-2 border-slate-200 rounded-lg mt-4 p-2 flex bg-white">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="flex items-center">
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                placeholder={
                  loading ? "Waiting for response..." : "Type your question..."
                }
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-2 placeholder-slate-300 relative bg-white rounded w-full resize-none overflow-hidden focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="ml-4 flex items-center justify-center w-8"
              >
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <PaperAirplaneIcon className="w-5 h-5 text-slate-400 sclae-125" />
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-4 flex justify-end text-gray-600">
          <div
            className="flex hover:bg-slate-100 p-2 rounded-md hover:cursor-pointer"
            onClick={clearLocalStorage}
          >
            <span>
              <TrashIcon className="w-5 h-5 mr-2" />
            </span>
            <div>Clear History</div>
          </div>
        </div>
      </main>
    </>
  );
};
