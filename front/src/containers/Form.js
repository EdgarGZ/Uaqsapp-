import React from 'react';
import axios from 'axios';
import { Form, Button, Select } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as navAcciones from '../store/actions/nav';
import * as msjAcciones from '../store/actions/mensaje';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
  
class AñadirChatFormHorizontal extends React.Component {

  state = {
      usernames: [],
      error: null
  }

  manejadorCambio = (valor) => {
      this.setState({
          usernames: valor
      })
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    const { usernames } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const usuariosCombinados = [...usernames, this.props.username]
        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${this.props.token}`
        };
        axios.post('http://127.0.0.1:8000/api/v1.0/chat/create/', {
          mensajes: [],
          participantes: usuariosCombinados
        })
          .then((response) => {
            console.log(response)
            this.props.history.push(`/${response.data.id}`)
            this.props.closeAddChatPopup();
            this.props.obtenerChatsUsuario(this.props.username, this.props.token);
          })
          .catch((response) => {
            // console.log(response)
            this.setState({
              error: response
            })
          })
      }
    });
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
      {this.state.error ? `${this.state.error}` : null}
        <Form.Item
          validateStatus={userNameError ? 'error' : ''}
          help={userNameError || ''}
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
              <Select 
                  mode="tags"
                  style={{ width: "100%"}}
                  placeholder="Añadir un contacto"
                  onChange={this.manejadorCambio}
                  >{[]}</Select>
          )}
        </Form.Item>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Comenzar un Chat
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const AñadirChatForm = Form.create()(AñadirChatFormHorizontal);

const mapEstadoAProp = (state) => {
  return {
    token: state.auth.token,
    username: state.auth.username,
  }
}

const mapEnvioAProp = (envio) => {
  return {
    closeAddChatPopup: () => envio(navAcciones.closeAddChatPopup()),
      obtenerChatsUsuario: (username, token) => envio(msjAcciones.obtenerChatsUsuario(username, token)),
  }
}

export default withRouter(connect(mapEstadoAProp, mapEnvioAProp)(AñadirChatForm));