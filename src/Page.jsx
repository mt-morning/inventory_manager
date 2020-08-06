import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Navbar, Nav, NavItem, NavDropdown,
  MenuItem, Glyphicon, Tooltip, OverlayTrigger, Grid,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Contents from './Contents.jsx';

function NavBar() {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>Inventory Tracker</Navbar.Brand>
      </Navbar.Header>

      <Nav>
        <LinkContainer exact to="/"><NavItem>Home</NavItem></LinkContainer>

        <LinkContainer to="/about"><MenuItem>About</MenuItem></LinkContainer>

        <LinkContainer to="/sign-in"><NavItem>Sign in</NavItem></LinkContainer>

        <LinkContainer to="/products"><NavItem>Inventory Overview </NavItem></LinkContainer>

        <LinkContainer to="/report"><NavItem>Report</NavItem></LinkContainer>

        <LinkContainer to="/remove"><NavItem>Remove Product</NavItem></LinkContainer>

      </Nav>

      <Nav pullRight>
        <NavItem>
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="/products">Add Product</Tooltip>}
          >
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
        </NavItem>
      </Nav>
    </Navbar>
  );
}

export default class Page extends React.Component {

    render() {
        return (
            <div>
                <NavBar authenticated={this.props.authenticated} />
                <Grid fluid>
                    <Contents />
                </Grid>
            </div>
        );
    }
}
