define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./Widget.html",
  "esri/dijit/Search",
  "esri/layers/FeatureLayer",
  "dojo/on", 
  "dojo/_base/lang",
  'dojo/Deferred',
  'dgrid/OnDemandList',
  'dgrid/Selection',
  "dojo/store/Memory",
  "jimu/utils",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/Color",
  "esri/graphic", 
  'dojo/_base/html',
], function(
  declare,
  _WidgetBase,
  _TemplatedMixin,
  template,
  Search,
  FeatureLayer,
  on,
  lang,
  Deferred,
  OnDemandList, 
  Selection, 
  Memory,
  utils,
  SimpleMarkerSymbol,
  Color,
  Graphic,
  html,
){
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

    wabWidget: null,
    serviceUrl: null,
    codFieldCamp: null,
    codFieldPoco: null,
    outFields: [],
    map: null,

    startup: function() {
      this.inherited(arguments)

      this.search = new Search({
        enableButtonMode: false, 
        showInfoWindowOnSelect: false,
        theme: 'arcgisSearch',
        sources: []
      });
      html.place(this.search.domNode, this.searchOne);
      this.search.startup();

      var sources = this.search.get("sources");
      
      sources.push({        
        featureLayer: new FeatureLayer(this.params.serviceUrl),  
        searchFields: [this.params.codFieldCamp],  
        displayField: this.params.codFieldCamp,  
        exactMatch: false,  
        outFields: [this.params.outFields],  
        maxResults: 6,  
        maxSuggestions: 6,  
        enableSuggestions: true,  
        minCharacters: 1,  
      });
      sources.push({        
        featureLayer: new FeatureLayer(this.params.serviceUrl),  
        searchFields: [this.params.codFieldPoco],  
        displayField: this.params.codFieldPoco,  
        exactMatch: false,  
        outFields: [this.params.outFields],  
        maxResults: 6,  
        maxSuggestions: 6,  
        enableSuggestions: true,  
        minCharacters: 1,  
      });

      this.search.set("sources", sources);

      this.own(on(this.search,'select-result', lang.hitch(this, function(e) {
          this.createList(e)
          this.zoomToFeatures(e.result.feature)
      })));
    },

    _getDataStore: function(e) {
      var def = new Deferred();

      var featureSetRemapped = [];

      var items = e.result.feature.attributes
      var keys = Object.keys(items);

      keys.forEach((key, index) => {
        featureSetRemapped.push(`<strong>${key}:</strong> <p>${items[key]}</p>`)
      });
           
        def.resolve(new Memory({
          data: featureSetRemapped
        })
      );
      return def;
    },
  
    createList: function(e) {      
      this._getDataStore(e).then(lang.hitch(this, function(datastore) {
        var list = new (declare([OnDemandList, Selection]))({
          'store': datastore,
          'selectionMode': 'none',
          'renderRow': lang.hitch(this, function (object, options) {
            return this._createListItem(object);
          })
        }, this.listNode);
        list.startup();
      }))
    },

    _createListItem: function(featureObj) {
      var listItemRoot = document.createElement('DIV');
      listItemRoot.className = 'list-item';
      if(featureObj) {
            propSeq = document.createElement('div');
            propSeq.className = 'div-item';
            propSeq.innerHTML = featureObj;
            listItemRoot.appendChild(propSeq);

      } else {
        listItemRoot.innerHTML = 'NO DATA AVAILABLE';
      }
      return listItemRoot;
    },

    zoomToFeatures(features) {
      var featureSet = utils.toFeatureSet(features)
      utils.zoomToFeatureSet(this.map, featureSet)
      .then(
        lang.hitch(this, function () {
          this._addGeometryToMapGraphics(featureSet);
        })
      )         
    },
        
    _addGeometryToMapGraphics: function (geometry) {
      var geometry = geometry.features[0].geometry
      var markerSymbol = new SimpleMarkerSymbol();
      markerSymbol.setWidth(3);
      markerSymbol.setColor(new Color("#ffeb3b"));

      var graphic = new Graphic(geometry, markerSymbol);
      this.map.graphics.add(graphic);
      this._graphics[graphicType] = graphic;
    },

  })
})