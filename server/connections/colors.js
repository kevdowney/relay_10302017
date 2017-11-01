import { GraphQLInt, GraphQLFloat } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { colorType } from '../types/color-type';

export const {
  connectionType: colorConnectionType,
  edgeType: colorEdgeType
} = connectionDefinitions({
  
  name: 'Colors',
  nodeType: colorType,

  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
    },

  }),

});