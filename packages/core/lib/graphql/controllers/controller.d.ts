import {GraphQLInterfaceType, GraphQLList} from 'graphql';
import {AbstractController} from '../../controllers/abstract';
export declare const fields: {
  status: {
    type: import('graphql').GraphQLScalarType;
  };
  availableActions: {
    type: GraphQLList<import('graphql').GraphQLType>;
    resolve(controller: AbstractController): import('../../controllers/abstract').Action[];
  };
};
export declare const Controller: GraphQLInterfaceType;
