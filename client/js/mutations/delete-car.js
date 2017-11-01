import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation deleteCarMutation($input: DeleteCarInput!) {
    deleteCar(input: $input) {
      viewer {
        id
        cars {
          totalCount
        }
      }
      car {
        id
        make
        model
        year
        color
        price
      }
    }
  }
`;

const sharedUpdater = (source, viewerId, carId, totalCount, totalPrice) => {
  const viewerProxy = source.get(viewerId);
  const conn = ConnectionHandler.getConnection(viewerProxy, 'CarTable_cars');
  const car = source.get(carId);
  ConnectionHandler.deleteNode(conn, carId);

  // update the total count
  if (!totalCount) {
    totalCount = conn.getValue('totalCount') - 1;
  }
  conn.setValue(totalCount, 'totalCount');  

  // update the total price
  if (!totalPrice) {
    totalPrice = conn.getValue('totalPrice') - car.getValue('price');
  }
  conn.setValue(totalPrice, 'totalPrice');
};

let clientMutationId = 0;

export const deleteCar = (environment, viewerId, carId) => {

  return new Promise((resolve, reject) => {
    
    commitMutation(
      environment,
      {
        mutation,
        variables: {
          input: {
            carId,
            clientMutationId: String(clientMutationId++),
          },
        },
        updater: source => {
          const payload = source.getRootField('deleteCar');
          if (!payload) {
            return;
          }
          const deletedCar = payload.getLinkedRecord('car');

          const totalCount = payload.getLinkedRecord('viewer')
            .getLinkedRecord('cars').getValue('totalCount');

          const totalPrice = payload.getLinkedRecord('viewer')
            .getLinkedRecord('cars').getValue('totalPrice');
          
          sharedUpdater(source, viewerId, deletedCar.getValue('id'),totalCount, totalPrice);
        },
        optimisticUpdater: source => {
          sharedUpdater(source, viewerId, carId);
        },
        onCompleted: (results, errors) => {
          if (errors) {
            reject(errors);
            return;
          }
          resolve(results);
        },
        onError: errors => reject(errors),
      }
    );

    
  });


};
