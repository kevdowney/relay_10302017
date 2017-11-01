import { GraphQLObjectType } from 'graphql';
import { globalIdField, connectionArgs, connectionFromArray } from 'graphql-relay';

import { widgetConnectionType } from '../connections/widgets';
import { carConnectionType } from '../connections/cars';
import { carMakeModelConnectionType } from '../connections/car-make-models';
import { colorConnectionType } from '../connections/colors';
import { WidgetData } from '../models/widget-data';
import { CarData } from '../models/car-data';
import { CarMakeModelData } from '../models/car-make-model-data';
import { ColorModelData } from '../models/color-data';
import { Widget, Viewer, Car, CarMakeModels, Color } from '../models/graphql-models';
import { nodeInterface } from '../utils/node-definitions';
import { registerType } from '../utils/resolve-type';

export const viewerType = new GraphQLObjectType({

  name: 'Viewer',
  description: 'User of the application',
  fields: () => ({
    id: globalIdField('Viewer'),
    widgets: {
      type: widgetConnectionType,
      description: 'get all of the widgets',
      args: connectionArgs,
      resolve: (_, args, { baseUrl }) => {
        const widgetData = new WidgetData(baseUrl);
        return widgetData.all().then(widgets => {
          const widgetModels = widgets.map(w => Object.assign(new Widget(), w));
          const conn = connectionFromArray(widgetModels, args);
          conn.totalCount = widgetModels.length;
          return conn;
        });
      },
    },
    cars: {
      type: carConnectionType,
      description: 'get all of the cars',
      args: connectionArgs,
      resolve: (_, args, { baseUrl }) => {
        const carData = new CarData(baseUrl);
        return carData.all().then(cars => {
          const carModels = cars.map(c => Object.assign(new Car(), c));
          const conn = connectionFromArray(carModels, args);
          conn.totalCount = carModels.length;
          conn.totalPrice = 0;
          carModels.forEach((car) => (conn.totalPrice += car.price));
          return conn;
        });
      },
    },
    carmakemodels: {
      type: carMakeModelConnectionType,
      description: 'get all of the car makes and models',
      args: connectionArgs,
      resolve: (_, args, { baseUrl }) => {
        const carMakeModelData = new CarMakeModelData(baseUrl);
        return carMakeModelData.all().then(carmakemodels => {
          const carMakeModels = carmakemodels.map(c => Object.assign(new CarMakeModels(), c));
          const conn = connectionFromArray(carMakeModels, args);
          conn.totalCount = carMakeModels.length;
          return conn;
        });
      },
    },
    colors: {
      type: colorConnectionType,
      description: 'get all colors',
      args: connectionArgs,
      resolve: (_, args, { baseUrl }) => {
        const colorData = new ColorData(baseUrl);
        return colorData.all().then(colors => {
          const colorModels = colors.map(c => Object.assign(new Color(), c));
          const conn = connectionFromArray(colorModels, args);
          conn.totalCount = colorModels.length;
          return conn;
        });
      },
    }
  }),

  interfaces: () => [ nodeInterface ],

});

registerType(Viewer, viewerType, id => {
  return Object.assign(new Viewer(), { id });
});