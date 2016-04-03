var config = {
    googleHost : {
        live : 'https://google.com'
    }
};

module.exports = function getCurrentConfig(env){
    var currentConfig = {};

    Object.keys(config)
        .forEach(function (key) {
            var value = config[key][env];
            if (typeof value === 'undefined' && config[key].default){
                value = config[key].default;
            }
            else if (typeof value === 'undefined'){
                throw new Error(`There is no config for env ${env} with key ${key}`);
            }
            currentConfig[key] = value;
        });

    return currentConfig;
};