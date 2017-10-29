import PropTypes from 'prop-types';
import React from 'react';
import Menu from './Menu';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
  constructor() {
    super();

    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSampleFish = this.loadSampleFish.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);

    this.state = {
      fishes: {},
      order: {}
    };
  }

  componentWillMount() {
    const storeId = this.props.match.params.storeId;
    this.ref = base.syncState(`${storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });

    const order = localStorage.getItem(`order-${storeId}`);
    if (order) {
      this.setState({
        order: JSON.parse(order)
      });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(props, state) {
    const storeId = this.props.match.params.storeId;
    localStorage.setItem(`order-${storeId}`, JSON.stringify(state.order));
  }

  addFish(fish) {
    const fishes = {...this.state.fishes};
    fishes[`fish-${Date.now()}`] = fish;
    this.setState({ fishes });
  }

  updateFish(id, fish) {
    const fishes = {...this.state.fishes};
    fishes[id] = fish;
    this.setState({ fishes });
  }

  removeFish(id) {
    const fishes = {...this.state.fishes};
    fishes[id] = null; // Because Firebase
    this.setState({ fishes });
  }

  loadSampleFish() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    const order = {...this.state.order};
    order[key] = order[key] + 1 || 1;
    this.setState({ order });
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({ order });
  }

  render() {
    const storeId = this.props.match.params.storeId;

    return (
      <div className="catch-of-the-day">
        <Menu
          fishes={this.state.fishes}
          addToOrder={this.addToOrder} />
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder} />
        <Inventory
          storeId={storeId}
          removeFish={this.removeFish}
          updateFish={this.updateFish}
          fishes={this.state.fishes}
          addFish={this.addFish}
          loadSamples={this.loadSampleFish} />
      </div>
    );
  }
}

App.propTypes = {
  match: PropTypes.object.isRequired
}

export default App;
