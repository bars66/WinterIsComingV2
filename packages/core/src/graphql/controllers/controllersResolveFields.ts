import {AbstractControllerType} from './abstractController';
import {AbstractController} from '../../controllers/abstract';
import {Zhlz} from '../../controllers/zhlz';
import {ZhlzType} from './zhlz';
import {Flower} from '../../controllers/flower';
import {FlowerType} from './flower';

export function resolveFields(value: AbstractController): any {
  if (value instanceof Zhlz) return ZhlzType;
  if (value instanceof Flower) return FlowerType;
  return AbstractControllerType;
}
