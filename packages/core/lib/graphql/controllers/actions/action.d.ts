import {GraphQLInterfaceType, GraphQLObjectType} from 'graphql';
import type {Action} from '../../../controllers/abstract';
export declare function resolve(action: Action): any;
export declare const fields: {
  type: {
    type: import('graphql').GraphQLScalarType;
  };
  action: {
    type: import('graphql').GraphQLScalarType;
  };
};
export declare const ControllerAction: GraphQLInterfaceType;
export declare const ButtonType: GraphQLObjectType<any, any>;
