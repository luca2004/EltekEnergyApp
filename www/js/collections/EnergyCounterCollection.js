myAppModels.EnergyCounterCollection = Backbone.Collection.extend({
      model: myAppModels.EnergyCounterModel,

      byDatetime: function(datetime){
            var filtered = this.filter(function (item) {
                if( item.get('datetime') == datetime ){
                    return true;
                }
            });
            return new myAppModels.EnergyCounterCollection(filtered);
      },

      getEnergyCounter: function(name, datetime){
          var ret = null;
          this.each( function(item){
              if(item.get('name') == name && item.get('datetime') == datetime){
                  ret = item;
                  return false;
              }
          } );
          return ret;
      },

      byDescription: function(descr){
          filtered = this.filter(function (box) {
              return box.get("description") === descr;
          });
          return new myAppModels.EnergyCounterCollection(filtered);
      },
      byName: function(name){
          filtered = this.filter(function (box) {
              return box.get("name") === name;
          });
          return new myAppModels.EnergyCounterCollection(filtered);
      },

      addEnergyCounter: function(obj){
          this.add( new  myAppModels.EnergyCounterModel( {
                                              id: obj.id,
                                              object_id: obj.object_id,
                                              name: obj.name,
                                              description: obj.description,
                                              type: obj.type,
                                              datetime: obj.datetime,
                                              power_consumption: obj.power_consumption.split('#')  } ) );
      }
});
