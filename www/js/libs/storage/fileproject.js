/** @class fileProject
* Classe per salvataggio dei parametri del file di progetto dell'applicazione .*/
var fileProject = new Class({
    fileHandler: null,
    params: {
          nameproject: 'myProject',
          nodes: []
            },
    onLoadComplete: null,

    initialize: function (opts){
        var self = this;
        var filename = 'project';
        if(opts.filename)           filename = opts.filename;
        if(opts.onLoadComplete)     this.onLoadComplete = opts.onLoadComplete;
        this.fileHandler = new dbFileStorage( { filename: filename,
                                                onLoaded: function(bLoaded){
                                                    if(bLoaded)   self.loadParams();
                                                    else          self.saveProject();
                                                    if(self.onLoadComplete)
                                                        self.onLoadComplete();
                                                }
                                              })

    },

    getNodes: function(){
        return this.params['nodes'];
    },
    resetNodes: function(){
        this.params['nodes'] = [];
    },
    addNode: function(node){
        this.params['nodes'].push(node);
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

    saveProject: function(){
        var file = this.fileHandler;
        var self = this;

        $.each( this.params, function(key, value){
                              if(key != 'nodes'){
                                  file.addParamValue(key, value);
                              }
                          } );

        file.addParamValue('nbNodes', this.params['nodes'].length);
        $.each( this.params['nodes'], function(index, item){
                file.addParamValue('node'+index+'_id', item.id);
                file.addParamValue('node'+index+'_name', item.name);
                file.addParamValue('node'+index+'_idSensor', item.idSensor);
                file.addParamValue('node'+index+'_idGroup', item.idGroup);
                file.addParamValue('node'+index+'_idNetwork', item.idNetwork);
                file.addParamValue('node'+index+'_type', item.type);
                file.addParamValue('node'+index+'_signalLevel', item.signalLevel);
                file.addParamValue('node'+index+'_typetext', item.typetext);
        });

        file.save();
    },

    // Protected
    loadParams: function(){
        var file = this.fileHandler;
        var self = this;

        $.each( this.params, function(key, value){
                          if(key != 'nodes'){
                              if(file.getParamValue(key) == null)
                                  file.addParamValue(key, value);
                              else
                                  self.params[key] = file.getParamValue(key);
                          }
                            } );

        var nbNodes = 0;
        if(file.getParamValue('nbNodes') != null)     nbNodes = file.getParamValue('nbNodes');
        this.params['nodes'] = [];
        for(var i = 0; i < nbNodes; i++){
              var node = {};
              if(file.getParamValue('node'+i+'_id') !== null)            node.id = file.getParamValue('node'+i+'_id');
              if(file.getParamValue('node'+i+'_name') !== null)          node.name = file.getParamValue('node'+i+'_name');
              if(file.getParamValue('node'+i+'_idSensor') !== null)      node.idSensor = file.getParamValue('node'+i+'_idSensor');
              if(file.getParamValue('node'+i+'_idGroup') !== null)       node.idGroup = file.getParamValue('node'+i+'_idGroup');
              if(file.getParamValue('node'+i+'_idNetwork') !== null)         node.idNetwork = file.getParamValue('node'+i+'_idNetwork');
              if(file.getParamValue('node'+i+'_type') !== null)          node.type = file.getParamValue('node'+i+'_type');
              if(file.getParamValue('node'+i+'_signalLevel') !== null)   node.signalLevel = file.getParamValue('node'+i+'_signalLevel');
              if(file.getParamValue('node'+i+'_typetext') !== null)      node.typetext = file.getParamValue('node'+i+'_typetext');

              this.params['nodes'].push(node);
        }
    }



});
