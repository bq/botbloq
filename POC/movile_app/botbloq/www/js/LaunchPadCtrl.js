/**
 * @ngdoc controller
 * @name botbloq:LaunchPadCtrl
 *
 * @description
 *
 *
 * @requires $scope
 * */
angular.module('botbloq')
    .controller('LaunchPadCtrl', function ($scope, $ionicPlatform, toaster) {
        var api = new HubsAPI('ws://localhost:8888/1'),
            client = api.TopicsManager.client,
            server = api.TopicsManager.server,
            ipFound;


        function getIp(callback) {
            callback = callback || angular.noop();
            if (networkinterface) {
                networkinterface.getIPAddress(callback);
            } else {
                callback('127.0.0.1')
            }
        }

        function checkIp(ip, waiting) {
            api.connect('ws:/' + ip + ':8888/1').then(function () {
                ipFound = 'ws:/' + ip + ':8888/1';
                $scope.$apply(function () {
                    toaster.clear([waiting]);
                    toaster.success('Connected', "Intel found in: " + ip);
                });
                api.connect(ipFound);
            })
        }

        function findRosServer(ip) {
            var ipBase = ip.split('.'),
                waiting = toaster.wait({
                    title: 'Searching',
                    body: 'Looking for intel IP',
                    timeout: 10000
                });
            for (var i = 1; i < 256; i++) {
                ipBase[3] = i;
                var current_ip = ipBase.join('.');
                checkIp(current_ip, waiting);
            }
        }

        client.showToast = function (message) {
            toaster.pop('info', 'Robot says', message);
        };

        client.getAcceleration = function () {
            return new Promise(function (resolve, reject) {
                navigator.accelerometer.getCurrentAcceleration(resolve, reject);
            })
        };

        function createButton(name, click) {
            return {
                name: name,
                onClick: click
            }
        }

        function publish() {
            server.publish('I am Ionic!!');
        }

        $scope.buttons = [createButton('publish', publish),
            createButton('get acc', client.getAcceleration),
            createButton('Search intel', function () {
                findRosServer('172.16.31.23')
            })];

        $ionicPlatform.ready(function () {
            getIp();
        });

    });
