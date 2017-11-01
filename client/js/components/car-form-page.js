import * as React from 'react';
import { QueryRenderer, graphql } from 'react-relay';

import { environment } from '../environment';

import { CarFormHomeContainer } from './car-form-home';


export class CarFormPage extends React.Component {

  showCarTable = () => {
    this.props.router.push('/Cars');
  }

  render() {

    return <section>

      <h2>Cars Tool</h2>
      <h3>Car Form</h3>

      <QueryRenderer
      
        environment={environment}
        query={graphql`
          query carFormPageQuery {
            viewer {
              id
              ...carFormHome_viewer
            }
          }
        `}
        variables={{}}
        render={ ({ error, props, retry }) => {

          if (error) {
            return <div>
              <div>Error... {error.message}</div>
              <a onClick={() => retry()}>Retry</a>
            </div>;
          } else if (props) {
            return <CarFormHomeContainer
              viewer={props.viewer}
              onShowCarTable={this.showCarTable} />;
          } else {
            return <div>Loading...</div>;
          }

        } } />
    </section>;

  }

}