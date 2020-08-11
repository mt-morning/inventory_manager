﻿import React from 'react';
import URLSearchParams from 'url-search-params';
import { Route } from 'react-router-dom';
import { Panel } from 'react-bootstrap';

import Filters from './Filters.jsx';
import InventoryTable from './InventoryTable.jsx';
import graphQLFetch from './graphQLFetch.js';
import Toast from './Toast.jsx';
import ProductInformation from './ProductInformation.jsx';
import InventoryTableComp from './InventoryTableComp.jsx'


/**
 * Represent overall inventory list in webpage.
 */
export default class InventoryList extends React.Component {
  constructor() {
    super();
      this.state = {
          inventory: [],
          toastVisible: false,
          toastMessage: ' ',
          toastType: 'info',
      };
      this.deleteProduct = this.deleteProduct.bind(this);
      this.showSuccess = this.showSuccess.bind(this);
      this.showError = this.showError.bind(this);
      this.dismissToast = this.dismissToast.bind(this);
  }

  // Pg 64
  componentDidMount() {
    this.loadData();
  }

  // pg 245
  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  // Pg 64
  async loadData() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    const queryVariables = {};
    if (params.get('quantity')) queryVariables.quantity = parseInt(params.get('quantity'), 10);
    if (params.get('category')) queryVariables.category = params.get('category').split(',');

    // eslint-disable-next-line no-console
    console.log('Loading data....');

    // Pg 105
    const query = `query productList($quantity: Int) {
      productList(quantity: $quantity) {
        id description createdDate
        expirationDate quantity category
      }
    }`;

      const data = await graphQLFetch(query, queryVariables, this.showError);
    if (data) {
      // eslint-disable-next-line no-console
      console.log('Data retrieved from server.');
      this.setState({ inventory: data.productList });
    }
    else {
      console.log("Query returned no data/error.");
    }
  }

  // need to revise async delete
  async deleteProduct(index) {
    const query = `mutation productDelete($id: Int!) {
      productDelete(id: $id)
    }`;
    const { inventory } = this.state;
    // console.log(inventory);
    const { location: { pathname, search }, history } = this.props;
      const { id } = inventory[index];
      const data = await graphQLFetch(query, { id: parseInt(id, 10) }, this.showError);
    if (data && data.productDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.inventory];
        if (pathname === `/products/${id}`) {
          history.push({ pathname: '/products', search });
        }
        newList.splice(index, 1);
        return { inventory: newList };
      });
        this.showSuccess(`Deleted product ${id} successfully.`);
    } else {
      this.loadData();
    }
  }

  render() {
    const { inventory } = this.state;
    const { match } = this.props;
    return (
      <React.Fragment>
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <Filters />
          </Panel.Body>
        </Panel>
        <hr />
        <InventoryTable inventory={inventory} deleteProduct={this.deleteProduct} updateProduct={this.updateProduct} />
        <hr />
        <Route path={`${match.path}/:id`} component={ProductInformation} />
      </React.Fragment>
    );
  }
}
