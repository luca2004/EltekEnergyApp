myAppModels.EnergyCounterModel = Backbone.DeepModel.extend({


      initialize: function(attributes, opts){

      },

      totalPower: function(){
          var sum = 0;
          var arrPC = this.get('power_consumption');
          for(var i = 0; i < arrPC.length; i++){
              sum += parseInt(arrPC[i]);
          }
          return sum;
      },


      // Default values for all of the Node Model attributes
      defaults: {

          name:   '',
          datetime: -1,
          power_consumption: [],
          unit: 'KWh'
      }


  });
