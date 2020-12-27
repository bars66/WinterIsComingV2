import {GraphQLList} from 'graphql';
import {Context} from '../../context';
import type {AbstractController} from '../../controllers/abstract';
declare const _default: {
  type: GraphQLList<import('graphql').GraphQLType>;
  resolve(
    unused: any,
    args: any,
    context: Context
  ): Promise<
    Array<{
      controller: AbstractController;
      id: string;
    }>
  >;
};
export default _default;
