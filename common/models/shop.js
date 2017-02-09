'use strict';

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
};
