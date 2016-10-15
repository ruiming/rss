(function() {
    angular
        .module('app')
        .controller('MeController', MeController);

    function MeController(user, User) {
        var vm = this;
        vm.user = user.data;
        vm.update = update;

        function update() {
            return User.update(vm.user).$promise;
        }
    }
}());
