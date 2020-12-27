import {GraphQLInterfaceType, GraphQLObjectType, GraphQLString, GraphQLUnionType} from 'graphql';
import type {Action} from '../../../controllers/abstract';

export function resolve(action: Action): any {
  switch (action.type) {
    case 'button':
      return ButtonType;
  }
}

export const fields = {
  type: {type: GraphQLString},
  action: {type: GraphQLString},
};

export const ControllerAction = new GraphQLInterfaceType({
  name: 'ControllerAction',
  fields: () => ({...fields}),
  resolveType: resolve,
});

export const ButtonType = new GraphQLObjectType({
  name: 'ControllerActionButtonType',
  interfaces: () => [ControllerAction],
  fields: () => ({...fields}),
});
