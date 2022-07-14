require('angular');
require('angular-mocks');
require('../app');
require('./playersController');

describe('Players Controller', function () {

  beforeEach(function () {
    angular.mock.module('api');
  });

  const fakePromise = () => new Promise((resolve) => resolve)

  const _playersAPI = {
    readPlayers: fakePromise,
    createPlayer: fakePromise,
    deletePlayer: fakePromise,
    updatePlayer: fakePromise,
  }

  let controller;
  let rootScope

  beforeEach(inject(($controller, $rootScope) => {
    rootScope = $rootScope
    controller = $controller
  }));

  describe('Order controller', function () {
    it('should return the right criterion and direction of the order by name', function () {
      const vm = newControllerInstance()
      vm.orderBy('A-Z')

      expect(vm.orderCriterion).toEqual('name')
      expect(vm.orderDirection).toEqual(false)
    })

    it('should return the right criterion and direction of the order by coins', function () {
      const vm = newControllerInstance()
      vm.orderBy('Mais moedas')

      expect(vm.orderCriterion).toEqual('coins')
      expect(vm.orderDirection).toEqual(true)
    })
  })

  describe('other functions', function (){    
    it('should initialize with the default informations', function (){
      const vm = newControllerInstance()

      expect(vm.users).toEqual([])
      expect(vm.insert).toEqual(false)
    })

    it('should check if there is any player set as "selecionado"', function(){
      const vm = newControllerInstance()
      const data = [
        {'name' : 'aubrey', 'coins' : 35, 'selecionado' : true}, 
        {'name' : 'basil', 'coins' : 15, 'selecionado' : false}
      ]

      var res = vm.isSelecionado(data)

      expect(res).toEqual(true)
    })

    it('should return false when dont have any player set as "selecionado"', function(){
      const vm = newControllerInstance()
      const data = [
        {'name' : 'hammond', 'coins' : 22, 'selecionado' : false}
      ]

      var res = vm.isSelecionado(data)

      expect(res).toEqual(false)
    })

    it.skip('should change the status of the application to "changing" when the editPlayer function is called', function (){
      const vm = newControllerInstance()
      vm.editPlayer()
      expect(vm.changing).toEqual(true)
    })
  })

  function newControllerInstance () {
    const scope = rootScope.$new()
    controller('mainController', {
      $scope: scope,
      playersAPI: _playersAPI
    })

    return scope
  }
});

