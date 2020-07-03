import {GraphQLNonNull} from 'graphql';
import {Context} from '../../context';
declare const _default: {
  type: import('graphql').GraphQLScalarType;
  args: {
    action: {
      type: GraphQLNonNull<import('graphql').GraphQLNullableType>;
    };
    params: {
      type: GraphQLNonNull<import('graphql').GraphQLNullableType>;
    };
    controller: {
      type: GraphQLNonNull<import('graphql').GraphQLNullableType>;
    };
  };
  resolve(
    unused: any,
    {controller: controllerId, action, params}: any,
    context: Context
  ): Promise<boolean>;
};
export default _default;
