/** @Class  dbFileStorage
 *      Classe per salvataggio oggetto javascript  [dipende da localforage]
 *
 *  Usage:
 *      var file = new dbFileStorage({ filename: 'settings', onLoaded: function(){} } );
 *      file.addParamValue('nameapp', 'pippo');
 *      file.addParamValue('system', { networkid: 0, rfhop: 0 } );
 *      file.save();
 *
 */
var dbFileStorage = new Class({
    keyName: null,
    defaultValue: {  },

    /** @function Costruttore
    *   @param {object} opts - Set of options passed by caller.
    */
    initialize: function (opts){
        var self = this;
        this.keyName = opts.filename;

        if(this.keyName){
            localforage.getItem(this.keyName, function(err, value) {
                    if(value === null || typeof value == 'undefined'){
                        if(err)   console.error( err );
                        self.save();
                        if(opts.onLoaded)       opts.onLoaded(false);
                    }
                    else{
                        console.log(value['defaultValue']);
                        self.defaultValue = value['defaultValue'];
                        if(opts.onLoaded)       opts.onLoaded(true);
                    }
                });
        }
    },

    /** @function addParamValue
    *   @param {string} name - Nome del parametro
    *   @param {string / obj} obj - Valore del parametro
    */
    addParamValue: function(name, obj){
        var insertValue = {};
        insertValue[name] = obj;
        this.defaultValue = $.extend( this.defaultValue, insertValue );
    },

    /** @function getParamValue
    *   @param {string} name - Nome del parametro
    *   @param {string / object} obj - Valore del parametro
    */
    getParamValue: function(name){
        if(this.defaultValue[name] !== null){
            return this.defaultValue[name];
        }
        return null;
    },

    save: function(){
        if(this.keyName){
            var self = this;
            localforage.setItem(this.keyName, { defaultValue: this.defaultValue },
                                function(err, value) {
                                    myUtils.log('dbFileStorage::save Salvata la key ' + self.keyName);
                                });
            return true;
        }
        return false;
    },

    erase: function(){
        if(this.keyName){
            localforage.removeItem(this.keyName);
            return true;
        }
        return false;
    }


}) ;
