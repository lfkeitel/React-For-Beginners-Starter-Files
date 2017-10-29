import React from 'react';
import { getFunName } from '../helpers';
import { Redirect } from 'react-router-dom';

class StorePicker extends React.Component {
  state = {
    storeId: null
  }

  goToStore(e) {
    e.preventDefault();
    this.setState({storeId: this.storeInput.value});
    //this.context.router.transitionTo(`/store/${this.storeInput.value}`);
  }

  render() {
    if (this.state.storeId) {
      return <Redirect to={`/store/${this.state.storeId}`} />
    }

    return (
      <form className="store-selector" onSubmit={(e) => this.goToStore(e)}>
        <h2>Please Enter A Store</h2>
        <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => this.storeInput = input} />
        <button type="submit">Visit Store -></button>
      </form>
    );
  }
}

export default StorePicker;
