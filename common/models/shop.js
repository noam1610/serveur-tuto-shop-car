'use strict';

// var loopback = require('loopback');
// var app = module.exports = loopback();

module.exports = function(Shop) {

    Shop.cashAvailable = function(shopId, cb) {
        Shop.findById(shopId, function(err, instance) {
            console.log('instance', instance);
            var cashAvailable = instance.cash;
            cb(null, cashAvailable);
        });
    };

    Shop.remoteMethod(
        'cashAvailable', {
            http: {
                path: '/cashAvailable',
                verb: 'get'
            },
            accepts: {
                arg: 'id',
                type: 'string',
                http: {
                    source: 'query'
                }
            },
            returns: {
                arg: 'cashAvailable',
                type: 'number'
            }
        }
    );

    Shop.buyCar = function(shopId, carId, cb) {

        //From shop.js we need to access Car model
        var Car = Shop.app.models.Car;

        //get the Shop instance with the right id
        Shop.findById(shopId, function(err, instanceShop) {
            //get the Car instance with the right id
            Car.findById(carId, function(err2, instanceCar) {
                //Depending on the state of the car
                if (instanceCar != null) {
                    switch (instanceCar.status) {
                        case "product":
                            instanceCar.status = "store";
                            Car.upsert(instanceCar);
                            instanceShop.cash -= instanceCar.price;
                            Shop.upsert(instanceShop);
                            cb(null, "success");
                            break;
                        case "store":
                            cb(null, "Already belong to a store");
                            break;
                        case "custom":
                            instanceCar.status = "store";
                            Car.upsert(instanceCar);
                            instanceShop.cash -= instanceCar.price;
                            Shop.upsert(instanceShop);
                            cb(null, "You buy a second-hand car");
                            break;
                        default:
                            break;
                    }
                }
            });
        });
    };

    Shop.remoteMethod(
        'buyCar', {
            http: {
                path: '/buyCar',
                verb: 'get'
            },
            accepts: [{
                arg: 'ShopId',
                type: 'string',
                required: true
            }, {
                arg: 'CarId',
                type: 'string',
                required: true
            }],
            returns: {
                arg: 'reponse',
                type: 'number'
            }
        }
    );
};
