var myAppViews = myAppViews     || {};
//--------------------------------------------------------------------------------//
/** @class dbApp
* Classe factory delle views dell'applicazione .*/
var FactoryViews = new Class({
    appViews: {},
    app: null,

    /** @function Costruttore
     *
     */
    initialize: function (opts){
          this.app = opts.app;
    },

    getView: function(name){
        if(this.appViews[name] == null){
            if(name === 'home')         this.appViews[name] = new myAppViews.HomeView({app: this.app});
            if(name === 'energylist')   this.appViews[name] = new myAppViews.EnergyListView({app: this.app});

        }
        return this.appViews[name];
    },

    ShowView: function(name, opts){
        var view = this.getView(name);
        if(view != null){
            view.setOpts(opts);
            view.off();
            view.render();
        }
    }


  });
