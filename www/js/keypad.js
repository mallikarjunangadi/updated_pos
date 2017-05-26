angular.module('starter.keypad', [])
.controller('keypad', function($rootScope, $scope, $cordovaSQLite, $state, $ionicModal, $cordovaToast, $ionicLoading, $ionicScrollDelegate) {

    // Quantity model start

    $rootScope.okCallback = {};
    $rootScope.cancelCallback = {};

    $rootScope.openNumericModal = function(currentScope, okCallback, cancelCallback) {

        $ionicModal.fromTemplateUrl('templates/numericKeypad.html', {
            scope: currentScope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.numericModal = modal;
            console.log(' Open Numeric Model');
            $scope.numericModal.show();
            $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
            $rootScope.keytypedCode = "1";

            //$scope.newProduct=product;
            $rootScope.okCallback = okCallback;
            $rootScope.cancelCallback = cancelCallback;
        });

    };

    $rootScope.keypadOk = function() {
        if ($rootScope.okCallback($rootScope.keytypedCode) == true)
            $rootScope.closeNumericModal();
    }

    $rootScope.keypadCancel = function() {
        //if($rootScope.okCallback() == true)

        $rootScope.closeNumericModal();
        console.log("Calling back Cancel");
        $rootScope.cancelCallback();

    }

    $rootScope.closeNumericModal = function() {
        console.log(' Closing Numeric Model')
        $scope.numericModal.hide();
        //$scope.newProduct = {};
        $rootScope.keytypedCode = null;
        count = 0;
    }
    ;

    //Numeric keypad for Quantity Start
    $rootScope.keytypedCode = 1;
    var count = 0

    $rootScope.keyPressed = function(keyCode) {
        console.log($rootScope.keytypedCode.length);
        console.log(count++)

        if ($rootScope.keytypedCode.length == count) {
            $rootScope.keytypedCode = $rootScope.keytypedCode.slice(0, -1);
        } else {
            console.log($rootScope.keytypedCode.length);
        }

        tempT = $rootScope.keytypedCode;

        switch (keyCode) {
        case -4:
            sendTheCodeQ();
            break;
        case -3:
            removeQ();
            break;
        case -2:
            removeAllQ();
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 0:
        case '.':
            if (keyCode == '.' && $rootScope.keytypedCode.toString().indexOf('.') > -1)
                return;

            /* if (!/\d/.test(tempT)) {
                    $rootScope.keytypedCode = keyCode;
                } else { 
                    $rootScope.keytypedCode += '' + keyCode;
                    console.log($rootScope.keytypedCode)
                }*/

            $rootScope.keytypedCode += '' + keyCode;

            console.log("keyCode: ", $rootScope.keytypedCode);
            break;

        }

        //$rootScope.keytypedCode = Number($rootScope.keytypedCode);

        function sendTheCodeQ() {
            if (/\d/.test(tempT)) {
                // TODO : sends the entered code
                console.log('entered code is ' + $rootScope.keytypedCode + " " + $rootScope.keytypedCode.length);
                $rootScope.keytypedCode = "";
            }
        }

        function removeQ() {
            console.log($rootScope.keytypedCode)
            if ($rootScope.keytypedCode.length > 0) {
                $rootScope.keytypedCode = $rootScope.keytypedCode.slice(0, -1);
            } else {
                $rootScope.keytypedCode = '';
            }
            console.log('I am in remove');
            // TODO start scaning the code and once it receives send to the socket
        }
        ;
        function removeAllQ() {
            //Numeric keypad for Payment Start
            $rootScope.keytypedCode = '';
        }

    }
    ;

});
