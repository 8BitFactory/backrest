'use strict';
angular.module('mongoConductorApp').controller('UsersCtrl', function($scope, api) {

  $scope.users = [];

  $scope.list = {};
  $scope.list.end = false;
  $scope.list.index = 0;
  $scope.list.loading = false;
  $scope.list.page = function() {
    if (!$scope.list.end && !$scope.list.loading) {

      $scope.list.loading = true;
      api.read({
        'collection': 'users',
        'conditions': {},
        'limit': 30,
        'sort': {
          _created: -1
        },
        'skip': ($scope.list.index * 30),
        'success': function(result) {

          if (result.data.length === 0) {
            $scope.list.end = true;
          } else {
            if ($scope.users.length < result.total) {
              $scope.list.index++;
              $scope.users = $scope.users.concat(result.data);
            }
          }
          $scope.list.loading = false;
        }
      });
    }
  };

  $scope.save = function() {
    if ($scope.user._id) {
      api.update({
        'collection': 'users',
        'document': $scope.user,
        'success': function() {}
      });
    } else {
      api.create({
        'collection': 'users',
        'document': $scope.user,
        'success': function(data) {
          console.log(data);
        }
      });
    }
  };

  $scope.edit = function(user) {
    $scope.modalTitle = 'Edit User';
    $scope.modalMode = 'EDIT';
    $scope.user = user;
  };

  $scope.add = function() {
    $scope.modalTitle = 'Add User';
    $scope.modalMode = 'ADD';
    $scope.user = {};
  };

  $scope.delete = function(user) {
    $scope.user = user;
  };

  $scope.deleteConfirm = function() {
    api.delete({
      'collection': 'users',
      '_id': $scope.user._id,
      'success': function() {
        $scope.users.splice($scope.users.indexOf($scope.user), 1);
        $scope.user = {};
      }
    });
  };
});