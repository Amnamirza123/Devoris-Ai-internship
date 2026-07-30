import { useState } from "react";

import Chatbot from "./components/Chatbot";
import Extractor from "./components/Extractor";
import Home from "./components/Home";


function App(){

const [mode,setMode] = useState(null);


return (

<div>


{
mode === null

?

<Home setMode={setMode}/>


:

mode === "chat"

?

<Chatbot/>

:

<Extractor/>

}


</div>

);


}


export default App;