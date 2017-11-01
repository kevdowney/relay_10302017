import React from 'react';
import { createPaginationContainer, graphql } from 'react-relay';

import { CarViewRowContainer } from './car-view-row';
import {CarEditRowContainer} from './car-edit-row';

export class CarTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 0,
            lastPageLoaded: 0,
            pageLength: 3,
        };
    }


    static defaultProps = {
        viewer: {
            cars: {
                edges: [],
            },
        },
    }

    loadPrev = () => {

        if (!this.props.relay.isLoading()) {

            if (this.state.currentPage > 0) {
                this.setState({
                    currentPage: this.state.currentPage - 1,
                });
            }

        }

    };

    loadNext = () => {

        if (!this.props.relay.isLoading()) {

            const nextPage = this.state.currentPage + 1;
            let { lastPageLoaded } = this.state;

            if (this.props.relay.hasMore() && nextPage > lastPageLoaded) {
                lastPageLoaded = nextPage;
                this.props.relay.loadMore(this.state.pageLength);
            }

            this.setState({
                currentPage: nextPage,
                lastPageLoaded,
            });

        }
    };

    createCar = () => {
        this.props.onCreateCar();
    }


    render() {

        return <div>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {do {
                    const { currentPage, pageLength } = this.state;
                    const startIndex = currentPage * pageLength;
                    const { edges: carEdges } = this.props.viewer.cars;
                    const endIndex = startIndex + pageLength;

                    if (this.props.viewer.cars == null) {
                    <tr><td colSpan="6">There are no cars.</td></tr>;
                } else {
                    carEdges.slice(startIndex, endIndex).map( ({ node: car }) => do {

                    <CarViewRowContainer key={car.id} car={car}
                    onDeleteCar={this.props.onDeleteCar} onUpdateCar={this.props.onUpdateCar}/>;


                });
                }
                }}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan="2">
                        <button type="button" onClick={this.createCar}>Create Car</button>
                    </td>
                    <td colSpan="4">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ textAlign: 'right', width:'100%' }}>
                                {do {
                                    if (this.state.currentPage > 0) {
                                    <button type="button" onClick={this.loadPrev}>Prev</button>;
                                }
                                }}
                            </div>
                            <div style={{ textAlign: 'center', width:'100%' }}>
                                {this.state.currentPage + 1} of { Math.ceil(this.props.viewer.cars.totalCount / this.state.pageLength) } pages
                            </div>
                            <div style={{ textAlign: 'left', width:'100%' }}>
                                {do {
                                    if (this.props.viewer.cars.pageInfo.hasNextPage
                                    || this.state.currentPage < this.state.lastPageLoaded) {
                                    <button type="button" onClick={this.loadNext}>Next</button>;
                                }
                                }}
                            </div>
                        </div>
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>;
    }

}

export const PaginatedCarTableContainer = createPaginationContainer(
    CarTable,
    graphql.experimental`
    fragment paginatedCarTable_viewer on Viewer @argumentDefinitions(
        count: { type: "Int", defaultValue: 3 }
        cursor: { type: "String" }
      ) {
      cars(
        first: $count
        after: $cursor
      ) @connection(key: "CarTable_cars") {
        edges {
          node {
            id
            ...carViewRow_car
          }
          cursor
        }
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `, {
        direction: 'forward',
        getConnectionFromProps: (props) => {
            return props.viewer && props.viewer.cars;
        },
        getFragmentVariables: (prevVars, totalCount) => {
            return {
                ...prevVars,
                count: totalCount,
            };
        },
        getVariables: (props, { count, cursor }) => {
            return {
                count,
                cursor,
            };
        },
        query: graphql.experimental`
      query paginatedCarTableQuery(
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...paginatedCarTable_viewer @arguments(count: $count, cursor: $cursor)
        }
      }
    `
    },
);
