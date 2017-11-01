import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

export class CarViewRow extends React.Component {

  constructor(props){
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
      editMode: false,
      id: this.props.car.id,
      make: this.props.car.make,
      model: this.props.car.model,
      year: this.props.car.year,
      color: this.props.car.color,
      price: this.props.car.price,
  });

    setEditMode = () => {
        this.setState({editMode: true});
    }

    unsetEditMode = () => {
        this.setState({editMode: false});
    }

  onChange = e => {
      this.setState({
          [ e.target.name ]: e.target.type === 'number'
              ? Number(e.target.value)
              : e.target.value,
      });
  }

  onClick = () => {
      this.props.onUpdateCar({ ...this.state });
      this.setState(this.getInitialState());
  }

  render() {
  return <tr>
    <td>{this.state.editMode ? (
      <input type="text" id="make-input" name="make"
             value={this.state.make} onChange={this.onChange} />
      ) : (this.props.car.make)}
    </td>
    <td>
        {this.state.editMode ? (
            <input type="text" id="model-input" name="model"
                   value={this.state.model} onChange={this.onChange} />
        ) : (this.props.car.model)}
    </td>
    <td>{this.state.editMode ? (
        <input type="text" id="year-input" name="year"
               value={this.state.year} onChange={this.onChange} />
    ) : (this.props.car.year)}
    </td>
    <td>{this.state.editMode ? (
        <input type="text" id="color-input" name="color"
               value={this.state.color} onChange={this.onChange} />
    ) : (this.props.car.color)}
    </td>
    <td>{this.state.editMode ? (
        <input type="text" id="price-input" name="price"
               value={this.state.price} onChange={this.onChange} />
    ) : (this.props.car.price)}</td>
    <td>
        {this.state.editMode ? (
           <div> <button type="button" onClick={() =>
               this.props.onUpdateCar(this.state)}>Save</button>
             <button type="button" onClick={this.unsetEditMode}>Cancel</button> </div>
        ) : (
      <div>
        <button type="button" onClick={this.setEditMode}>Edit</button>
        <button type="button" onClick={() =>
        this.props.onDeleteCar(this.props.car.id)}>Delete</button></div>)}
    </td>
  </tr>;
}
}

export const CarViewRowContainer = createFragmentContainer(CarViewRow, graphql`
  fragment carViewRow_car on Car {
    id make model year color price
  }
`);