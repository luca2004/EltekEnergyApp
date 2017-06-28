//--------------------------------------------------------------------------------//
/** @class dbApp
* Classe gestore dei messaggi MQTT in websocket */
var mqttHandler = new Class({
	_options : {  
		host: '', port: 0,
		username: '', password: '',
		topic: '',
		onConnect: null, onConnectFailed: null,
		onConnectionLost: null, onMessageArrived: null		
	},
	mqttClient : null,
	bConnected: false,
	
	/** @function Costruttore
     *
     */
    initialize: function (opts){
        this._options = $.extend( {}, this._options, opts);

		this.createClient();	
		
		this.connectClient();
    },
	
	Publish: function(msg){
		if(this.bConnected){
			message = new Paho.MQTT.Message(msg);
			message.destinationName = this._options['topic'];
			this.mqttClient.send(message);
		}
	},
	
	//------------------------------------------------------------------//
	createClient: function(){
		var self = this;
		// Create a client instance
		this.mqttClient = new Paho.MQTT.Client(this._options['host'],this._options['port'], "web_" + parseInt(Math.random() * 100, 10)); 
		//Example client = new Paho.MQTT.Client("m11.cloudmqtt.com", 32903, "web_" + parseInt(Math.random() * 100, 10));
		// set callback handlers
		this.mqttClient.onConnectionLost = function(responseObject){
			self.bConnected = false;
			if(self._options['onConnectionLost'] !== null)
				self._options.onConnectionLost(responseObject);
		}
		this.mqttClient.onMessageArrived = function(message){
			if(self._options['onMessageArrived'] !== null)
				self._options.onMessageArrived(message);
		};
	},
	
	connectClient: function(){
		var self = this;
		var options = {
			useSSL: true,
			userName: this._options['username'],
			password: this._options['password'],
			onSuccess:	function(){	
				console.log("mqttHandler::onConnect ==> Subscribe " + self._options['topic']);
				self.mqttClient.subscribe(self._options['topic']);
				self.bConnected = true;
				if(self._options['onConnect'] !== null)
					self._options.onConnect();
			
			},
			onFailure:	function(e){
				self.bConnected = false;
				if(self._options['onConnectFailed'] !== null)
					self._options.onConnectFailed(e);
			}
		  }

		  // connect the client
		  this.mqttClient.connect(options);
	}

});