import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class List extends Component {
  render() {
    const { candidates } = this.props;

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(candidate => (
            <tr>
              <td>{candidate.id}</td>
              <td>{candidate.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
