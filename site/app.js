function genPlots() {
  var filePath = "https://raw.githubusercontent.com/zaki1503/tsukuba_modelling/main/data/tsukuba_ac.csv";
  dataLoadTest(filePath, function() {
    console.log(data)
    scatter(data);
    brandbar(data);
    doorbar(data);
    world(data);
    boxplot(data);
  });
}


var data;

var dataLoadTest = function(filePath, callback) {
  d3.csv(filePath, d3.autoType).then(function(dataLoaded){
    // Convert Lap Time I, Lap Time II, and Lap Time III columns to decimal format (minutes:seconds)
    dataLoaded.forEach(d => {
      Object.keys(d).forEach(key => {
        if (key.startsWith("Lap Time")) {
          if (d[key] != null) {
            const timeArr = d[key].split(":");
            d[key] = Number(timeArr[0]) + Number(timeArr[1]) / 60;
          }
        } else if (key == "MSRP (2022 USD)") {
          if (d[key] != null) {
            d[key] = Number(d[key].replace(/[^0-9.-]+/g,""));
          }
        } else {
          d[key] = d[key];
        }
      });
    });

    data = dataLoaded;
    callback(); // Call the callback function once data is loaded
  });
}

var scatter = function(data) {
  data = data;
  
  // set the dimensions and margins of the graph
  var margin = { top: 50, right: 20, bottom: 100, left: 100 },
      width = 1000 - margin.left - margin.right,
      height = 900 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // Define the div for the tooltip
  var tooltipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain(
      d3.extent(data.filter(d => d.Year != null), function(d) {
        return +d.Year;
      })
    )
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))
    .append("text")
    .attr("class", "axis-title")
    .attr("x", width / 2)
    .attr("y", 40)
    .text("Year");

  // Add Y axis
    var y = d3
      .scaleLinear()
      .domain(
        d3.extent(
          data.filter(function(d) {
            return d["Lap Time I"] != null;
          }),
          function(d) {
            return +d["Lap Time I"];
          }
        )
      )
      .range([height, 0]);
    svg
        .append("g")
        .call(
          d3
            .axisLeft(y)
            .ticks(10)
            .tickFormat(function(d) {
              let minutes = Math.floor(d);
              let seconds = Math.round((d - minutes) * 60);
              if (seconds === 60) {
                minutes += 1;
                seconds = 0;
              }
              return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
            })
        )
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -height/2)
        .attr("dy", "1em")
        .text("Lap Time (minutes:seconds)");

  var formatTime = function(time) {
          let minutes = Math.floor(time);
          let seconds = Math.round((time - minutes) * 60 * 1000) / 1000;
          if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
          }
          return minutes + ":" + (seconds < 10 ? "0" + seconds.toFixed(3) : seconds.toFixed(3));
        };
  // Add tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    // Define color scale
    var color = d3
    .scaleLinear()
    .domain([
      d3.min(data.filter(d => d.Year != null), function(d) {
        return +d.Year;
      }),
      d3.max(data.filter(d => d.Year != null), function(d) {
        return +d.Year;
      })
    ])
    .range(["#ADD8E6", "#000080"]);

  // Add dots with color and tooltip functionality
  svg
    .append("g")
    .selectAll("dot")
    .data(data.filter(function(d) {
      return d["Lap Time I"] != null;
    }))
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return x(d.Year);
    })
    .attr("cy", function(d) {
      return y(d["Lap Time I"]);
    })
    .attr("r", 5)
    .style("fill", function(d) {
      return color(d.Year);
    })
    .style("opacity", 0.9)
    .on("mouseover", function(event, d) {
      tooltip
        .style("opacity", 1)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px")
        .html(d.Year + " " + d.Brand + " " + d.Model + ": <br>" + formatTime(d["Lap Time I"]));
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    });
};



var scatter1 = function(data) {
  data = data;
  
  // set the dimensions and margins of the graph
  var margin = { top: 50, right: 20, bottom: 100, left: 100 },
      width = 1000 - margin.left - margin.right,
      height = 900 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // Define the div for the tooltip
  var tooltipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain(
      d3.extent(data.filter(d => d.Year != null), function(d) {
        return +d.Year;
      })
    )
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))
    .append("text")
    .attr("class", "axis-title")
    .attr("x", width / 2)
    .attr("y", 40)
    .text("Year");

  // Add Y axis
    var y = d3
      .scaleLinear()
      .domain(
        d3.extent(
          data.filter(function(d) {
            return d["Lap Time I"] != null;
          }),
          function(d) {
            return +d["Lap Time I"];
          }
        )
      )
      .range([height, 0]);
    svg
        .append("g")
        .call(
          d3
            .axisLeft(y)
            .ticks(10)
            .tickFormat(function(d) {
              let minutes = Math.floor(d);
              let seconds = Math.round((d - minutes) * 60);
              if (seconds === 60) {
                minutes += 1;
                seconds = 0;
              }
              return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
            })
        )
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -height/2)
        .attr("dy", "1em")
        .text("Lap Time (minutes:seconds)");

  var formatTime = function(time) {
          let minutes = Math.floor(time);
          let seconds = Math.round((time - minutes) * 60 * 1000) / 1000;
          if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
          }
          return minutes + ":" + (seconds < 10 ? "0" + seconds.toFixed(3) : seconds.toFixed(3));
        };
  // Add tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");
  // Add dots with tooltip functionality
  svg
    .append("g")
    .selectAll("dot")
    .data(data.filter(function(d) {
      return d["Lap Time I"] != null;
    }))
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return x(d.Year);
    })
    .attr("cy", function(d) {
      return y(d["Lap Time I"]);
    })
    .attr("r", 5)
    .style("fill", "#69b3a2")
    .on("mouseover", function(event, d) {
      tooltip
        .style("opacity", 1)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px")
        .html(d.Year + " " + d.Brand + " " + d.Model + ": <br>" + formatTime(d["Lap Time I"]));
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    });
};

var brandbar1 = function(data) {
  // Filter data for rows where Lap Time I is not null
  data = data.filter(function(d) {
    return d["Lap Time I"] !== null;
  });

  // Group data by Brand and calculate median lap time for each group
  var brandGroups = d3.group(data, function(d) {
    return d.Brand;
  });
  var brandMedians = Array.from(brandGroups, function([brand, group]) {
    return { Brand: brand, MedianLapTime: d3.median(group, function(d) { return d["Lap Time I"]; }) };
  });

  // Sort data by median lap time and get top 10 brands
  brandMedians.sort(function(a, b) {
    return a.MedianLapTime - b.MedianLapTime;
  });
  var top10 = brandMedians.slice(0, 10);

  // Create tooltip div
  var tooltip = d3.select("#brandbar")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Create SVG element
  var margin = { top: 10, right: 30, bottom: 30, left: 60 };
  var width = 600 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;
  var svg = d3.select("#brandbar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create scales
  var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1)
    .domain(top10.map(function(d) { return d.Brand; }));
  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(top10, function(d) { return d.MedianLapTime; })]);

  // Add x axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add y axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add bars
  svg.selectAll(".bar")
    .data(top10)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.Brand); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.MedianLapTime); })
    .attr("height", function(d) { return height - y(d.MedianLapTime); })
    .on("mouseover", function(event, d) {
      var brandCars = brandGroups.get(d.Brand);
      var fastestCar = d3.min(brandCars, function(d) { return d["Lap Time I"]; });
      var fastestCarName = brandCars.find(function(d) { return d["Lap Time I"] === fastestCar; })["Model"];
      tooltip
        .style("opacity", 1)
        .style("left", event.pageX + 10 + "px")
  });

      // Sort the brands by median lap time
      sortedBrands.sort(function(a, b) {
        return a.median - b.median;
      });
  
      // Define the x and y scales
      var x = d3
        .scaleBand()
        .domain(sortedBrands.map(function(d) {
          return d.Brand;
        }))
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      var y = d3
        .scaleTime()
        .domain([d3.min(sortedBrands, function(d) {
          return d.median;
        }), d3.max(sortedBrands, function(d) {
          return d.median;
        })])
        .range([height - margin.bottom, margin.top]);
  
      // Add the x and y axes
      svg
        .append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
  
      svg
        .append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y).tickFormat(function(d) {
          var minutes = Math.floor(d / 60000);
          var seconds = (d % 60000) / 1000;
          return minutes + ":" + (seconds < 10 ? '0' : '') + seconds.toFixed(3);
        }));
  
      // Add the bars
      svg
        .selectAll("rect")
        .data(sortedBrands)
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return x(d.Brand);
        })
        .attr("y", function(d) {
          return y(d.median);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
          return height - margin.bottom - y(d.median);
        })
        .attr("fill", function(d) {
          return colorScale(d.median);
        })
        .on("mouseover", function(event, d) {
          tooltip
            .style("opacity", 1)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10 + "px")
            .html(d.Brand + ": <br>" + "Fastest Car: " + d.Model + " (" + d["Lap Time I"] + "), " + "Number of Cars: " + d.cars.length);
        })
        .on("mouseout", function(event, d) {
          tooltip.style("opacity", 0);
        });
    };
  
var brandbar = function(data) {
      var formatTime = function(time) {
        let minutes = Math.floor(time);
        let seconds = Math.round((time - minutes) * 60 * 1000) / 1000;
        if (seconds >= 60) {
          minutes += 1;
          seconds = 0;
        }
        return minutes + ":" + (seconds < 10 ? "0" + seconds.toFixed(3) : seconds.toFixed(3));
      };

      // Filter data for rows where Lap Time I is not null
      data = data.filter(function(d) {
        return d["Lap Time I"] !== null;
      });
    
      // Group data by Brand and calculate median lap time for each group
      var brandGroups = d3.group(data, function(d) {
        return d.Brand;
      });
      var brandMedians = Array.from(brandGroups, function([brand, group]) {
        return { Brand: brand, MedianLapTime: d3.median(group, function(d) { return d["Lap Time I"]; }) };
      });
    
      // Sort data by median lap time and get top 10 brands
      brandMedians.sort(function(a, b) {
        return a.MedianLapTime - b.MedianLapTime;
      });
      var top10 = brandMedians.slice(0, 10);
      
      // Sort data by median lap time
      var sortedBrands = brandMedians.slice().sort(function(a, b) {
        return a.MedianLapTime - b.MedianLapTime;
      });
    
      // Create tooltip div
      var tooltip = d3.select("#brandbar")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
      // Create SVG element
      var margin = { top: 40, right: 40, bottom: 140, left: 100 };
      var width = 1000 - margin.left - margin.right;
      var height = 600 - margin.top - margin.bottom;
      var svg = d3.select("#brandbar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
      // Define the color scale
      var colors = d3.scaleSequential()
          .domain([d3.min(top10, d => d.MedianLapTime), d3.max(top10, d => d.MedianLapTime)])
          .interpolator(d3.interpolateBlues);

      // Create an array of colors for each bar based on its MedianLapTime value
      var colorArray = top10.map(d => colors(d.MedianLapTime));

      // Create scales
      var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(top10.map(function(d) { return d.Brand; }));
      var y = d3.scaleLinear()
        .range([height, 0])
        .domain([5/6, d3.max(top10, function(d) {return d.MedianLapTime; })]);
    
      // Add x axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
      // Add y axis
      svg.append("g")
        .call(d3.axisLeft(y).tickFormat(formatTime));
      console.log(top10)
      // Add the bars
      svg
        .selectAll("rect")
        .data(top10)
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return x(d.Brand);
        })
        .attr("y", function(d) {
          return y(d.MedianLapTime);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
          return height - y(d.MedianLapTime);
        })
        .attr("fill", function(d) {
          return colors(d.MedianLapTime);
        })
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("stroke", "black")
            .attr("stroke-width", 6);
          tooltip
            .style("opacity", 1)
            .html("<b>Brand:</b> " + d.Brand + "<br>" +
                  "<b>Median Lap Time:</b> " + formatTime(d.MedianLapTime))
            .style("left", event.pageX-175 + "px")
            .style("top", (event.pageY-100) + "px");
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
          tooltip.style("opacity", 0);
        });

        // Add x axis title
        svg.append("text")
        .attr("transform", "translate(" + (width/2) + "," + (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("Brand");

        // Add y axis title
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Median Lap Time");
        }

var doorbar = function(data) {
          // set up dimensions for the chart
          var margin = {top: 50, right: 50, bottom: 50, left: 50};
          var width = 1000 - margin.left - margin.right;
          var height = 600 - margin.top - margin.bottom;
        
          // create svg element
          var svg = d3.select("#doorbarplot")
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
          // filter data to only include rows with all necessary data
          var filteredData = data.filter(function(d) {
            return (d.DR != null && d["Lap Time I"] != null && d.Layout != null);
          });
        
          // create arrays of the unique layouts and door counts
          var layouts = ["FF", "FR", "F4", "MR", "M4", "RR", "R4"];
          var doorCounts = [2, "2+"];
        
          // create an array of objects for each layout/door count combination
          var layoutDoorCountData = [];
          for (var i = 0; i < layouts.length; i++) {
            for (var j = 0; j < doorCounts.length; j++) {
              layoutDoorCountData.push({
                layout: layouts[i],
                doorCount: doorCounts[j],
                lapTimes: filteredData.filter(function(d) {
                  return (d.Layout == layouts[i] && d.DR == doorCounts[j]);
                }).map(function(d) {
                  return +d["Lap Time I"];
                })
              });
            }
          }
        
          // set up scales and axis
        var xScale = d3.scaleBand()
          .domain(layouts)
          .range([0, width])
          .padding(0.2) // space between the bars within a group
          .paddingOuter(0.2); // space between the groups

        var yScale = d3.scaleLinear()
          .domain([0, d3.max(layoutDoorCountData, function(d) { return d3.max(d.lapTimes); })])
          .range([height, 0])
          .nice();

        
          var colorScale = d3.scaleOrdinal()
            .domain(["2-door", "2+ doors"])
            .range(["darkred", "darkblue"]);
        
          var xAxis = d3.axisBottom(xScale);
          var yAxis = d3.axisLeft(yScale);
        
          svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "axis-title")
            .attr("x", width / 2)
            .attr("y", 40)
            .style("text-anchor", "middle")
            .text("Layout");
        
          svg.append("g")
            .call(yAxis)
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -50)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Median Lap Time");
         
          // add legend
          var legend = svg.selectAll(".legend")
            .data(colorScale.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale);

          legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

          // add bars
          var groups = svg.selectAll("g.layout-door-count")
            .data(layoutDoorCountData)
            .enter().append("g")
            .attr("class", "layout-door-count")
            .attr("transform", function(d) { return "translate(" + xScale(d.layout) + ",0)"; });

          groups.selectAll("rect")
            .data(function(d) { return d.lapTimes; })
            .enter().append("rect")
            .attr("class", function(d, i) { return (i === 0) ? "bar bar-2-door" : "bar bar-2plus-door"; })
            .attr("x", function(d, i) { return (i === 0) ? -8 : 0; })
            .attr("y", function(d) { return yScale(d); })
            .attr("width", function(d) { return 16; })
            .attr("height", function(d) { return height - yScale(d); })
            .style("fill", function(d, i) { return colorScale((i === 0) ? "2-door" : "2+ doors"); })
            .style("opacity", 0.7);
};

var world = function(data) {
  // Clean up the country names in the data
  data.forEach(function(d) {
    d.Country = d.Country.replace(/\s*\(.*?\)\s*/g, '');
  });

  // Create an object to store the frequency of each country
  var frequency = {};

  data.forEach(function(d) {
    var country = d.Country;
    if (country in frequency) {
      frequency[country]++;
    } else {
      frequency[country] = 1;
    }
  });

  // Get the maximum frequency
  var maxFrequency = d3.max(Object.values(frequency));

  // Create a logarithmic scale for the frequency
  var scale = d3.scaleLog()
    .domain([1, maxFrequency])
    .range([0, 1]);

  // set up dimensions for the chart
  var margin = {top: 50, right: 50, bottom: 50, left: 50};
  var width = 1000 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  // Create the choropleth map
  var svg = d3.select("#choropleth").append("svg")
      .attr("width", width)
      .attr("height", height);

  var projection = d3.geoMercator()
      .scale(130)
      .translate([width / 2, height / 1.5]);

  var path = d3.geoPath()
      .projection(projection);

  d3.json("data/world.json").then(function(world) {
    svg.selectAll("path")
        .data(world.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
          var country = d.properties.name;
          if (country in frequency) {
            return d3.interpolateBlues(scale(frequency[country]));
          } else {
            return "#ccc";
          }
        });
        
      // Define the color scale
      var legendWidth = 600;
      var legendHeight = 40;
      var colorScale = d3.scaleSequential(d3.interpolateBlues)
          .domain([0, 400]);

      // Define the legend axis
      var legendScale = d3.scaleLinear()
          .domain([0, 400])
          .range([0, legendWidth]);

      var legendAxis = d3.axisBottom()
          .scale(legendScale)
          .ticks(5);

      // Create the legend group
      var legend = svg.append("g")
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - margin.right - legendWidth) + "," + (height - margin.bottom - legendHeight) + ")");

      // Create the legend line
      legend.append("line")
          .attr("x1", 0)
          .attr("y1", legendHeight / 2)
          .attr("x2", legendWidth)
          .attr("y2", legendHeight / 2)
          .style("stroke", "url(#gradient)");

      // Create the legend title
      legend.append("text")
          .attr("x", 0)
          .attr("y", -10)
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text("Frequency");

      // Create the gradient
      var defs = svg.append("defs");

      var gradient = defs.append("linearGradient")
          .attr("id", "gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");

      gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#ccc");

      gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", colorScale(1));

      // Append the legend axis
      legend.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + (legendHeight / 2) + ")")
          .call(legendAxis);


          });
        };

        var boxplot = function(data) {
          
          data = data.filter(function(d) {
            return (d["MSRP (2022 USD)"] != null && d["Lap Time I"] != null);
          });

          console.log(data)
          // Set the dimensions and margins of the plot
          var margin = {top: 30, right: 50, bottom: 70, left: 50},
              width = 700 - margin.left - margin.right,
              height = 400 - margin.top - margin.bottom;
        
          // Append the svg object to the div with id "boxplot"
          var svg = d3.select("#boxplot")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
        
          // Convert Lap Time I and MSRP (2022 USD) to numeric format
          data.forEach(function(d) {
            d["Lap Time I"] = +d["Lap Time I"];
            d["MSRP (2022 USD)"] = +d["MSRP (2022 USD)"];
          });
        
          // Define the x and y scales
          var x = d3.scaleLog()
            .base(10)
            .range([0, width])
            .domain(d3.extent(data, function(d) { return d["MSRP (2022 USD)"]; }));
        
          var y = d3.scaleLinear()
            .range([height, 0])
            .domain(d3.extent(data, function(d) { return d["Lap Time I"]; }));
        
          // Define the box plot variables
          var boxWidth = 50;
          var boxPadding = 10;
          var numBins = 10;
          var binSize = d3.max(data, function(d) { return d["MSRP (2022 USD)"]; }) / numBins;
          var binStart = 0;
          var boxData = [];
        
          // Compute the box plot data
          for (var i = 0; i < numBins; i++) {
            var binEnd = binStart + binSize;
            var binData = data.filter(function(d) {
              return d["MSRP (2022 USD)"] >= binStart && d["MSRP (2022 USD)"] < binEnd;
            });
            if (binData.length > 0) {
              var binMedian = d3.median(binData, function(d) { return d["Lap Time I"]; });
              var binQ1 = d3.quantile(binData, 0.25, function(d) { return d["Lap Time I"]; });
              var binQ3 = d3.quantile(binData, 0.75, function(d) { return d["Lap Time I"]; });
              var binIQR = binQ3 - binQ1;
              var binMin = d3.min(binData, function(d) { return d["Lap Time I"]; });
              var binMax = d3.max(binData, function(d) { return d["Lap Time I"]; });
              boxData.push({
                bin: i,
                binStart: binStart,
                binEnd: binEnd,
                binMedian: binMedian,
                binQ1: binQ1,
                binQ3: binQ3,
                binIQR: binIQR,
                binMin: binMin,
                binMax: binMax
              });
            }
            binStart += binSize;
          }
            // Create group for x-axis labels
    const xLabels = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % 2 === 0)))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // Create group for y-axis labels
    const yLabels = svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(10, "s"));

    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("MSRP (2022 USD)");

    // Add x-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .style("text-anchor", "middle")
      .text("MSRP Category");

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Boxplot of MSRP and Lap Time I Variance by MSRP Category");

    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, ${margin.top})`)
      .selectAll("g")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("font-size", "12px")
      .text((d) => d);
  }

    