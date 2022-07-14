angular.module('api').controller('mainController', function($scope, playersAPI){
    var changingPlayer
    $scope.users = []   
    $scope.insert = false

    function loadPlayers(){
        playersAPI.readPlayers()
        .then((res) => {            
                $scope.msg = "Jogadores"
                $scope.users = res.data
                $scope.everythingOk = true
            })
        .catch(() => {
                $scope.msg = "Houve um erro para receber os jogadores"
                $scope.everythingOk = false
            })
    }

    $scope.addPlayer = function(player){  
        var sideToast = new bootstrap.Toast(document.getElementById("sideToast"))              
        playersAPI.createPlayer(player)
        .then((data) => {
                delete $scope.user
                loadPlayers()
                $scope.formsUser.$setPristine();
                $scope.insert = !$scope.insert

                window.scroll({
                    top: 0, 
                    left: 0, 
                    behavior: 'smooth'
                });
                $scope.toastHeader = 'toast-header text-bg-success'
                $scope.toastBody = {'--bs-bg-opacity': '.9', 'background-color': '#5ae974'}
                $scope.toastTitle = 'Sucesso!'
                $scope.toastText = 'O jogador foi criado!'
                $scope.toastIcon = 'bi bi-check-circle-fill'                
                
                sideToast.show();
            })
        .catch(() => {
            $scope.toastHeader = 'toast-header text-bg-danger'
            $scope.toastBody = {'--bs-bg-opacity': '.9', 'background-color': '#c24246'}
            $scope.toastTitle = 'Erro!'
            $scope.toastText = 'Houve um erro ao criar o jogador!'
            $scope.toastIcon = 'bi bi-x-circle-fill'

            sideToast.show();
        })
    }

    $scope.deleteMultiplePlayers = function(){
        var sideToast = new bootstrap.Toast(document.getElementById("sideToast"))
        var deleteToast = new bootstrap.Toast(document.getElementById("deleteToast"))  
        $scope.users = changingPlayer.filter(function(player){
            if(!player.selecionado){
                return player;
            }
            else{                
                playersAPI.deletePlayer(player._id)
                .then(() => {                    
                    $scope.toastHeader = 'toast-header text-bg-success'
                    $scope.toastBody = {'--bs-bg-opacity': '.9', 'background-color': '#5ae974'}
                    $scope.toastTitle = 'Sucesso!'
                    $scope.toastText = 'Os jogadores foram deletados!'
                    $scope.toastIcon = 'bi bi-check-circle-fill'

                    sideToast.show();
                })
            }
        })

        $scope.changing = false
        deleteToast.hide()
    }

    $scope.confirmDeletePlayer = function(player, onlyOne){
        $scope.onlyOne = onlyOne
        var deleteToast = new bootstrap.Toast(document.getElementById("deleteToast"))

        if(onlyOne){
            $scope.confirmDeleteMsg = "Deseja realmente deletar esse jogador?"
        }
        else{
            $scope.confirmDeleteMsg = "Deseja realmente deletar essses Jogadores?\n"
            player.forEach(player => {
                if(player.selecionado){
                    $scope.confirmDeleteMsg += "- " + player.name +"\n"
                }                
            });
        }
        
        deleteToast.show()
        $scope.changing = true
        changingPlayer = player       
    }

    $scope.deletePlayer = function(){
        var sideToast = new bootstrap.Toast(document.getElementById("sideToast"))
        var deleteToast = new bootstrap.Toast(document.getElementById("deleteToast"))    

        playersAPI.deletePlayer(changingPlayer._id)
        .then((res)=>{
            $scope.users = $scope.users.filter(function(user){
                if(user._id !== changingPlayer._id) return user
            })

            $scope.toastHeader = 'toast-header text-bg-success'
            $scope.toastBody = {'--bs-bg-opacity': '.9', 'background-color': '#5ae974'}
            $scope.toastTitle = 'Sucesso!'
            $scope.toastText = 'O jogador foi deletado!'
            $scope.toastIcon = 'bi bi-check-circle-fill'

            sideToast.show();
        })
        .catch(() => {
            $scope.toastHeader = 'toast-header text-bg-danger'
            $scope.toastBody = {'--bs-bg-opacity': '.9', 'background-color': '#c24246'}
            $scope.toastTitle = 'Erro!'
            $scope.toastText = 'Houve um erro ao deletar os jogadores!'
            $scope.toastIcon = 'bi bi-x-circle-fill'

            sideToast.show();
        })

        $scope.changing = false
        deleteToast.hide()
    }

    $scope.editPlayer = function(player){
        var updateToast = new bootstrap.Toast(document.getElementById("updateToast"))           
        updateToast.show()        
        
        $scope.changing = true
        changingPlayer = player
    }

    $scope.updatePlayer = function(){
        var updateToast = new bootstrap.Toast(document.getElementById("updateToast"))  
        var sideToast = new bootstrap.Toast(document.getElementById("sideToast"))
        const update = {
            'coins': $scope.newCoins
        }

        playersAPI.updatePlayer(changingPlayer._id, update)
        .then(() => {
            delete $scope.user
            loadPlayers()
            $scope.toastHeader = 'toast-header text-bg-success'
            $scope.toastBody = {'--bs-bg-opacity': '.9', 'background-color': '#5ae974'}
            $scope.toastTitle = 'Sucesso!'
            $scope.toastText = 'O jogador foi atualizado!'
            $scope.toastIcon = 'bi bi-check-circle-fill'                
            
            $scope.newCoins = ''
            updateToast.hide();
            sideToast.show();
        })
        .catch(() => {
            $scope.toastHeader = 'toast-header text-bg-danger'
            $scope.toastBody = {'--bs-bg-opacity': '.9', 'background-color': '#c24246'}
            $scope.toastTitle = 'Erro!'
            $scope.toastText = 'Houve um erro ao atualizar o jogador!'
            $scope.toastIcon = 'bi bi-x-circle-fill'
            
            $scope.newCoins = ''
            updateToast.hide();
            sideToast.show();
        })  

        $scope.changing = false
    }

    $scope.isSelected = function(players){
        return players.some(function(player){
            return player.selecionado;
        })
    }

    $scope.orderBy = function(option){
        if(option == 'A-Z'){            
            $scope.orderCriterion = 'name'
            $scope.orderDirection = false
        }
        else if(option == 'Z-A'){            
            $scope.orderCriterion = 'name'
            $scope.orderDirection = true
        }
        else if(option == 'Menos moedas'){            
            $scope.orderCriterion = 'coins'
            $scope.orderDirection = false
        }
        else if(option == 'Mais moedas'){            
            $scope.orderCriterion = 'coins'
            $scope.orderDirection = true
        }
    }

    loadPlayers()
})