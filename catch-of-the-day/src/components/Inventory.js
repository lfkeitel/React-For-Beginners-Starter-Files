import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      uid: null,
      owner: null
    }
  }

  componentDidMount() {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, { user });
      }
    });
  }

  handleChange(e, fishId) {
    const fish = this.props.fishes[fishId];
    const newFish = {
      ...fish,
      [e.target.name]: e.target.value
    };

    this.props.updateFish(fishId, newFish);
  }

  renderInventory(fishId) {
    const fish = this.props.fishes[fishId];

    return (
      <div className="fish-edit" key={fishId}>
        <input name="name" value={fish.name} type="text" placeholder="Fish Name" onChange={(e) => this.handleChange(e, fishId)} />
        <input name="price" value={fish.price} type="text" placeholder="Fish Price" onChange={(e) => this.handleChange(e, fishId)} />
        <select name="status" value={fish.status} onChange={(e) => this.handleChange(e, fishId)}>
          <option value="available">Fresh</option>
          <option value="unavailable">Sold Out</option>
        </select>
        <textarea name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleChange(e, fishId)}></textarea>
        <input name="image" value={fish.image} type="text" placeholder="Fish Image" onChange={(e) => this.handleChange(e, fishId)} />
        <button type="button" onClick={() => this.props.removeFish(fishId)}>Remove Item</button>
      </div>
    );
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
      </nav>
    )
  }

  authenticate(method) {
    console.log(base);
    base.authWithOAuthPopup(method, this.authHandler);
  }

  logout() {
    base.unauth();
    this.setState({ uid: null });
  }

  authHandler(err, authData) {
    if (err) {
      console.error(err);
      return;
    }

    const storeRef = base.database().ref(this.props.storeId);

    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    });
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out!</button>;

    if (!this.state.uid) {
      return this.renderLogin();
    }

    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of the store!</p>
          {logout}
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired
}

export default Inventory;
