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

        <h1>HOME</h1>

      </section>

      <section id = "menu">

        <h1>MENU</h1>

      </section>

      <section id = "events">

        <h1>EVENTS</h1>

      </section>

      <section id = "about">

        <h1>ABOUT</h1>

      </section>

    </div>

  );
}

export default App;
