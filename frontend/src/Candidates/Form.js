import React, { Component } from 'react';
import {
  FormGroup,
  Button,
  ControlLabel,
  FormControl,
  Modal,
} from 'react-bootstrap';

export default class Form extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: {
        name: '',
        timezone: '',
        dates: [],
      },
    };
  }

  getValidationState() {
    const length = this.state.value.name.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  handleChange(e) {
    const { value } = this.state;
    value.name = e.target.value;
    this.setState({ value });
  }

  handleSave = () => {
    if (this.props.onSave) this.props.onSave(this.state.value);
  };

  handleClose = e => {
    if (this.props.onHide) this.props.onHide();
  };

  render() {
    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.handleClose}
        animation={false}
      >
        <Modal.Header>
          <Modal.Title>Create Candidate</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Candidate Name</ControlLabel>
            <FormControl
              type="text"
              value={this.state.value.name}
              placeholder="Enter text"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.handleClose}>Close</Button>
          <Button bsStyle="primary" onClick={this.handleSave}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
