function renderSceneGraph(svg, tuples) {
  var nodes = {};
  var links = [];
  tuples.forEach(function(tuple_dict, index) {
    var tuple = tuple_dict.split(",");
    if (tuple.length == 1){
      source = nodes[tuple[0]] || (nodes[tuple[0]] = {name: tuple[0], type: 'object'});
    } else if (tuple.length == 2) {
      source = nodes[tuple[0]] || (nodes[tuple[0]] = {name: tuple[0], type: 'object'});
      target = nodes[tuple[1]] || (nodes[tuple[1]] = {name: tuple[1], type: 'attribute'});
      links.push({source: source, target: target, type: 'standard'});
    } else if (tuple.length == 3) {
      source = nodes[tuple[0]] || (nodes[tuple[0]] = {name: tuple[0], type: 'object'});
      interim = nodes[tuple[1]] || (nodes[tuple[1]] = {name: tuple[1], type: 'relation'});
      target = nodes[tuple[2]] || (nodes[tuple[2]] = {name: tuple[2], type: 'object'});
      links.push({source: nodes[tuple[0]], target: nodes[tuple[1]], type: 'standard'});
      links.push({source: nodes[tuple[1]], target: nodes[tuple[2]], type: 'standard'});
    }
  });
  links.forEach(function(d) {
    d.straight = 1;
    links.forEach(function(d1) {
      if ((d.source == d1.target) && (d1.source == d.target))
        d.straight = 0;
    });
  });
  var width = svg.style("width").replace("px", ""),
      height = svg.style("height").replace("px", "");
  var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(50)
      .charge(-300)
      .on("tick", sg_tick)
      .start();
  // Per-type markers, as they don't inherit styles.
  svg.append("defs").selectAll("marker")
      .data(["standard", "standard highlighted"])
    .enter().append("marker")
      .attr("id", function(d) { return d; })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5");
  // add the links and their arrows
  var sg_path = svg.append("g").selectAll("path")
      .data(force.links())
    .enter().append("path")
      .attr("class", function(d) { return "link " + d.type; })
      .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
  // add the nodes
  var sg_node = svg.append("g").selectAll("circle")
      .data(force.nodes())
    .enter().append("circle")
      .attr("r", 6)
      .attr("class", function(d) { return "sg " + d.type; })
      .call(force.drag);
  // add the text
  var sg_text = svg.append("g").selectAll("text")
      .data(force.nodes())
    .enter().append("text")
      .attr("x", 8)
      .attr("y", ".31em")
      .text(function(d) { return d.name; });
  // Use elliptical arc path segments to doubly-encode directionality.
  function sg_tick() {
    sg_path.attr("d", linkArc);
    sg_node.attr("transform", transform);
    sg_text.attr("transform", transform);
  }
  function linkArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = (d.straight == 0)?Math.sqrt(dx * dx + dy * dy):0;
    return "M" + d.source.x + "," + d.source.y +
        "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  }
  function transform(d) {
    // Keep within bounds of svg
    var buffer = 7;
    x = Math.max(buffer, Math.min(width-buffer, d.x))
    y = Math.max(buffer, Math.min(height-buffer, d.y))
    return "translate(" + x + "," + y + ")";
  }
}
function visualizeit1(item){
  // FIRST PANEL
  // Add title
  //d3.select("#image-title")
  //  .append("h4")
  //  .attr("class","removable")
  //  .text("Image: " + item.image_id);
  // Add image
  d3.select("#ref-anns1").append("p").attr("class","removable").html(item.ref_annstrs[0].replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"));
  
  d3.select("#test-anns1").append("p").attr("class","removable").html(item.test_annstrs.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"));
  
  // reference captions
  item.ref_caps.forEach(function(caption) {
    p = d3.select("#ref-panel").append("p").attr("class","removable").text("\"" + caption + "\"");
  })
  // SECOND PANEL
  // reference sg
  var svg_ref = d3.select("#reference1")
    .append("svg")
    .attr("class","removable")
    .attr("width", "100%")
    .attr("height", 350);
  renderSceneGraph(svg_ref, item.ref_tups);
  // THIRD PANEL
  // candidate caption
  d3.select("#caption-aud").attr("src", "images/"+item_index.toString()+".wav");
  var ply = document.getElementById("player");
  ply.load()
  d3.select("#candidate-caption").text("\"" + item.test_caps + "\"");
  // candidate scene graph
  var svg_ref = d3.select("#candidate1")
    .append("svg")
    .attr("class","removable")
    .attr("width", "100%")
    .attr("height", 300);
  renderSceneGraph(svg_ref, item.test_tups);
  // candidate scores
  d3.select("#candidate-scores1").text("SPICE F-Score: " + (Math.round(item.scores.F * 1000) / 1000).toFixed(3) + ", Pr: " + (Math.round(item.scores.Pr * 1000) / 1000).toFixed(3) + ", Re: " + (Math.round(item.scores.Re * 1000) / 1000).toFixed(3));
}

function visualizeit2(item){
  // FIRST PANEL
  // Add title
  //d3.select("#image-title")
  //  .append("h4")
  //  .attr("class","removable")
  //  .text("Image: " + item.image_id);
  // Add image
  //d3.select("#caption-img").attr("src", item.flickr_url);
  d3.select("#ref-anns2").append("p").attr("class","removable").html(item.ref_annstrs[0].replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"));
  
  d3.select("#test-anns2").append("p").attr("class","removable").html(item.test_annstrs.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"));
  
  // SECOND PANEL
  // reference sg
  var svg_ref = d3.select("#reference2")
    .append("svg")
    .attr("class","removable")
    .attr("width", "100%")
    .attr("height", 350);
  renderSceneGraph(svg_ref, item.ref_tups);
  // THIRD PANEL
  // candidate scene graph
  var svg_ref = d3.select("#candidate2")
    .append("svg")
    .attr("class","removable")
    .attr("width", "100%")
    .attr("height", 300);
  renderSceneGraph(svg_ref, item.test_tups);
  // candidate scores
  d3.select("#candidate-scores2").text("SPICE+ F-Score: " + (Math.round(item.scores.F * 1000) / 1000).toFixed(3) + ", Pr: " + (Math.round(item.scores.Pr * 1000) / 1000).toFixed(3) + ", Re: " + (Math.round(item.scores.Re * 1000) / 1000).toFixed(3));
}

item_index = 0;
d3.json("images/baseline_small_spice_examples.json", function(error, json) {
  if (error) return console.warn(error);
  data1 = json;
  d3.json("images/baseline_small_spicep_examples.json", function(error, json) {
    if (error) return console.warn(error);
    data2 = json;
    step(0);
  });
});

/*Promise.all([
    d3.json("/images/baseline_small_spice_examples.json"),
    d3.json("/images/baseline_small_spicep_examples.json"),
]).then(function(data) {
    data1 = data[0];
    data2 = data[1];
    console.log(data);
    console.log(data2);
    step(0);
  });*/

/*d3.queue()
.defer(d3.json, "/images/baseline_small_spice_examples.json")
.defer(d3.json, "/images/baseline_small_spicep_examples.json")
.await(function(error, file1, file2) {
    if (error) {
        console.error('Oh dear, something went wrong: ' + error);
    }
    else {
        data1 = file1;
        data2 = file2;
        console.log(data);
        console.log(data2);
        step(0);
    }
});*/



function get_index(base_index, distance){
  base_index += distance;
  if (base_index < 0){
    base_index += data1.length;
  }
  base_index %= data1.length;
  return base_index;
}

function step(distance){
  d3.selectAll(".removable").remove()
  item_index = get_index(item_index, distance);
  visualizeit1(data1[item_index]);
  visualizeit2(data2[item_index]);
  // Preload next few images
  preload_count = 5
  for (i = -preload_count; i <= preload_count; i++) {
    if (i==0) continue;
    var next_index = get_index(item_index, i);
    var aud = new Audio();
    aud.src = "images/"+next_index.toString()+".wav";
  }
};
