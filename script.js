let startNode = null, endNode = null;

const allCities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
    "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington",
    "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore",
    "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Kansas City", "Mesa", "Atlanta", "Omaha", "Colorado Springs",
    "Raleigh", "Miami", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Tampa", "Arlington", "New Orleans",
    "Wichita", "Cleveland", "Bakersfield", "Aurora", "Anaheim", "Honolulu", "Santa Ana", "Riverside", "Corpus Christi", "Lexington",
    "Henderson", "Stockton", "Saint Paul", "Cincinnati", "St. Louis", "Pittsburgh", "Greensboro", "Lincoln", "Anchorage", "Plano",
    "Orlando", "Irvine", "Newark", "Toledo", "Durham", "Chula Vista", "Fort Wayne", "Jersey City", "St. Petersburg", "Laredo",
    "Madison", "Chandler", "Buffalo", "Lubbock", "Scottsdale", "Reno", "Glendale", "Gilbert", "Winston-Salem", "North Las Vegas",
    "Norfolk", "Chesapeake", "Garland", "Irving", "Hialeah", "Fremont", "Boise", "Richmond", "Baton Rouge"
].slice(0, 10);


const generateGraph = (cities) => {
    const nodes = cities.map(city => ({ id: city }));

    // Generate random links with random distances between cities
    const links = [];
    for (let i = 0; i < 200; i++) {
        const sourceIndex = Math.floor(Math.random() * nodes.length);
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (sourceIndex !== targetIndex) {
            links.push({
                source: nodes[sourceIndex].id,
                target: nodes[targetIndex].id,
                distance: Math.floor(Math.random() * 1000) + 1
            });
        }
    }

    const svg = d3.select("svg");
    console.log(svg.attr("width"));
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(175));

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    const labels = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("dy", -10)
        .text(d => d.id);

    const linkLabels = svg.append("g")
        .attr("class", "link-labels")
        .selectAll("text")
        .data(links)
        .enter().append("text")
        .attr("dy", -5)
        .text(d => d.distance);


    node.on("click", function (event, d) {
        if (!d3.select(this).classed("selected")) {
            d3.selectAll(".selected").classed("selected", false);
            d3.select(this).classed("selected", true);
        } else {
            d3.select(this).classed("selected", false);
        }

        const selectedNodes = d3.selectAll(".selected").data();
        if (selectedNodes.length === 2) {
            link.classed("highlight", l =>
                (l.source.id === selectedNodes[0].id && l.target.id === selectedNodes[1].id) ||
                (l.source.id === selectedNodes[1].id && l.target.id === selectedNodes[0].id)
            );
        } else {
            link.classed("highlight", false);
        }
    });

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        linkLabels
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2);
    });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

generateGraph(allCities);

function highlightLine(startNodeId, endNodeId) {
    d3.selectAll('line')
        .filter(function (d) {
            return (d.source.id === startNodeId && d.target.id === endNodeId) ||
                (d.source.id === endNodeId && d.target.id === startNodeId);
        })
        .classed('highlight', true);
}

function getNodeIdFromTextLabel(textLabel) {
    const textElement = d3.selectAll('.labels text')
        .filter(function () {
            return d3.select(this).text() === textLabel;
        });
    const nodeId = textElement.datum().id;
    return nodeId || null;
}


function drawArrow(x1, y1, x2, y2) {
    const s = Snap('#graph');
    s.selectAll('line')?.remove(); // Remove existing arrows
    const line = s.line(x1, y1, x2, y2);
    line.attr({
        stroke: 'blue',
        strokeWidth: 2
    });

    // Arrowhead
    const arrowHeadSize = 10;
    console.log("Ok till now")
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const x3 = x2 - arrowHeadSize * Math.cos(angle - Math.PI / 6);
    const y3 = y2 - arrowHeadSize * Math.sin(angle - Math.PI / 6);
    const x4 = x2 - arrowHeadSize * Math.cos(angle + Math.PI / 6);
    const y4 = y2 - arrowHeadSize * Math.sin(angle + Math.PI / 6);

    const arrowHead = s.polygon([x2, y2, x3, y3, x4, y4]);
    arrowHead.attr({
        fill: 'blue'
    });
}

function positionArrow(text1, text2) {
    const x1 = text1.node.x.animVal[0].value;
    const y1 = text1.node.y.animVal[0].value;
    const x2 = text2.node.x.animVal[0].value;
    const y2 = text2.node.y.animVal[0].value;
    const height1 = text1.node.clientHeight;
    const height2 = text2.node.clientHeight;
    const width1 = text1.node.clientWidth;
    const width2 = text2.node.clientWidth;
    console.log(x1 + width1 / 2,
        y1 + height1 / 2,
        x2 + width2 / 2,
        y2 + height2 / 2);
    drawArrow(
        x1 + width1 / 2,
        y1 + height1 / 2,
        x2 + width2 / 2,
        y2 + height2 / 2
    );
}

function addClickListener() {
    const textArray = document.querySelectorAll(".labels>text");
    for (let i = 0; i < textArray.length; i++) {
        textArray[i].addEventListener('click', function (event, d) {
            const s = Snap("#graph");
            console.log("CLICKED NODE!");
            if (startNode === null) {
                startNode = s.selectAll(".labels>text")[i];

                console.log("START_NODE SET! AS " + textArray[i].innerHTML);
                endNode = null;
            } else {
                endNode = s.selectAll(".labels>text")[i];
                console.log("END_NODE SET! AS " + textArray[i].innerHTML);
                console.log(startNode);
                console.log(endNode);
                //BOTH NODES SET.
                positionArrow(startNode, endNode);
                startNode = null;
                endNode = null;
            }
        });
    }
}

addClickListener();


function extractNodesAndLinks() {
    // Extract nodes
    const allNodes = d3.selectAll('.nodes circle')
        .data() // Get the bound data
        .map(d => ({ id: d.id })); // Extract node IDs

    // Extract links
    const allLinks = d3.selectAll('.links line')
        .data() // Get the bound data
        .map(d => ({
            source: d.source.id,
            target: d.target.id,
            distance: d.distance
        }));

    return { allNodes, allLinks };
}

const { allNodes, allLinks } = extractNodesAndLinks();


//FLOYD-WARSHALL IMPLEMENTATION
// console.log(allNodes);
// console.log(allLinks);
const generateAdjacencyMatrix = (nodes, links) => {
    // Create a mapping of node IDs to their indices
    const nodeIndex = {};
    nodes.forEach((node, index) => {
        nodeIndex[node.id] = index;
    });

    // Initialize an empty matrix with zero values
    const matrix = Array(nodes.length).fill(null).map(() => Array(nodes.length).fill(0));

    // Populate the matrix with distances from links
    links.forEach(link => {
        const sourceIndex = nodeIndex[link.source];
        const targetIndex = nodeIndex[link.target];
        matrix[sourceIndex][targetIndex] = link.distance;
        matrix[targetIndex][sourceIndex] = link.distance; // For undirected graph
    });

    return matrix;
};

// console.log(graphAdjacencyMatrix);

const copyMatrix = (matrix) => {
    // console.log(matrix);
    let dist = []; // Copy of the matrix
    for (let i = 0; i < matrix.length; i++) {
        dist.push([]);
        for (let j = 0; j < matrix.length; j++) {
            dist[i].push(0);
        }
    }
    matrix.map((row, r_index) => {
        // console.log(row);
        row.map((val, v_index) => {
            dist[r_index][v_index] = val;
        })
    })
    // console.log(dist);
    return dist;
}

function floydWarshall(matrix) {
    const dist = copyMatrix(matrix);
    const n = matrix.length;
    // Floyd-Warshall algorithm
    setTimeout(() => {
        for (let k = 0; k < n; k++) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }, 5000);
    return dist;
}

const graphAdjacencyMatrix = generateAdjacencyMatrix(allNodes, allLinks);
const floydWarshalledGraph = floydWarshall(graphAdjacencyMatrix);
console.log("NOW PRESENTING THE FLOYD WARSHALL GRAPH:");
console.log(floydWarshalledGraph);