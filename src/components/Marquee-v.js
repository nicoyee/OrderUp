import '../css/Marquee.css';

import Marquee from "react-fast-marquee";

const MarqueeVertical = () => {

    return (
        <div className='marquee'>
            <div className='marquee-v'>
                <Marquee className='marq' autoFill={true} direction='up' speed={10}>
                    <p>Embrace Flavors In A Bowl&nbsp;&nbsp;&nbsp;<span className='doubleslash'>//</span>&nbsp;&nbsp;&nbsp;</p>
                </Marquee>
            </div>
            <div className='marquee-v2'>
                <Marquee className='marq' autoFill={true} direction='down' speed={10}>
                    <p>Embrace Flavors In A Bowl&nbsp;&nbsp;&nbsp;<span className='doubleslash'>//</span>&nbsp;&nbsp;&nbsp;</p>
                </Marquee>
            </div>
        </div>
    );
};

export default MarqueeVertical;