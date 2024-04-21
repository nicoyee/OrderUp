    import '../css/navigation/Navigation.css';

    const Navigation = ({ activeSection, setActiveSection }) => {
        return (
            <section id='titleSection'>
                <div className='navigationBar'>
                    <ul>
                        <li onClick={() => setActiveSection('')} className={activeSection === "" ? "activeNav" : ""} >home</li>
                        <li onClick={() => setActiveSection('menu')} className={activeSection === "menu" ? "activeNav" : ""} >menu</li>
                        <li onClick={() => setActiveSection('events')} className={activeSection === "events" ? "activeNav" : ""} >events</li>
                        <li onClick={() => setActiveSection('concept')} className={activeSection === "concept" ? "activeNav" : ""} >concept</li>
                    </ul>
                </div>
                <span className='riceBoy'><h1>RICE</h1><h2>BOY</h2></span>
                <h3><span>©</span>2024</h3>
                <h4 className={ activeSection === "" ? "activeSectionLabel" : "" } >  &nbsp; </h4>
                <h4 className={ activeSection === "menu" ? "activeSectionLabel" : "" } >  menu </h4>
                <h4 className={ activeSection === "events" ? "activeSectionLabel" : "" } >  events </h4>
                <h4 className={ activeSection === "concept" ? "activeSectionLabel" : "" } >  concept </h4>
            </section>    
        );
    };

    export default Navigation;