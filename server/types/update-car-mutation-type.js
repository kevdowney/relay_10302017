import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { CarData } from '../models/car-data';
import { Viewer, Car } from '../models/graphql-models';

import { updateCarType } from './car-input-types';
import { viewerType } from './viewer-type';
import { carType } from './car-type';

export const updateCarMutationType = mutationWithClientMutationId({

    name: 'UpdateCar',

    inputFields: {
        car: {
            type: updateCarType
        }
    },

    outputFields: {
        viewer: {
            type: viewerType,
            resolve: () => Object.assign(new Viewer(), { id: 1 }),
        },
        car: { type: carType },
    },

    mutateAndGetPayload: ({ car }, { baseUrl }) => {
        car.id = fromGlobalId(car.id).id;
        const carData = new CarData(baseUrl);
        return carData.update(car).then(car =>
            ({ car: Object.assign(new Car(), car) })
        );
    },

});