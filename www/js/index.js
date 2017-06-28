
var g_onBrowser = false;

var EltekMQTTPubSub = new Class({
      app: null,


      initialize: function (opts){
            var self = this;
            this.app = opts.app;
            this._opts = $.extend({},
                        {
                          onConnect: null, onConnectFailed: null,
                          topic: 'eltek'
                         },
                        opts) ;

            this.mqtt = new mqttHandler(  {
        					host: opts.host, port: opts.port,
        					username: opts.username, password: opts.password,
        					topic: this._opts.topic,
        					onConnect: function(){ if(self._opts['onConnect'] != null) self._opts.onConnect(); },
                  onConnectFailed: function(){ if(self._opts['onConnectFailed'] != null) self._opts.onConnectFailed(); },
        					onConnectionLost: function(responseObject){
        						if (responseObject.errorCode !== 0) {
        						      console.log("EltekMQTTPubSub::onConnectionLost:"+responseObject.errorMessage);
        						}
        					},
        					onMessageArrived: function(message){
                        var objMsg = JSON.parse(message.payloadString);
                        console.log( objMsg );
                        self.ProcessNewMessage( objMsg );
        						    //$('.content').append('==> ' + message.payloadString + '<br/>');
        					}
        				}
        			);

      },

      ProcessNewMessage: function(objmsg){
          var FM = this.app.getFactoryModels();

    		  if(objmsg.cmd == 'notify'){
    			  var data = objmsg.data;
    			  var ECM = FM.getEnergyCollection().getEnergyCounter(data.name, data.datetime);
    			  if(ECM == null){
    				      FM.getEnergyCollection().addEnergyCounter(data);
    			  }
    		  }

        //  console.log( FM.getEnergyCollection().toJSON() );
      },

      sendRequestEnergies: function(session, datetime){
        var msg = { cmd: 'request',
                    session: session,
                    data: { action: 'getEnergies', datetime: datetime }}
        console.log(JSON.stringify(msg));
        this.mqtt.Publish( JSON.stringify(msg) );
      }

  });
//--------------------------------------------------------------------------------//
/**
 * Classe main dell'applicazione
 * @namespace app
 *
 * @author Luca Caflisch
 * @e-mail luca.caflisch@zetaqlab.com
 */
var app = {
    f7: null, factoryviews: null, factorymodels: null,
    eltekSys: null,
    mainView: null,
    settings: null,
    options: {},

    /** @function initialize
    * Application Contstructor
    * @param {object} opts - Set of options passed by caller.*/
    initialize: function(opts) {
        var self = this;
        $.extend({}, this.options, opts);

        var isCordovaApp = !!window.cordova; g_onBrowser = !isCordovaApp;
        console.log('Cordova.js is loaded: ' + isCordovaApp);

        if(g_onBrowser)
            this.onDeviceReady();
        else
            document.addEventListener('deviceready',
                        function(){ self.onDeviceReady(); },
                        false);
    },

    /** @function onDeviceReady
     * When device is ready, or when it's assumed to be ready,
     * istantiates Framework7 object and views. */
    onDeviceReady: function() {
        var self = this;

        // Config  localforage
        // This will use a different driver order.
    /*    localforage.config({
            driver: [localforage.INDEXEDDB,
                     localforage.LOCALSTORAGE],
            name: 'myFileSystem'
        }); */

        this.setHtmlElements();
        this.setF7Templates(
            function(){
                self.myDeviceReady();
            }
        );
    },

    myDeviceReady: function(){
        var self = this;

        this.f7 = new Framework7({
            template7Pages: true,
            precompileTemplates: true,
            material: true
        });


        this.mainView = this.f7.addView('.view-main', {
            domCache: true
        });

  // --- Material Right View Menu      this.rightView = this.f7.addView('.view-right', {});

  //      this.settings = new fileSettings( {} );

        this.eltekSys = new EltekMQTTPubSub( { app: this,
                     host: 'm21.cloudmqtt.com', port: 31979,
                     username: 'ucqvnetw', password: 'ovYAygrGpLW0',
                     onConnect: function(){
                          // Show Home view
                          self.getFactoryViews().ShowView('home', {}); },
                    onConnectFailed: function(){
                        alert('Broker Connection Failed. SHow Pagina di errore');
                    },
                   } );


    },

    getFactoryViews: function(){
        if(this.factoryviews == null)     this.factoryviews = new FactoryViews({ app: this });
        return this.factoryviews;
    },
    getFactoryModels: function(){
        if(this.factorymodels == null)     this.factorymodels = new FactoryModels({ app: this });
        return this.factorymodels;
    },

    /** @function setHtmlElements
     * Get elements and insert in DOM. */
    setHtmlElements: function(){
        $.get('templates/elements.html',
            {},
            function(ret){
                $('#dynamic_elements').html(ret);
            },
            'text'
        );
    },
    /** @function setF7Templates
     * Get F7 templates and insert in DOM. */
    setF7Templates: function(clbEnd){
        $.get('templates/f7templates.html',
            {},
            function(ret){
                $('#dynamic_f7templates').html(ret);
                clbEnd();
            },
            'text'
        );
    }

};

app.initialize();
