import Callbacks from '../../core/utils/callbacks';
import ngModule from './module'; // eslint-disable-next-line no-restricted-imports

import angular from 'angular';

if (angular) {
  ngModule.service('dxDigestCallbacks', ['$rootScope', function ($rootScope) {
    var begin = Callbacks();
    var prioritizedEnd = Callbacks();
    var end = Callbacks();
    var digestPhase = false;
    $rootScope.$watch(function () {
      if (digestPhase) {
        return;
      }

      digestPhase = true;
      begin.fire();
      $rootScope.$$postDigest(function () {
        digestPhase = false;
        prioritizedEnd.fire();
        end.fire();
      });
    });
    return {
      begin: {
        add: function add(callback) {
          if (digestPhase) {
            callback();
          }

          begin.add(callback);
        },
        remove: begin.remove.bind(begin)
      },
      end: {
        add: end.add.bind(end),
        addPrioritized: prioritizedEnd.add.bind(prioritizedEnd),
        remove: end.remove.bind(end)
      }
    };
  }]);
}