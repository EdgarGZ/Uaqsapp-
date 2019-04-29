import React from 'react';
import { NavLink } from 'react-router-dom';

const Contacto = (props) => (
    <NavLink to={`${props.URLchat}`} style={{color: '#fff'}}>
        <li className="contact">
            <div className="wrap">
            <span className="contact-status online"></span>
            <img src={props.URLimagen} alt="" />
            <div className="meta">
                <p className="name">{ props.nombre }</p>
                {/* <p className="preview">You just got LITT up, Mike.</p> */}
            </div>
            </div>
        </li>
    </NavLink>
)

export default Contacto;