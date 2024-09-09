var width = 1600,
    height = 1600,
    box_width = 200,
    box_height = 30,
    box_heights = [40, 20, 40, 20],
    box_gap = {
        width: 150,
        height: 2
    },
    margin = {
        top: 100,
        right: 16,
        bottom: 16,
        left: 16
    },
    svg;


var data = {
    "nodes": [],
    "links": []
};
fetchDatafromServer();
//get data from server.js
async function  fetchDatafromServer()
{
    try{
        const response = await fetch('http://localhost:3000/get-data');
        if(!response.ok){
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data1 = await response.json();
       // console.log("Data from server:",data1);
        data.nodes = data1.nodes;
        data.links = data1.links;
       // console.log("Data stored before diagram", data);
        create_relationship_diagram(data);
    }catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Fetch both JSON files using Promise.all to handle them together
// Promise.all([
//     fetch('./nodes.json').then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json();
//     }),
//     fetch('./links.json').then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json();
//     })
// ])
//     .then(results => {
//
//         for (var i = 0; i < results[0].length; i++) {
//             data.nodes.push(results[0][i]);
//         }
//         for (var i = 0; i < results[1].length; i++) {
//             data.links.push(results[1][i]);
//         }
//
//         console.log("Nodes:", data);
//         create_relationship_diagram(data);
//         // Your logic here using nodes and links
//         // For example, looping through nodes and links to perform operations
//     })
//     .catch(error => {
//         // Handle any errors that occur during the fetch
//         console.error('There has been a problem with your fetch operation:', error);
//     });

var nodes = [];
var links = [];
var lvlCount = 0;


var link = d3.linkHorizontal()
    .x(function (d) {
        return d.y;
    })
    .y(function (d) {
        return d.x;
    });

function locate_node(text) {
    "use strict";
    var i;
    for (i = 0; i < nodes.length; i += 1) {
        if (nodes[i].name === text) {
            return nodes[i];
        }
    }
    return null;
}

function mouse_action(val, stat, direction) {
    "use strict";
    d3.select("#" + val.id).classed("active", stat);

    links.forEach(function (d) {
        if (direction == "root") {
            if (d.source.id === val.id) {
                d3.select("#" + d.id).classed("activelink", stat);
                d3.select("#" + d.id).classed("link", !stat);
                if (d.target.lvl < val.lvl)
                    mouse_action(d.target, stat, "left");
                else if (d.target.lvl > val.lvl)
                    mouse_action(d.target, stat, "right");
            }
            if (d.target.id === val.id) {
                d3.select("#" + d.id).classed("activelink", stat);
                d3.select("#" + d.id).classed("link", !stat);
                if (direction == "root") {
                    if (d.source.lvl < val.lvl)
                        mouse_action(d.source, stat, "left");
                    else if (d.source.lvl > val.lvl)
                        mouse_action(d.source, stat, "right");
                }
            }
        } else if (direction == "left") {
            if (d.source.id === val.id && d.target.lvl < val.lvl) {
                d3.select("#" + d.id).classed("activelink", stat);
                d3.select("#" + d.id).classed("link", !stat);

                mouse_action(d.target, stat, direction);
            }
            if (d.target.id === val.id && d.source.lvl < val.lvl) {
                d3.select("#" + d.id).classed("activelink", stat);
                d3.select("#" + d.id).classed("link", !stat);
                mouse_action(d.source, stat, direction);
            }
        } else if (direction == "right") {
            if (d.source.id === val.id && d.target.lvl > val.lvl) {
                d3.select("#" + d.id).classed("activelink", stat);
                d3.select("#" + d.id).classed("link", !stat);
                mouse_action(d.target, stat, direction);
            }
            if (d.target.id === val.id && d.source.lvl > val.lvl) {
                d3.select("#" + d.id).classed("activelink", stat);
                d3.select("#" + d.id).classed("link", !stat);
                mouse_action(d.source, stat, direction);
            }
        }
    });
}

function mouse_action_click(val, stat, direction) {
    "use strict";
    d3.select("#" + val.id).classed("active_clk", stat);

    links.forEach(function (d) {
        if (direction == "root") {
            if (d.source.id === val.id) {
                d3.select("#" + d.id).classed("activelink_clk", stat);
                d3.select("#" + d.id).classed("link_clk", !stat);
                if (d.target.lvl < val.lvl)
                    mouse_action_click(d.target, stat, "left");
                else if (d.target.lvl > val.lvl)
                    mouse_action_click(d.target, stat, "right");
            }
            if (d.target.id === val.id) {
                d3.select("#" + d.id).classed("activelink_clk", stat);
                d3.select("#" + d.id).classed("link_clk", !stat);
                if (direction == "root") {
                    if (d.source.lvl < val.lvl)
                        mouse_action_click(d.source, stat, "left");
                    else if (d.source.lvl > val.lvl)
                        mouse_action_click(d.source, stat, "right");
                }
            }
        } else if (direction == "left") {
            if (d.source.id === val.id && d.target.lvl < val.lvl) {
                d3.select("#" + d.id).classed("activelink_clk", stat);
                d3.select("#" + d.id).classed("link_clk", !stat);

                mouse_action_click(d.target, stat, direction);
            }
            if (d.target.id === val.id && d.source.lvl < val.lvl) {
                d3.select("#" + d.id).classed("activelink_clk", stat);
                d3.select("#" + d.id).classed("link_clk", !stat);
                mouse_action_click(d.source, stat, direction);
            }
        } else if (direction == "right") {
            if (d.source.id === val.id && d.target.lvl > val.lvl) {
                d3.select("#" + d.id).classed("activelink_clk", stat);
                d3.select("#" + d.id).classed("link_clk", !stat);
                mouse_action_click(d.target, stat, direction);
            }
            if (d.target.id === val.id && d.source.lvl > val.lvl) {
                d3.select("#" + d.id).classed("activelink_clk", stat);
                d3.select("#" + d.id).classed("link_clk", !stat);
                mouse_action_click(d.source, stat, direction);
            }
        }
    });
}

function untravel_links() {
    "use strict";
    links.forEach(function (d) {
        d.visited = false;
    });
}

function clearActiveLinksNodes() {
    d3.selectAll(".active_clk").classed("active_clk", false);
    d3.selectAll(".activelink_clk").classed("activelink_clk", false);

}

function create_relationship_diagram(data) {
    "use strict";
    var count = [];
    var col_lengths = [];
   // console.log("Inside create_diagram",data);

    data.nodes.forEach(function (d) {
        count[d.lvl] = 0;
        col_lengths[d.lvl] = 0;
    });
    lvlCount = count.length;
   // console.log("lvlCount",lvlCount);

    //offsetShortColumns
    data.nodes.forEach(function (d, i) {
        col_lengths[d.lvl] += 1;
    });

    let max_col_length = Math.max(...col_lengths);
    let max_col_lvl = col_lengths.indexOf(max_col_length);

    let tallest_col_height = max_col_length * (box_heights[max_col_lvl] + box_gap.height);

    data.nodes.forEach(function (d, i) {
        d.x = margin.left + d.lvl * (box_width + box_gap.width);
        d.y = (margin.top + (box_heights[d.lvl] + box_gap.height) * count[d.lvl]);

        if (d.lvl == 0 || d.lvl == 2) {
            d.y += (tallest_col_height / (2 * col_lengths[d.lvl])) * (1 + count[d.lvl]);
        }

        d.id = "n" + i;
        count[d.lvl] += 1;
        nodes.push(d);
    });

    data.links.forEach(function (d) {
        links.push({
            source: locate_node(d.source),
            target: locate_node(d.target),
            id: "l" + locate_node(d.source).id + locate_node(d.target).id
        });
    });
    untravel_links();

    d3.select("#chart_canvas")
        .on("click", clearActiveLinksNodes)

    svg.append("g")
        .attr("class", "nodes");

    var node = svg.select(".nodes")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "unit");

    node.append("rect")
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("id", function (d) { return d.id; })
        .attr("width", box_width)
        .attr("height", function (d) { return box_heights[d.lvl]; })
        .attr("class", "node")
        .attr("class", function (d) { return "col" + d.lvl; })
        .attr("rx", 6)
        .attr("ry", 6)
        .on("mouseover", function () {
            mouse_action(d3.select(this).datum(), true, "root");
            untravel_links();
        })
        .on("mouseout", function () {
            mouse_action(d3.select(this).datum(), false, "root");
            untravel_links();
        })
        .on("click", function (e) {
            e.stopPropagation();
            if (d3.select(this).classed("active_clk")) {
                mouse_action_click(d3.select(this).datum(), false, "root");
            }
            else {
                mouse_action_click(d3.select(this).datum(), true, "root");
            }
            untravel_links();
        });

    node.append("text")
        .attr("class", function (d) { return "label" + d.lvl; })
        .attr("x", function (d) { return d.x + 11; })
        .attr("y", function (d) { return d.y + 15; })
        .text(function (d) { return d.name; });



    //overall title and column titles
    svg.append("text")
        .attr("id", "chart_title")
        .attr("x", 10)
        .attr("y", 25)
        .text("Customer(Org) Data - Value Map");

    var column_data = [
        {
            "lvl": 0,
            "title": "Business Value"
        },
        {
            "lvl": 1,
            "title": "Use Cases"
        },
        {
            "lvl": 2,
            "title": "Capabilities"
        },
        {
            "lvl": 3,
            "title": "Features"
        },


    ]
    var col_titles = svg.append("g")
        .attr("class", "column_title")
        .selectAll("g")
        .data(column_data)
        .enter()
        .append("g")

    col_titles.append("rect")
        .attr("x", function (d) { return margin.left + d.lvl * (box_width + box_gap.width); })
        .attr("y", function (d) { return 60; })
        .attr("id", function (d) { return "col_title" + d.lvl; })
        .attr("width", box_width)
        .attr("height", function (d) { return box_height; })
        .attr("class", function (d) { return "col_title"; })
        .attr("rx", 60)
        .attr("ry", 6)

    col_titles.append("text")
        .attr("x", function (d) { return 25 + margin.left + d.lvl * (box_width + box_gap.width); })
        .attr("y", function (d) { return 60 + 20; })
        .attr("class", "col_title_text")
        .text(function (d) { return d.title; });



    //d.x = margin.left + d.lvl * (box_width + box_gap.width);
    // d.y = (margin.top + (box_heights[d.lvl] + box_gap.height) * count[d.lvl]);



    links.forEach(function (li) {
        svg.append("path", "g")
            .attr("class", "link")
            .attr("id", li.id)
            .attr("d", function () {
                var target_link_point = {
                    //x: li.target.y + 0.5 * box_height,
                    x: li.target.y + 0.5 * box_heights[li.target.lvl],
                    y: li.target.x
                };
                var source_link_point = {
                    x: li.source.y + 0.5 * box_heights[li.source.lvl],
                    y: li.source.x
                };

                if (source_link_point.y < target_link_point.y) {
                    source_link_point.y += box_width;
                } else {
                    target_link_point.y += box_width;
                }
                return link({
                    source: source_link_point,
                    target: target_link_point
                });
            });
    });
}

svg = d3.select("#rel_diagram").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "chart_canvas")
    .append("g");


