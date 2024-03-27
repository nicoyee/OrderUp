import './css/App.css';
import Banner from './components/Banner';
import Navbar from './components/Navbar';
import dishbig from './assets/home1.png';

function App() {
  return (
    
    <div className="landing">

      <Banner />

      <Navbar />
        
      <section id = "home">

        <div className = "section-home"> 
          
          <h2>there's no better way to</h2>
          <h1>Embrace Flavors in a Bowl</h1>

          <button class="cta">
            <span class="hover-underline-animation"> Order Now </span>
            <svg
              id="arrow-horizontal"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="10"
              viewBox="0 0 46 16"
            >
              <path
                id="Path_10"
                data-name="Path 10"
                d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                transform="translate(30)"
              ></path>
            </svg>
          </button>

        </div>

      </section>

      <section id = "menu">

        <h1>MENU</h1>

      </section>

      <section id = "events">

        <h1>EVENTS</h1>

      </section>

      <section id = "concept">

        <h1>CONCEPT</h1>

      </section>

    </div>

  );
}

export default App;
