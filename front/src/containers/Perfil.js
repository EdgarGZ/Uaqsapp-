import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Hoc from '../hoc/hoc';

class Perfil extends React.Component {
    render() {
        // if(this.props.token === null) {
        //     return <Redirect to="/" />
        // }
        return (
            <div className="contact-profile">
            {
                this.props.username !== null ?

                <Hoc>
                    <img src={`http://placehold.it/40/007bff/fff&text=${this.props.username[0].toUpperCase()}`} className="online" alt="" />
                    <p>{this.props.username}</p>
                    <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                    </div>
                </Hoc>

                :

                null
            }
            </div>
        )
    }
}

const mapEstadoAProp = state => {
    return {
        username: state.auth.username,
        token: state.auth.token,
    }
}

export default connect(mapEstadoAProp)(Perfil);