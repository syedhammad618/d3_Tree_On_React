// import React, { Component } from "react";
// import * as d3 from "d3";
// import "./Tree.css";
// import { data } from "./data";

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data
//     };
//     this.svg = React.createRef();
//   }
//   componentDidMount() {
//     const data = this.state.data;

//     // Set the dimensions and margins of the diagram
//     var margin = { top: 20, right: 20, bottom: 30, left: 90 },
//       width = 960,
//       height = 500;
//     var innerwidth = width - margin.left - margin.right;
//     var innerheight = height - margin.top - margin.bottom;

//     var svg = d3
//       .select(this.svg.current)
//       .attr("width", width)
//       .attr("height", height);
//     svg
//       .append("rect")
//       .attr("width", width)
//       .attr("height", height)
//       .attr("fill", "#BDBDBD")
//       .attr("stroke", "black")
//       .attr("stroke-width", "2px");

//     const g1 = svg
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     const color = d3.scaleOrdinal(["#64B5F6", "#0288D1"]);

//     svg.call(
//       d3
//         .zoom()
//         .scaleExtent([1, 50])
//         .on("zoom", () => {
//           g1.attr("transform", d3.event.transform);
//         })
//     );
//     var i = 0,
//       duration = 750,
//       root;

//     var treemap = d3.tree().size([innerheight, innerwidth]);

//     root = d3.hierarchy(data[26], function(d) {
//       return d.children;
//     });
//     root.y0 = height / 2;
//     root.x0 = 0;

//     // Collapse after the second level
//     root.children.forEach(collapse);

//     update(root);

//     // Collapse the node and all it's children
//     function collapse(d) {
//       if (d.children) {
//         d._children = d.children;
//         d._children.forEach(collapse);
//         d.children = null;
//       }
//     }

//     function update(source) {
//       // Assigns the x and y position for the nodes
//       var treeData = treemap(root);

//       // Compute the new tree layout.
//       var nodes = treeData.descendants(),
//         links = treeData.descendants().slice(1);

//       // Normalize for fixed-depth.
//       nodes.forEach(function(d) {
//         d.y = d.depth * 180;
//       });

//       var node = g1.selectAll("g.node").data(nodes, function(d) {
//         return d.id || (d.id = ++i);
//       });

//       // Enter any new modes at the parent's previous position.
//       var nodeEnter = node
//         .enter()
//         .append("g")
//         .attr("class", "node")
//         .attr("transform", function(d) {
//           return "translate(" + source.y0 + "," + source.x0 + ")";
//         })
//         .on("click", click);

//       // Add Circle for the nodes
//       // nodeEnter
//       //   .append("circle")
//       //   .attr("class", "node")
//       //   .attr("r", 1e-6)
//       //   .style("fill", function(d) {
//       //     return d._children ? "lightsteelblue" : "#fff";
//       //   });

//       // Add labels for the nodes

//       nodeEnter
//         .append("rect")
//         .attr("dy", ".35em")
//         .attr("x", function(d) {
//           return d.children || d._children ? -50 : -5;
//         })
//         .classed("recta", true)
//         .attr("width", d => (d.children || d._children ? 110 : 120))
//         .attr("height", d => (d.children || d._children ? 50 : 40))
//         .attr("y", -25)
//         .attr("text-anchor", function(d) {
//           return d.children || d._children ? "end" : "start";
//         })
//         // .style("fill", function(d) {
//         //   return d._children ? "64B5F6" : "0288D1";
//         // })
//         .attr("fill", d => color(d.data.title))
//         .attr("font-family", " sans-serif")
//         .attr("rx", "10px")
//         .attr("stroke", d => (d._children ? "64B5F6" : "0288D1"))
//         .text(function(d) {
//           return d.data.title;
//         });

//       nodeEnter
//         .append("text")
//         .attr("dy", ".35em")
//         .attr("x", function(d) {
//           return d.children || d._children ? 48 : 2;
//         })
//         .attr("cursor", "pointer")
//         .attr("y", d => (d.children || d._children ? -1 : -5))
//         .attr("text-anchor", function(d) {
//           return d.children || d._children ? "end" : "start";
//         })
//         .text(function(d) {
//           return d.data.title;
//         })
//         .classed("text", "true");

//       // UPDATE
//       var nodeUpdate = nodeEnter.merge(node);

//       // Transition to the proper position for the node
//       nodeUpdate
//         .transition()
//         .duration(duration)
//         .attr("transform", function(d) {
//           return "translate(" + d.y + "," + d.x + ")";
//         });

//       // Update the node attributes and style
//       nodeUpdate
//         .select("circle.node")
//         .attr("r", 10)
//         .style("fill", function(d) {
//           return d._children ? "lightsteelblue" : "#fff";
//         })
//         .attr("cursor", "pointer");

//       // Remove any exiting nodes
//       var nodeExit = node
//         .exit()
//         .transition()
//         .duration(duration)
//         .attr("transform", function(d) {
//           return "translate(" + source.y + "," + source.x + ")";
//         })
//         .remove();

//       var link = g1.selectAll("path.link").data(links, function(d) {
//         return d.id;
//       });

//       var linkEnter = link
//         .enter()
//         .insert("path", "g")
//         .attr("class", "link")
//         .attr("stroke", d => d.children)
//         .attr("d", function(d) {
//           var o = { x: source.x0, y: source.y0 };
//           return diagonal(o, o);
//         });

//       var linkUpdate = linkEnter.merge(link);

//       linkUpdate
//         .transition()
//         .duration(duration)
//         .attr("d", function(d) {
//           return diagonal(d, d.parent);
//         });

//       // Remove any exiting links
//       var linkExit = link
//         .exit()
//         .transition()
//         .duration(duration)
//         .attr("d", function(d) {
//           var o = { x: source.y, y: source.x };
//           return diagonal(o, o);
//         })
//         .remove();

//       // Store the old positions for transition.
//       nodes.forEach(function(d) {
//         d.x0 = d.x;
//         d.y0 = d.y;
//       });

//       // Creates a curved (diagonal) path from parent to the child nodes
//       function diagonal(s, d) {
//         const path = `M ${s.y} ${s.x}
//             C ${(s.y + d.y) / 2} ${s.x},
//               ${(s.y + d.y) / 2} ${d.x},
//               ${d.y} ${d.x}`;

//         return path;
//       }

//       // Toggle children on click.
//       function click(d) {
//         if (d.children) {
//           d._children = d.children;
//           d.children = null;
//         } else {
//           d.children = d._children;
//           d._children = null;
//         }
//         update(d);
//       }
//     }
//   }
//   render() {
//     return <svg ref={this.svg}></svg>;
//   }
// }
