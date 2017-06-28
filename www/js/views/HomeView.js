/**
 * Home View.
 * @namespace HomeView
 * @extends Backbone.View
 *
 * @author Luca Caflisch <luca.caflisch@zetaqlab.com>
 */
myAppViews.HomeView = Backbone.View.extend({
    el: '.view-main .page-content',
    app: null,
    currentEnergyCounters: 0,
    currentEnergyDays: '',


    /** @function initialize
    * Home View Constructor.
    * @param {object} opts - Set of options passed by caller.*/
    initialize: function(opts){
        var self = this;
        this.setOpts(opts);

        this.app.f7.onPageInit('home', function(){
            self.setEvents();
        });
        this.app.f7.onPageBack('energylist', function(){
            self.currentEnergyCounters = 0;
            self.showEnergyCollection();
        });
    },

    /** @function initialize options object.
    *     Public Function is mandatory for each views
    */
    setOpts: function(opts){
        if(opts.app != null)      this.app = opts.app;
        this._opts = $.extend({}, this._opts, opts);
    },

    /** @function render
    * Renders the devices list after bluetooth initialization */
    render: function(){
        var self = this;
        this.app.mainView.router.load(  {
            url: 'templates/home.html',
            ignoreCache: true,
            animatePages: true,
            context:  {

                text_content: '<center>Eltek Energy wait yesterday data...</center>'

            }
        });

        this.currentEnergyDays = self.getYesterdayDateTimeStr();
        setTimeout( function(){
            self.app.eltekSys.sendRequestEnergies('energyRequest', self.currentEnergyDays);
        }, 500);

        this.app.getFactoryModels().getEnergyCollection().on("change add remove reset", function(){ self.showEnergyCollection()});
    },

    setEvents: function(){
        var self = this;
        $('.energycounters a.item-link').off();
        $('.energycounters a.item-link').on('click', function(e){
              var jEl = $(e.currentTarget);
              console.log(jEl.attr('data-name'));
              //self.show_setup_view();
              self.app.getFactoryViews().ShowView('energylist',
                                            { title : jEl.attr('data-name'),
                                              counterdescription: jEl.attr('data-name'),
                                              countername: '',
                                              energydays: self.getYesterdayDateTimeStr()
                                             });
        });
    },

    getYesterdayDateTimeStr: function(){
        var d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(0, 0, 0, 0);
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var strDatetime = [pad(d.getFullYear()), pad(d.getMonth()+1), pad(d.getDate())].join('-')+'T'+'00:00:00';
      //  strDatetime = '2015-12-30T00:00:00';
        return strDatetime;
    },

    showEnergyCollection: function(){
        var self = this;
        var FM = this.app.getFactoryModels();

        var strDatetime = this.currentEnergyDays;
        var ECDay = FM.getEnergyCollection().byDatetime( strDatetime );
        if(ECDay.length != this.currentEnergyCounters){
            $('.content-block-title', this.el).html( 'Day: '+ myUtils.convertDateTime(strDatetime) +' ');

            var zones = ECDay.groupBy(function(model) {    return model.get('description');    });
            //  console.log( zones );
            var list = [];
            var factor_unit = 100;

            for(description in zones) {
                var models = zones[description];
                var totEnergies = 0; var unit = 'KWh';
                for (var model_idx in models) {
                    totEnergies += models[model_idx].totalPower();
                    unit = models[model_idx].get('unit');
                }
                list.push( {name: description,
                            totenergy: totEnergies / factor_unit,
                            count: models.length,
                            unit: unit
                          } )
            }

            var html = Template7.templates.energycountersTemplate({
                    list : list
                });

            $('div.energycounters', this.el).html( html );
            self.setEvents();
        }

        this.currentEnergyCounters = ECDay.length;
    }
});
