define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',
  "jimu/dijit/TabContainer3",
  "./templates/Aeo/Widget",
  "./templates/Proprietar/Widget",
  "./templates/Pocos/Widget",
  "./templates/Teste/Widget",
],
function(
  declare, 
  BaseWidget,
  TabContainer3,
  Aeo,
  Prop,
  Pocos
) {
  return declare([BaseWidget], {

    baseClass: 'p-t-bras',

    postCreate: function() {
      this.inherited(arguments);
      this._initTabs()
    },
    
    _initTabs: function() {
      var tabs = [];

      this.aeo = new Aeo({
        wabWidget: this,
        map: this.map,
        serviceUrl: this.config.aeo.serviceUrl,
        codFieldInst: this.config.aeo.codFieldInst,
        codFieldSeq: this.config.aeo.codFieldSeq,   
        outFields: this.config.aeo.outFields
      })
      tabs.push({
        title: this.nls.configTitles[0],
        content: this.aeo
      })

      this.prop = new Prop({
        wabWidget: this,
        map: this.map,
        serviceUrl: this.config.proprietar.serviceUrl,
        codFieldSeq: this.config.proprietar.codFieldSeq,
        codFieldDen: this.config.proprietar.codFieldDen,  
        codFieldProp: this.config.proprietar.codFieldProp,
        outFields: this.config.proprietar.outFields
      })
      tabs.push({
        title: this.nls.configTitles[1],
        content: this.prop
      })

      this.pocos = new Pocos({
        wabWidget: this,
        map: this.map,
        serviceUrl: this.config.pocos.serviceUrl,
        codFieldCamp: this.config.pocos.codFieldNameCamp,
        codFieldPoco: this.config.pocos.codFieldNamePoco,  
        outFields: this.config.pocos.outFields
      })
      tabs.push({
        title: this.nls.configTitles[2],
        content: this.pocos
      })

      this._tcConfig = new TabContainer3({        
        tabs: tabs,
        style: 'width:100%; height:100%;'
      }, this.tabContainer)

    },

  });

});
