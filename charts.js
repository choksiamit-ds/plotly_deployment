
///////
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    //console.log(firstSample)
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    console.log(data);

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples

    // 4. Create a variable that filters the samples for the object with the desired sample number.   
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray)

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0]
    console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids
    var otu_labels = result.otu_labels
    var sample_values = result.sample_values


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.sort((a,b) => b-a).slice(0, 10);
   
    console.log(sample_values)
    console.log(yticks)
    console.log(otu_labels)

    // 8. Create the trace for the bar chart. 
    var barData = [ {
      x: sample_values,
      y: yticks,
      text: otu_labels,
      textposition: 'auto',
      orientation: 'h',
      marker: {
        color: 'rgb(158,202,225)',
        opacity: 0.4,
        line: {
          color: 'rgb(8,48,107)',
          width: 1.5
        }
      },

   //   name: "Greek",
      type: "bar",
      
      
    }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found"  ,
        yaxis: {
          zeroline: false,
          gridwidth: 2
        },
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout);

// The otu_ids as the x-axis values.
// The sample_values as the y-axis values.
// The sample_values as the marker size.
// The otu_ids as the marker colors.
// The otu_labels as the hover-text values.


    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        orientation: 'h',
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values,
          //setting 'sizeref' to lower than 1 decreases the rendered size
          sizeref: 0.1,
          sizemode: 'area'
        }
      }
   
    ];

    // To create the layout for the bubble chart, add a title, a label for 
    // the x-axis, margins, and the hovermode property. The hovermode should show the text 
    // of the bubble on the chart when you hover near that bubble.

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      height: 600,
      width: 600,
      xaxis: {
        title: {
          text: 'OTU ID',
          
        },
      },
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


//     Assign the variable created in Step 3 to the value property.
//// The type property should be "indicator".
//// The mode property should be "gauge+number".
// For the title object, assign the title as a string using HTML syntax to the text property.
// For maximum range for the gauge should be 10.
// Set the bar color of the gauge to black or a dark color to contrast against the range colors.
// Assign different colors as string values in increments of 2 for the steps object.
//  The colors can be named colors as in the Matplotlib colors

  var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result)
    console.log(result["wfreq"])

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0,1], y: [0,1] },
        value: result["wfreq"],
        title: { text: "Gauge Chart" },
        type: "indicator",
        mode: "gauge+number",
        guage: { 
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ]
      },
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 500, 
      margin: { 
                t: 0, 
                b: 0 
              }
    };

    
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

    
  });
}
