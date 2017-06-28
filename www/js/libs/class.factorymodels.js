var myAppModels = myAppModels   || {};
//--------------------------------------------------------------------------------//
/** @class dbApp
* Classe factory dei models / collections dell'applicazione .*/
var FactoryModels = new Class({
      app: null,
      appModels: {},

      /** @function Costruttore
       *
       */
      initialize: function (opts){
            this.app = opts.app;

            this.energies = new myAppModels.EnergyCounterCollection();
      },

      getEnergyCollection: function(){
          return this.energies;
      }

  });
