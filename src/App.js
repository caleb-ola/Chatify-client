import { useEffect, useState } from "react";
import socket from "./socket";

function App() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("user joined", (msg) => {
      console.log("New user:", msg);
    });

    socket.on("message", (message) => {
      console.log("message:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("user joined");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    socket.on("users", (users) => {
      setUsers(users);
    });

    return () => {
      socket.off("users");
    };
  }, [socket]);

  const handleUsername = (e) => {
    e.preventDefault();
    socket.emit("username", username);
    setConnected(true);
  };

  const handleMessage = (e) => {
    e.preventDefault();
    socket.emit("message", `${username} - ${message}`);
    setMessage("");
  };

  // console.log(socket);
  return (
    <div className="container text-center">
      <div className="row">
        {connected ? (
          <form onSubmit={handleMessage} className="text-center pt-3">
            <div className="row g-3">
              <div className="col-md-8">
                <input
                  type="text"
                  value={message}
                  className="shadow-none form-control"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                />
              </div>
              <div className="col-md-4">
                <button
                  type="submit"
                  className="col-md-4 shadow-none btn btn-secondary"
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUsername} className="text-center pt-3">
            <div className="row g-3">
              <div className="col-md-8">
                <input
                  type="text"
                  value={username}
                  className="shadow-none form-control"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <div className="col-md-4">
                <button className="col-md-4 shadow-none btn btn-secondary">
                  Join
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="row">
        <div className="col-md-8">
          <pre>
            {messages.map((message, index) => (
              <div className="alert alert-secondary" key={index}>
                {message}
              </div>
            ))}
          </pre>
        </div>
        <div className="col-md-4">
          <pre>
            {users.map((user, index) => (
              <div className="alert alert-primary" key={index}>
                {user}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
