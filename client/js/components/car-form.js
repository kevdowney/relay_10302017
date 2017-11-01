import * as React from 'react';

export class CarForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    make: '',
    model: '',
    year: 1900,
    color: '',
    price: 0,
  });

  onChange = e => {
    this.setState({
      [ e.target.name ]: e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.value,
    });
  } 

  onClick = () => {
    this.props.onSubmitCar({ ...this.state }).then(() => {
      this.setState(this.getInitialState());
      this.props.onShowCarTable();
    });

  }

  render() {

    return <form>
      <div>
      <label>
          Pick your favorite La Croix flavor:
          <select value={this.state.make} onChange={this.onChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <label htmlFor="make-input">Make</label>
        <input type="text" id="make-input" name="make"
          value={this.state.make} onChange={this.onChange} />
      </div>
      <div>
        <label htmlFor="model-input">Model</label>
        <input type="text" id="model-input" name="model"
          value={this.state.model} onChange={this.onChange} />
      </div>
      <div>
        <label htmlFor="year-input">Year</label>
        <input type="number" id="year-input" name="year"
          value={this.state.year} onChange={this.onChange} />
      </div>
      <div>
        <label htmlFor="color-input">Color</label>
        <input type="text" id="color-input" name="color"
          value={this.state.color} onChange={this.onChange} />
      </div>
      <div>
        <label htmlFor="price-input">Price</label>
        <input type="number" id="price-input" name="price"
          value={this.state.price} onChange={this.onChange} />
      </div>
      <button type="button" onClick={this.onClick}>Save Car</button>
    </form>;
  }
}