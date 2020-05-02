var json_file = 'samples.json';

function getPlot(id) {d3.json(json_file).then((data)=> {
      console.log(data)

      var wfreq = data.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)
 
      var samples = data.samples.filter(s => s.id.toString() === id)[0];

      var samplevalues = samples.sample_values.slice(0, 10).reverse();
      var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
      var OTU_id = OTU_top.map(d => "OTU " + d)
      var labels = samples.otu_labels.slice(0, 10);

      var barTrace = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          marker: {
            color: '#035aa6'},
          type:"bar",
          orientation: "h",
      };

      var barData = [barTrace];

      var barLayout = {
          yaxis:{tickmode:"linear"},
          margin: {l: 110,r: 110,t: 110,b: 40}
      };

      Plotly.newPlot("bar", barData, barLayout);

      var bubbleTrace = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {size: samples.sample_values,color: samples.otu_ids},
          text: samples.otu_labels
      };

      var bubbleLayout = {
          xaxis:{title: "OTU ID"},
          height: 800,
          width: 1200,
      };

      var bubbleData = [bubbleTrace];

      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


      var guageData = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: { text:"<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
        type: "indicator",
        
        mode: "gauge",
        gauge: { axis: { range: [null, 9] },
                 steps: [
                  { range: [0, 1], color: "#fcf7bb" },
                  { range: [1, 2], color: "#eef9bf" },
                  { range: [2, 3], color: "#d8ebb5" },
                  { range: [3, 4], color: "#cbe2b0" },
                  { range: [4, 5], color: "#cdeeaa" },
                  { range: [5, 6], color: "#aacc6a" },
                  { range: [6, 7], color: "#bac7a7" },
                  { range: [7, 8], color: "#889e81" },
                  { range: [8, 9], color: "#698474" },
                ]}
        }
      ];
      var gaugeLayout = { 
          width: 700, 
          height: 700, 
          margin: { t: 30, b: 40, l:90, r:90 } 
        };
      Plotly.newPlot("gauge", guageData, gaugeLayout);
    });
};

function getInfo(id) {d3.json(json_file).then((data)=> {var metadata = data.metadata;
      var result = metadata.filter(meta => meta.id.toString() === id)[0];
      var demographicInfo = d3.select("#sample-metadata");
      demographicInfo.html("");

      Object.entries(result).forEach((key) => {demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
};

function optionChanged(id) 

{getPlot(id), getInfo(id)}

function init() {

  var dropdown = d3.select("#selDataset");

  d3.json(json_file).then((data)=> {
      console.log(data)

      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      getPlot(data.names[0]);
      getInfo(data.names[0]);
  });
};

init();