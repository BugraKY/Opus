import errors from '../errors';

var Locker = function Locker() {
  var info = {};

  var currentCount = function currentCount(lockName) {
    return info[lockName] || 0;
  };

  return {
    obtain: function obtain(lockName) {
      info[lockName] = currentCount(lockName) + 1;
    },
    release: function release(lockName) {
      var count = currentCount(lockName);

      if (count < 1) {
        throw errors.Error('E0014');
      }

      if (count === 1) {
        delete info[lockName];
      } else {
        info[lockName] = count - 1;
      }
    },
    locked: function locked(lockName) {
      return currentCount(lockName) > 0;
    }
  };
};

export default Locker;