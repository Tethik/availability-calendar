import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default class List extends Component {
  async load() {}

  render() {
    const { candidates } = this.props;

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {candidates.map(candidate => (
            <tr key={candidate.id}>
              <td>{candidate.id}</td>
              <td>{candidate.name}</td>
              <td>
                <Link to={`/candidate/${candidate.id}`}>
                  <Button primary>Open</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
