var slider_time = ["Pro_CN_T1", "Prop_CN_T2", "Prop_CN_T3", "Prop_CN_T4", "Prop_CN_T5"];

var slider_year = ["1976", "1997", "2003", "2007", "2011"];

var valueData;

var statesLayer;

//document.getElementsByClassName('leaflet-control-command-interior').disabled = true;

var ourCustomControl = L.Control.extend({

  options: {
    position: 'topleft'
    //background-image: url("img/chart-delete.png")
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },

      onAdd: function (map) {
          var container = L.DomUtil.create('div', 'leaflet-control-command-interior');

          L.DomEvent
           .addListener(container, 'click', L.DomEvent.stopPropagation)
           .addListener(container, 'click', L.DomEvent.preventDefault)
           .addListener(container, 'click', function () {

           var svg = d3.select('#chart')
               .selectAll('svg')
               .attr("width", 0)
               .attr("height", 0);

            var x = document.getElementById('chart');
             x.style.WebkitBackfaceVisibility = "hidden";
             x.style.height = "0px";
             x.style.width = "0px";
       });

          var controlUI = L.DomUtil.create('a', 'leaflet-draw-edit-remove', container);
            controlUI.title = 'Remove All Polygons';
            controlUI.href = '#';
            return container;

        }

});

var essai = d3.slider()
            .scale(d3.scale.ordinal().domain(slider_time)
            .rangePoints([0, 1], 0.5))

            .axis(d3.svg.axis().tickFormat(function(d, i){

                return slider_year[i]
            }))


            .snap(true).value(slider_time[0])
            d3.select('#slider').call(essai);


var sobreposiciones = new L.LayerGroup();


var popup = new L.Popup({ autoPan: false });

var southWest = L.latLng(12, -90),
    northEast = L.latLng(21.5, -110),
    bounds = L.latLngBounds(southWest, northEast);

    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
   				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
   				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
   			mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';

   	    var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
   		    streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

var map = L.map('map', {
    center: [17, -97],
    zoom: 7,
    maxBounds: bounds,
    maxZoom: 19,
    minZoom: 7,
    layers: [sobreposiciones]
});



// GEOWEBCACHE DE GEONODE Adesur
Gwcl = L.tileLayer.wms("http://ide.adesur.centrogeo.org.mx/geoserver/gwc/service/wms", {
    layers: 'geonode:manchasurbanas_adsur',
    format: 'image/png',
    transparent: true,
    attribution: "CG"
});

ca1976_1993 = L.tileLayer.wms("http://ide.adesur.centrogeo.org.mx/geoserver/gwc/service/wms", {
    layers: 'geonode:cont_agri_12',
    format: 'image/png',
    transparent: true,
    attribution: "CG"
});

ca1993_2002 = L.tileLayer.wms("http://ide.adesur.centrogeo.org.mx/geoserver/gwc/service/wms", {
    layers: 'geonode:cont_agri_23',
    format: 'image/png',
    transparent: true,
    attribution: "CG"
});

ca2002_2007 = L.tileLayer.wms("http://ide.adesur.centrogeo.org.mx/geoserver/gwc/service/wms", {
    layers: 'geonode:cont_agri_34',
    format: 'image/png',
    transparent: true,
    attribution: "CG"
});

ca2007_2011 = L.tileLayer.wms("http://ide.adesur.centrogeo.org.mx/geoserver/gwc/service/wms", {
    layers: 'geonode:cont_agri_45',
    format: 'image/png',
    transparent: true,
    attribution: "CG"
});


var layer = L.esri.basemapLayer('ShadedRelief').addTo(map);

var layerLabels;

 function setBasemap(basemap) {
   if (layer) {
     map.removeLayer(layer);
   }
   layer = L.esri.basemapLayer(basemap);
   map.addLayer(layer);
   if (layerLabels) {
     map.removeLayer(layerLabels);
   }

   if (basemap === 'ShadedRelief' || basemap === 'Oceans' || basemap === 'Gray' || basemap === 'DarkGray' || basemap === 'Imagery' || basemap === 'Terrain') {

     layerLabels = L.esri.basemapLayer(basemap + 'Labels');
     map.addLayer(layerLabels);
   }
 }

 var basemaps = document.getElementById('basemaps');


 basemaps.addEventListener('change', function() {
   setBasemap(basemaps.value);
 });




function getStyle(feature) {
    return  {
        weight: .7,
        opacity: 1,
        color: 'gray',
        dashArray: '',
        fillOpacity: 0.5,

        fillColor: getColor(feature.properties.Pro_CN_T1)
    };

}


statesLayer = L.geoJson(cn_json,  {
    style: getStyle,
    onEachFeature: onEachFeature,

}).addTo(map).bringToBack();

/*##########################[BUTTON PLAY]###########################################*/

essai.on("slide",
              function(evt, value) {
                 d3.select('#position').text(value);
                 valueData = value;
                 statesLayer = L.geoJson(cn_json,  {
                     style: getStyle,
                     onEachFeature: onEachFeature
                 })

                 .addTo(map);
                 function getStyle(feature) {
                     return  {
                         weight: .7,
                         opacity: .6,
                         color: 'gray',
                         dashArray: '',
                         fillOpacity: 0.5,
                         fillColor: getColor(feature.properties[valueData])
                     };
                   }
             });

var baseLayers = {
     "Esri": basemaps,
     "Capital Natural": statesLayer
     };

var overlays = {
   "Zonas Urbanas": Gwcl,
   "Contracción Agrícola 1976-1993": ca1976_1993,
   "Contracción Agrícola 1993-2002": ca1993_2002,
   "Contracción Agrícola 2002-2007": ca2002_2007,
   "Contracción Agrícola 2007-2011": ca2007_2011
        };

L.control.layers(baseLayers, overlays).addTo(map);

//L.control.layers(baseLayers, overlays,{collapsed:false, autoZIndex:true}).addTo(map);
//statesLayer.bringToBack();
//Gwcl.bringToFront();

  // get color depending on population density value
  function getColor(d) {
        return d >  1 ? '#006d2c' :
               d > .75 ? '#2ca25f' :
               d > .50   ? '#66c2a4' :
               d > .25   ? '#b2e2e2' :
               d > .0  ? '#edf8fb' :
                      '#fff';
    }

  function onEachFeature(feature, layer) {
      layer.on({
          mousemove: mousemove,
          mouseout: mouseout,
          click: zoomToFeature
      });
  }

  var closeTooltip;

  function mousemove(e) {
      var layer = e.target;

      if (valueData == null) {

        popup.setLatLng(e.latlng);
        popup.setContent('<div class="marker-title">' + layer.feature.properties.NOM_MUN + '</div>' +
            (layer.feature.properties.Pro_CN_T1 * 100).toFixed(2) + ' % ');
      }

      else {

        popup.setLatLng(e.latlng);
        popup.setContent('<div class="marker-title">' + layer.feature.properties.NOM_MUN + '</div>' +
            (layer.feature.properties[valueData] * 100).toFixed(2) + ' % ' );
      }

      if (!popup._map) popup.openOn(map);
      window.clearTimeout(closeTooltip);

      // highlight feature
      layer.setStyle({
          weight: 3,
          opacity: 0.3,
          fillOpacity: 0.9
      });

      if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }

  }

  function mouseout(e) {
      statesLayer.resetStyle(e.target);
      closeTooltip = window.setTimeout(function() {
      }, 100);
  }

    map.addControl(new ourCustomControl());

 function zoomToFeature(e) {

      var layer = e.target;

      // map.fitBounds(e.target.getBounds());

      var nom_num = layer.feature.properties.NOM_MUN;
      // console.log(nom_num);

      var time_municipio = [];

      for(i =0; i <5; i++) {
        time_municipio[i] = ((layer.feature.properties[slider_time[i]]).toFixed(2));
      }
      // console.log(time_municipio);



      var width = 300, height = 300;
      var margin = {top: 20, right: 25, bottom: 30, left: 50};

        // data
        var data = [
                    {"x":"1976","y":time_municipio[0]},
                    {"x":"1997","y": time_municipio[1]},
                    {"x":"2003","y": time_municipio[2]},
                    {"x":"2007","y":time_municipio[3]},
                    {"x":"2011","y":time_municipio[4]}
                  ];

        var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                        return "<strong>Capital Natural:</strong> <span style='color:white'>" + d.y * 100 + '%' +  "</span>";
                  })

        var x = document.getElementById('bar');
               x.style.width = "420px";
               x.style.height = "350px";
             	x.style.backgroundColor = "#FAFAFA";


    if (d3.selectAll("#bar svg")[0].length == 0) {

        // x and y Scales
        var xScale = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var yScale = d3.scale.linear()
            .range([height, 0]);

        xScale.domain(data.map(function(d) { return d.x; }));

        yScale.domain([0, d3.max(data, function(d) { return d.y; })]);

        // x and y Axes
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10, "%");

      // create svg container
      var svg = d3.select("#bar")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.call(tip);

      // create bars
      var sld = svg.selectAll(".bar")
          .data(data)
          sld.enter()
          .append("rect")
          sld.attr("class", "bar")
          .attr("x", function(d) { return xScale(d.x); })
          .attr("width", xScale.rangeBand())
          .attr("y", function(d) { return yScale(d.y); })
          .attr("height", function(d) { return height - yScale(d.y); });
          sld.on('mouseover', tip.show)
          sld.on('mouseout', tip.hide)
          sld.exit().remove();

      // drawing the x axis on svg
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("dx", ".71em")
          .style("text-anchor", "end")
          .text("Años");


      // drawing the y axis on svg
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Porcentaje");
    }
    else  {
        svg = d3.select("#bar svg")
              .remove();

        // x and y Scales
        var xScale = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var yScale = d3.scale.linear()
            .range([height, 0]);

        xScale.domain(data.map(function(d) { return d.x; }));

        yScale.domain([0, d3.max(data, function(d) { return d.y; })]);

        // x and y Axes
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10, "%");

      // create svg container
      var svg = d3.select("#bar")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

      // create bars
      var sld = svg.selectAll(".bar")
          .data(data)
          sld.enter()
          .append("rect")
          sld.attr("class", "bar")
          .transition()
          .duration(3000)
          .attr("x", function(d) { return xScale(d.x); })
          .attr("width", xScale.rangeBand())
          .attr("y", function(d) { return yScale(d.y); })
          .attr("height", function(d) { return height - yScale(d.y); });
          sld.on('mouseover', tip.show)
          sld.on('mouseout', tip.hide)
          sld.exit().remove();

      // drawing the x axis on svg
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("dx", ".71em")
          .style("text-anchor", "end")
          .text("Años");


      // drawing the y axis on svg
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Porcentaje");
    }
  }

  var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [ ".0",".25", ".50", ".75", "1"],
            labels = ["% Capital  Natutal"],
            from, to;

        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from  * 100 + (to  ? '&ndash;' + to * 100 : ''));
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);
