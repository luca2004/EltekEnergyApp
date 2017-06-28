/** @class fileSettings
* Classe per salvataggio dei parametri di settings dell'applicazione .*/
var fileSettings = new Class({
    fileHandler: null,
    params: {
          'nameapp': 'ZQ Light Link', 'enabledebug' : 0, 'manualregtimeout': 60,
          'limitsignallevel' : 50, 'timeoutRFscanning': 10, 'maxnodenumber': 100,
          'saveproject': 0, 'language': 'eng'
            },

    /** @function Costruttore
    *   @param {object} opts - Set of options passed by caller.
    */
    initialize: function (opts){
        var self = this;
        this.fileHandler = new dbFileStorage( { filename: 'settings',
                                                onLoaded: function(bLoaded){
                                                    if(bLoaded)   self.loadParams();
                                                    else          self.saveDefaults();
                                                }
                                              })

    },

    getParam: function(key){
        return this.params[key];
    },

    setParam: function(key, value){
        var obj = {};
        obj[key] = value;
        this.setParams( obj );
    },

    setParams: function(obj){
        this.params = $.extend(this.params, obj);
    },

    saveParams: function(){
        var self = this;
        $.each( this.params, function(Key, value){
            self.fileHandler.addParamValue(Key, value);
        } )
        return this.fileHandler.save();
    },

    // Protected
    loadParams: function(){
        var file = this.fileHandler;
        var self = this;
        $.each( this.params, function(key, value){
                              if(file.getParamValue(key) == null)
                                  file.addParamValue(key, value);
                              else
                                  self.params[key] = file.getParamValue(key);
                            } );
    },

    saveDefaults: function(){
        var file = this.fileHandler;
        var self = this;
        $.each( this.params, function(key, value){
                                  file.addParamValue(key, value);
                                  file.save();
                            } );
    }
});
