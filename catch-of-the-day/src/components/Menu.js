import React from 'react';
import Header from './Header';
import Fish from './Fish';

class Menu extends React.Component {
  render() {
    return (
      <div className="menu">
        <Header tagline="Fresh Seafood Market" />

        <ul className="list-of-fishes">
          {
            Object
              .keys(this.props.fishes)
              .map(fish => <Fish
                            key={fish}
                            fishId={fish}
                            details={this.props.fishes[fish]}
                            addToOrder={this.props.addToOrder} />)
          }
        </ul>
      </div>
    );
  }
}

Menu.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  addToOrder: React.PropTypes.func.isRequired
}

export default Menu;
