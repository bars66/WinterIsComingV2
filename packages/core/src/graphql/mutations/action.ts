import {GraphQLBoolean, GraphQLString, GraphQLNonNull, GraphQLError} from 'graphql';
import {Context} from '../../context';

type ArgsType = {
  action: string;
  params: string;
  controller: string;
};

export default {
  type: GraphQLBoolean,
  args: {
    action: {type: new GraphQLNonNull(GraphQLString)},
    params: {type: new GraphQLNonNull(GraphQLString)},
    controller: {type: new GraphQLNonNull(GraphQLString)},
  },
  // TODO: Понять где тут несовместимость типов
  async resolve(
    unused: any,
    {controller: controllerId, action, params}: any,
    context: Context
  ): Promise<boolean> {
    if (!context.controllers) {
      throw new GraphQLError('Not initialized');
    }

    const controller = context.controllers[controllerId];

    if (!controller) {
      throw new GraphQLError('Unknown controller');
    }

    await controller.executeAction(action, params);

    return true;
  },
};
