import {
  GraphQLObjectType, GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../utils/node-definitions';
import { registerType } from '../utils/resolve-type';

import { Color } from '../models/graphql-models';
import { ColorData } from '../models/color-data';

export const colorType = new GraphQLObjectType({

  name: 'Color',

  description: 'A single color',

  fields: () => ({
    id: globalIdField('Color'),
    color: { type: GraphQLString },
  }),

  interfaces: () => [ nodeInterface ],

});


const colorData = new ColorData('http://localhost:3010');
registerType(Color, colorType, id => {
  return colorData.one(id).then(color => Object.assign(new Color(), color));
});
