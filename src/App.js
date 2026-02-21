import "./style.css";
import { useState } from "react";

function App() {

  const [result, setResult] = useState(null);

  const sendData = async () => {
    const response = await fetch("http://127.0.0.1:8000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age: 25,
        income: 40000,
        family: true,
      }),
    });

    const data = await response.json();
    setResult(data);   // 👈 store result
  };

  return (
    <div>
      <button onClick={sendData}>
        Get Recommendation
      </button>

      {result && (
        <div>
          <h3>Recommendation Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;