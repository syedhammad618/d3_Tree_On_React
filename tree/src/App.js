import React, { Component } from "react";
import * as d3 from "d3";
import "./Tree.css";
import { data } from "./data";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
      Increase: false
    };
    this.svg = React.createRef();
    this.button = React.createRef();
  }

  componentDidMount = () => {
    const { data } = this.state;
    var { Increase } = this.state;
    console.log(Increase);

    // Set the dimensions and margins of the diagram
    var margin = { top: 70, right: 60, bottom: 20, left: 20 },
      width = 1500,
      height = 750;
    var innerwidth = width - margin.left - margin.right;
    var innerheight = height - margin.top - margin.bottom;

    var svg = d3
      .select(this.svg.current)
      .attr("width", width)
      .attr("height", height);
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#BBDEFB")
      .attr("stroke", "black");

    const g1 = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const color = d3.scaleOrdinal(["#64B5F6", "#0288D1"]);
    const Links = d3.scaleOrdinal(d3.schemeDark2);

    svg.call(
      d3
        .zoom()
        .scaleExtent([1, 50])
        .on("zoom", () => {
          g1.attr("transform", d3.event.transform);
        })
    );
    var i = 0,
      duration = 750,
      root;

    var treemap = d3.tree().size([innerwidth, innerheight]);

    root = d3.hierarchy(data[26], function(d) {
      return d.children;
    });
    root.x0 = width / 2;
    root.y0 = 0;

    // Collapse after the second level
    root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function update(source) {
      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);
      console.log(links);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) {
        d.y = d.depth * 150;
      });

      var node = g1.selectAll("g.node").data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + source.x0 + "," + source.y0 + ")";
        })
        .on("click", click);

      // nodeEnter
      //   .append("rect")
      //   .attr("dy", ".35em")
      //   .attr("x", function(d) {
      //     return d.children || d._children ? -60 : -5;
      //   })

      //   .classed("recta", true)
      //   .attr("width", d => (d.children || d._children ? 150 : 120))
      //   .attr("height", d => (d.children || d._children ? 50 : 40))

      //   .attr("y", -25)
      //   .attr("text-anchor", function(d) {
      //     return d.children || d._children ? "end" : "start";
      //   })
      //   .attr("fill", d => color(d.data.title))
      //   .attr("font-family", " sans-serif")
      //   .attr("rx", "10px")
      //   .attr("stroke", d => (d._children ? "64B5F6" : "0288D1"))
      //   .text(function(d) {
      //     return d.data.title;
      //   });
      // circleNode
      //   .append("circle")
      //   .attr("cx", 100)
      //   .attr("cy", 50)
      //   .attr("r", 5)
      //   .on("click", () => null);

      nodeEnter
        .append("rect")
        .attr("dy", ".35em")
        .attr("x", function(d) {
          return d.children || d._children ? -60 : -5;
        })

        .classed("recta", true)
        .attr("width", d => (d.children || d._children ? 150 : 120))
        .attr("height", d => (d.children || d._children ? 50 : 40))
        .attr("y", -25)

        .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
        })
        .attr("fill", d => color(d.data.title))
        .attr("font-family", " sans-serif")
        .attr("rx", "10px")
        .attr("stroke", d => (d._children ? "64B5F6" : "0288D1"))
        .text(function(d) {
          return d.data.title;
        });

      nodeEnter
        .append("text")
        .attr("dy", ".35em")
        .attr("x", function(d) {
          return d.children || d._children ? 50 : 2;
        })

        .attr("cursor", "pointer")
        .attr("y", d => (d.children || d._children ? -2 : -5))
        .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
          return d.data.title;
        })
        .classed("text", "true");

      // nodeEnter

      // const button = nodeEnter
      //   .append("rect")
      //   .attr("width", 15)
      //   .attr("height", 20)
      //   .attr("x", 100)
      //   .attr("y", -10)
      //   .attr("fill", "silver")
      //   .attr("stroke", "black");
      // button.on("mouseenter", e =>
      //   nodeEnter
      //     .append("rect")
      //     .attr("dy", ".35em")
      //     .attr("x", function(d) {
      //       return d.children || d._children ? -60 : -5;
      //     })
      //     .classed("recta", true)
      //     // .attr("width", 150)
      //     .attr("width", d => (d.children || d._children ? 150 : 120))
      //     .attr("height", d => {
      //       // console.log("width: ", nodeEnter.select(d => d.id == e.id));
      //       return d.id === e.id ? 80 : 50;
      //     })

      //     .attr("y", -25)
      //     .attr("text-anchor", function(d) {
      //       return d.children || d._children ? "end" : "start";
      //     })
      //     .attr("fill", d => color(d.data.title))
      //     .attr("font-family", " sans-serif")
      //     .attr("rx", "10px")
      //     .attr("stroke", d => (d._children ? "64B5F6" : "0288D1"))
      //     .text(function(d) {
      //       return d.data.title;
      //     })
      // );
      // button.on("mousemove", () =>
      //   nodeEnter
      //     .append("text")
      //     .attr("dy", ".35em")
      //     .attr("x", function(d) {
      //       return d.children || d._children ? 50 : 2;
      //       // return d.id === e.id ? 50 : 2;
      //     })

      //     .attr("cursor", "pointer")
      //     .attr("y", d => (d.children || d._children ? -2 : -5))
      //     .attr("text-anchor", function(d) {
      //       return d.children || d._children ? "end" : "start";
      //     })
      //     .text(function(d) {
      //       return d.data.title;
      //     })
      //     .classed("text", "true")
      // );

      // button.on("mouseleave", e => {
      //   let x = nodeEnter.selectAll("rect");
      //   console.log("Leave: ", x);
      // });
      // button.remove()
      // .append("rect")
      // .attr("dy", ".35em")
      // .attr("x", function(d) {
      //   return d.children || d._children ? -60 : -5;
      // })
      // .classed("recta", true)
      // // .attr("width", 150)
      // .attr("width", d => (d.children || d._children ? 150 : 120))
      // .attr("height", d => {
      //   // console.log("width: ", nodeEnter.select(d => d.id == e.id));
      //   return d.id === e.id ? 80 : 50;
      // })

      // .attr("y", -25)
      // .attr("text-anchor", function(d) {
      //   return d.children || d._children ? "end" : "start";
      // })
      // .attr("fill", d => color(d.data.title))
      // .attr("font-family", " sans-serif")
      // .attr("rx", "10px")
      // .attr("stroke", d => (d._children ? "64B5F6" : "0288D1"))
      // .text(function(d) {
      //   return d.data.title;
      // })

      // UPDATE

      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
          return "translate(" + source.x + "," + source.y + ")";
        })
        .remove();

      var link = g1.selectAll("path.link").data(links, function(d) {
        return d.id;
      });

      var linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")

        .attr("stroke", d => d.children)
        .attr("d", function(d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      var linkUpdate = linkEnter.merge(link);

      linkUpdate
        .transition()
        .duration(duration)
        .attr("d", function(d) {
          return diagonal(d, d.parent);
        });

      // Remove any exiting links
      var linkExit = link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Store the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {
        const path = `M ${s.x} ${s.y}
              C ${(s.x + d.x) / 2} ${s.y},
               ${(s.x + d.x) / 2} ${d.y},
                ${d.x} ${d.y}`;

        return path;
      }

      // Toggle children on click.
      function click(d) {
        //bl.ocks.org/timelyportfolio/34296462d01cc80915d1f01431723763
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
    }
  };

  render() {
    return (
      <div>
        <svg ref={this.svg}></svg>
      </div>
    );
  }
}
