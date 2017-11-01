import {
  GraphQLObjectType, GraphQLString, GraphQLList
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../utils/node-definitions';
import { registerType } from '../utils/resolve-type';

import { CarMakeModels } from '../models/graphql-models';
import { CarMakeModelData } from '../models/car-make-model-data';

export const carMakeModelType = new GraphQLObjectType({

  name: 'CarMakeModel',

  description: 'A car make model',

  fields: () => ({
    id: globalIdField('CarMakeModels'),
    make: { type: GraphQLString },
    models: { type: new GraphQLList(GraphQLString) } ,
  }),

  interfaces: () => [ nodeInterface ],

});


const carMakeModelData = new CarMakeModelData('http://localhost:3010');
registerType(CarMakeModels, carMakeModelType, id => {
  return carMakeModelData.one(id).then(carmakemodels => Object.assign(new CarMakeModels(), carmakemodels));
});
