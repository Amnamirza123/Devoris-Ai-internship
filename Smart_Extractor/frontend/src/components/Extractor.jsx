import { useState } from "react";
import { extractText } from "./api";
import "./Extractor.css";

function Extractor() {

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  async function handleExtract() {

    if (!text.trim()) return;

    setLoading(true);

    try {

        const data = await extractText(text);

        console.log("EXTRACT RESPONSE:", data);

        setResult(data);

    } catch (error) {

      console.log(error);

      setResult({
        error: "Extraction failed"
      });

    } finally {

      setLoading(false);

    }

  }


  return (

    <div className="extractor-container">

      <h2>Lead Extractor</h2>

      <textarea
        value={text}
        onChange={(e)=>setText(e.target.value)}
        placeholder="Paste text here..."
      />

      <button onClick={handleExtract}>
        {loading ? "Extracting..." : "Extract"}
      </button>


      {result && (

        <div className="result-box">

            <p>Name: {result.result?.name || "Not found"}</p>

            <p>Email: {result.result?.email || "Not found"}</p>

            <p>Phone: {result.result?.phone || "Not found"}</p>

        </div>

      )}

    </div>

  );
}


export default Extractor;