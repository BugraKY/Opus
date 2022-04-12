import arrayQueryImpl from './array_query';
import remoteQueryImpl from './remote_query';
export var queryImpl = {
  array: arrayQueryImpl,
  remote: remoteQueryImpl
};