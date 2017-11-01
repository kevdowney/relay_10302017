import * as React from 'react';
import { QueryRenderer, graphql } from 'react-relay';

import { environment } from '../environment';
import { CarTableContainer } from './car-table';
import { PaginatedCarTableContainer } from './paginated-car-table';
import { CarForm } from './car-form';
import { insertCar as relayInsertCar } from '../mutations/insert-car';
import { deleteCar as relayDeleteCar } from '../mutations/delete-car';
import { updateCar as relayUpdateCar } from '../mutations/update-car';


export class CarHome extends React.Component {

  showCarForm = () => {
    this.props.router.push('/create-car');
  }

  render() {

    return <section>

      <h2>Cars Tool</h2>

      <QueryRenderer
      
        environment={environment}
        query={graphql`
          query carHomeQuery {
            viewer {
              id
              ...paginatedCarTable_viewer
            }
          }
        `}
        variables={{}}
        render={ ({ error, props, retry }) => {

          const reactDeleteCar = carId => {
            relayDeleteCar(
              environment,
              props.viewer.id,
              carId,
            );
          };

            const reactUpdateCar = car => {
                relayUpdateCar(
                    environment,
                    car,
                );
            };

          if (props) {
            return <div>
              <PaginatedCarTableContainer viewer={props.viewer}
                onDeleteCar={reactDeleteCar} onCreateCar={this.showCarForm} onUpdateCar={reactUpdateCar}/>
            </div>;
          } else {
            return <div>Loading...</div>;
          }

        } } />
    </section>;

  }

}