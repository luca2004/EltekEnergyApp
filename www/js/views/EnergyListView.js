/**
 * EnergyListView.
 * @namespace myAppViews
 * @extends Backbone.View
 *
 * @author Luca Caflisch <luca.caflisch@zetaqlab.com>
 */
myAppViews.EnergyListView = Backbone.View.extend({
    el: '.view-main .page[data-page="energylist"]',
    app: null,
    currentEnergyCounters: 0,

    initialize: function(opts){
        var self = this;
        this.setOpts(opts);

        this.app.f7.onPageInit('energylist', function(){
            self.setEvents();
            self.showEnergyByDescription();
        });

    },

    setOpts: function(opts){
        this.currentEnergyCounters = 0;
        if(opts.app != null)      this.app = opts.app;
        this._opts = $.extend({},
                  { title: 'TITLE', counterdescription: '', countername: ''},
                  this._opts, opts);
    },

    render: function(){
        var self = this;


        this.app.mainView.router.load(  {
            url: 'templates/EnergyListView.html',
            animatePages: true,
            context:  {

                title: this._opts['title']

            }
        });



    },

    setEvents: function(){
    },

    showEnergyByDescription: function(){
        var self = this;
        var FM = this.app.getFactoryModels();
        var strDatetime = this._opts['energydays'];
        var ECDay = FM.getEnergyCollection().byDatetime( strDatetime );
        if(ECDay.length != this.currentEnergyCounters){
            if(this._opts['counterdescription'] != '')
              $('.content-block-title', this.el).html( 'Area '+this._opts['counterdescription']+' [Day: '+ myUtils.convertDateTime(strDatetime) +'] ');
            else
              $('.content-block-title', this.el).html( 'NO Area selected!!');

            var counters = null;
            if(this._opts['counterdescription'] != '')
                counters = ECDay.byDescription(this._opts['counterdescription']);

            if(counters != null){
              //  console.log( counters.toJSON() );
                var list = [];
                var factor_unit = 100;

                counters.each( function(item){
                    list.push( {name: item.get('name'),
                              totenergy: item.totalPower() / factor_unit,
                              count: 0,
                              unit: item.get('unit')
                            } )
                } );

                var html = Template7.templates.energycountersTemplate({
                        list : list
                    });

                $('div.energylist', this.el).html( html );
                this.setEvents();
            }
        }

        this.currentEnergyCounters = ECDay.length;
    }


  });
