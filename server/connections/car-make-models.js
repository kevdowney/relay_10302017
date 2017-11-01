import { GraphQLInt, GraphQLFloat } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { carMakeModelType } from '../types/car-make-model-type';

export const {
  connectionType: carMakeModelConnectionType,
  edgeType: carMakeModelEdgeType
} = connectionDefinitions({
  
  name: 'CarMakeModels',
  nodeType: carMakeModelType,

  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
    },

  }),

});