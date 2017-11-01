import * as React from 'react';
import { QueryRenderer, graphql } from 'react-relay';

import { environment } from '../environment';
import { CarTableHomeContainer } from './car-table-home';

export class CarTablePage extends React.Component {

    createCar = () => {
        this.props.router.push('/create-car');
    }

    render() {

        return <section>

            <h2>Cars Tool</h2>
            <h3>Cars Table</h3>

            <QueryRenderer

                environment={environment}
                query={graphql`
          query carTablePageQuery {
            viewer {
              id
              ...carTableHome_viewer
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
                        return <CarTableHomeContainer viewer={props.viewer}
                                                         onCreateCar={this.createCar} />;
                    } else {
                        return <div>Loading...</div>;
                    }

                } } />
        </section>;

    }

}