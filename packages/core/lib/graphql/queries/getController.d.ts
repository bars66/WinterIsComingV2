import {GraphQLList} from 'graphql';
import {Context} from '../../context';
import type {AbstractController} from '../../controllers/abstract';
declare const _default: {
  type: GraphQLList<import('graphql').GraphQLType>;
  resolve(unused: any, args: any, context: Context): Promise<Array<AbstractController>>;
};
export default _default;
