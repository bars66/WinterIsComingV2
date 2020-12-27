import {GraphQLInterfaceType, GraphQLString, GraphQLList} from 'graphql';
import {resolveFields} from './controllersResolveFields';
import {ControllerAction} from './actions/action';
import {AbstractController} from '../../controllers/abstract';

export const fields = {
  status: {type: GraphQLString},
  availableActions: {
    type: new GraphQLList(ControllerAction),
    resolve(controller: AbstractController) {
      return controller.getActions();
    },
  },
};

export const Controller = new GraphQLInterfaceType({
  name: 'Controller',
  fields: () => ({
    ...fields,
  }),
  resolveType: resolveFields,
});
