var TodoApp = angular.module("TodoApp", ["ngRoute", "ngResource"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            when('/new', { controller: CreateCtrl, templateUrl: 'details.html' }).
            when('/edit/:editId', { controller: EditCtrl, templateUrl: 'details.html' }).
            otherwise({ redirectTo: '/' });
    })
    // Greeting message as top of page
    .directive('greet', function() {
        return {
            template: '<h2>Greetings from {{from}} to {{to}}</h2>',
            controller: function ($scope, $element, $attrs) {
                $scope.from = $attrs.from;
                $scope.to = $attrs.greet;
            }
        };
    });
    // Directive on the sorting of columns to make code efficient
    //TodoApp.directive('sorted', function () {
    //    return {
    //        scope: true,
    //        transclude: true,
    //    };
    //});

TodoApp.factory('Todo', function($resource){
    return $resource('/api/Todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

// Edit an existing Todo item controller
var EditCtrl = function ($scope, $location, $routeParams, Todo) {
    $scope.action = "Update";
    var id = $routeParams.editId;
    $scope.todo = Todo.get({ id: id });

    $scope.save = function() {
        Todo.update({ id: id }, $scope.todo, function () {
            $location.path('/');
        });
    };
};

// Create Todo item controller
var CreateCtrl = function ($scope, $location, Todo) {
    $scope.action = "Add";
    $scope.save = function () {
        Todo.save($scope.todo, function() {
            $location.path('/');
        });
    };
};

// List controller for listing Todo items
var ListCtrl = function ($scope, $location, Todo) {
    $scope.search = function() {
        Todo.query({
            q: $scope.query,
            sort: $scope.sort_order,
            desc: $scope.is_descending,
            offset: $scope.offset,
            limit: $scope.limit
        },
        function (data) {
            // adds 20 more records at a time 
            $scope.more = data.length === 20;
            // adds the new records to current list
            $scope.todos = $scope.todos.concat(data);
        });
    };

    // Ability to sort columns
    $scope.sort = function(col) {
        if ($scope.sort_order === col) {
            $scope.is_descending = !$scope.is_descending;
        } else {
            $scope.sort_order = col;
            $scope.is_descending = false;
        }
        $scope.reset();
    };
    // Show more records when requested
    $scope.show_more = function() {
        $scope.offset += $scope.limit;
        $scope.search();
    };
    //checks there are more records able to fetch
    $scope.has_more = function() {
        return $scope.more;
    }
    //resets list back to original state
    $scope.reset = function() {
        $scope.limit = 20;
        $scope.offset = 0;
        $scope.todos = [];
        $scope.more = true;
        $scope.search();
    }
    // delete a Todo item
    $scope.delete = function () {
        // gets item by Id to delete
        var Id = this.todo.Id;
        // deletes item
        Todo.delete({ id: Id }, function() {
            $('#todo_' + Id).fadeOut();
        });
    }

    // Default sort order when starting app
    $scope.sort_order = "Priority";
    $scope.is_descending = false;

    $scope.reset();
};