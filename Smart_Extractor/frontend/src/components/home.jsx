import "./home.css";


function Home({ setMode }) {

  return (

    <div className="home-container">

      <div className="home-card">

        <div className="logo">
          ✨
        </div>


        <h1>
          Welcome to Smart Extractor AI
        </h1>


        <p className="subtitle">
          Your intelligent assistant for chatting,
          extracting information, and working with AI.
        </p>


        <h2>
          What would you like to do?
        </h2>


        <div className="choice-container">


          <button
            className="choice-card"
            onClick={() => setMode("chat")}
          >

            <span>
              💬
            </span>

            <div>
              <h3>
                Chat with AI
              </h3>

              <p>
                Ask questions and get intelligent responses.
              </p>
            </div>

          </button>



          <button
            className="choice-card"
            onClick={() => setMode("extract")}
          >

            <span>
              📄
            </span>

            <div>

              <h3>
                Extract Information
              </h3>

              <p>
                Extract names, emails, and phone numbers.
              </p>

            </div>

          </button>


        </div>


      </div>


    </div>

  );

}


export default Home;