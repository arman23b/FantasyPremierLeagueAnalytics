var lineDataset, pieData1, pieData2, colors;

$(document).ready(function () {

    lineDataset = null;
    Chart.defaults.global.responsive = true;
    Chart.defaults.global.animation = true;
    Chart.defaults.global.tooltipEvents = ["mousemove"];
    colors = [ 
                { color : "rgba(180,0,0,0.6)", taken : false }, 
                { color : "rgba(0,180,0,0.6)", taken : false },
                { color : "rgba(0,0,180,0.6)", taken : false },
                { color : "rgba(180,180,0,0.6)", taken : false },
                { color : "rgba(180,0,180,0.6)", taken : false },
                { color : "rgba(0,180,180,0.6)", taken : false },
                { color : "rgba(180,180,180,0.6)", taken : false },
             ];

    $("a.team").click(function () {
        $("#here_table").empty();
        getTeam($(this).html());
    });

});

function getTeam(team) {
    $.ajax({
        'url': 'teamData', 
        'type': 'POST',
        'dataType': 'json',
        'data': {name : team},
        'success': function(data) {
            showTeam(data["players"]);
        },
        'error': function() {
            toastr.error('Error');
        }
    });  
}

function showTeam(players) {

    var thead = $('<thead></thead>');
    var theadRow = $('<tr></tr>');
    theadRow.append($('<th></th>').text("Name"));
    theadRow.append($('<th></th>').text("Position"));
    theadRow.append($('<th></th>').text("Total Points"));
    theadRow.append($('<th></th>').text("Cost"));
    thead.append(theadRow);

    var tbody = $('<tbody></tbody>');
    for(var i = 0; i < players.length; i++){
        if (players[i].totalPoints >= 2) {
            var row = $('<tr></tr>').addClass("player").attr("id", players[i].id);
            row.append($('<td></td>').text(players[i].name));
            row.append($('<td></td>').text(players[i].position));
            row.append($('<td></td>').text(players[i].totalPoints));
            row.append($('<td></td>').text(getCost(players[i].cost)));
            tbody.append(row);
        }
    }

    var table = $('<table id="myTable"></table>').addClass('u-full-width');
    table.append(thead);
    table.append(tbody);
    $('#here_table').append(table);

    $("tr.player").click(function () {
        getPlayer($(this).attr("id"));
    });

    $('#myTable').DataTable({
        "paging":   false,
        "order": [[ 2, "desc" ]],
        bFilter: false, 
        bInfo: false
    });
}
    

function getPlayer(id) {
    $.ajax({
        'url': 'playerData', 
        'type': 'POST',
        'dataType': 'json',
        'data': {id : id},
        'success': function(data) {
            if (data['error'] == 1)
                toastr.error('Wrong name');
            else {
                var color = getNextColor();
                showLineChart(data, color);
                showPieChart1(data, color);
                showPieChart2(data, color);
            }
        },
        'error': function() {
            toastr.error('Error');
        }
    });
}

function showPieChart1(player, color) {
    var ctx = $("#pieChart1").get(0).getContext("2d");

    if (pieData1 == null) {
        pieData1 = [
            {
                value : player["totalPoints"],
                color : color,
                hightlight : color,
                label : player["name"]
            }
        ];
    } else {
        pieData1.push({
            value : player["totalPoints"],
            color : color,
            hightlight : color,
            label : player["name"]
        });
    }

    var myPieChart = new Chart(ctx).Pie(pieData1);
    $("#pieTitle1").html("Total Points");
}

function showPieChart2(player, color) {
    var ctx = $("#pieChart2").get(0).getContext("2d");

    if (pieData2 == null) {
        pieData2 = [
            {
                value : parseFloat(player["pointsPerGame"]),
                color : color,
                hightlight : color,
                label : player["name"]
            }
        ];
    } else {
        pieData2.push({
            value : parseFloat(player["pointsPerGame"]),
            color : color,
            hightlight : color,
            label : player["name"]
        });
    }

    var myPieChart = new Chart(ctx).Doughnut(pieData2);
    $("#pieTitle2").html("Points per Game");
}

function showLineChart(player, color) {

    var pointsString = player["pointsHistory"];
    var points = (pointsString.slice(1, pointsString.length-1)).split(", ");

    var ctx = $("#lineChart").get(0).getContext("2d");

    var labels = [];
    for (var i = 1; i <= points.length; i++) {
        labels.push("Gameweek " + i);
    }
    
    if (lineDataset == null) {
        lineDataset = [
            {
                label: player["name"],
                fillColor: "rgba(0,0,0,0)",
                strokeColor: color,
                pointColor: color,
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: color,
                data: points
            }
            ]
    } else {
        lineDataset.push(
            {
                label: player["name"],
                fillColor: "rgba(0,0,0,0)",
                strokeColor: color,
                pointColor: color,
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: color,
                data: points
            }
            );
    }

    var data = {
            labels: labels,
            datasets: lineDataset
    };

    var options = {
        multiTooltipTemplate: "<%= datasetLabel %> - <%= value %> points"
    }
    var myNewChart = new Chart(ctx).Line(data, options);

    $("#lineTitle").html("Points History");

    var tbody = $("#players_table").find("tbody");
    var row = tbody.find("#therow");
    var col = $("<td></td>").append(createPlayerTable(player, color));
    row.append(col);
}

function createPlayerTable(player, color) {
    var table = $("<table></table>");
    var row = $("<tr></tr>");
    row.append($("<td rowspan='5'></td>").html("<img src=http://cdn.ismfg.net/static/plfpl/img/shirts/photos/" + 
                                               player["photo"] + ">"));
    row.append($("<td></td>").text(player["name"]));

    table.append(row);
    table.append($("<tr></tr>").append($("<td></td>").text("Team: " + player["team"])));
    table.append($("<tr></tr>").append($("<td></td>").text("Position: " + player["position"])));
    table.append($("<tr></tr>").append($("<td></td>").text("Cost: " + getCost(player["cost"]))));
    table.append($("<tr></tr>").append($("<td></td>").text("Total Points: " + player["totalPoints"])));

    table.attr("style", "border : solid " + color);

    return table;
}

function getCost(cost) {
    if (cost > 99) {
        return "£" + (cost/10).toPrecision(3);  
    }
    return "£" + (cost/10).toPrecision(2);
}

function getNextColor() {
    for (var i = 0; i < colors.length; i++) {
        if (colors[i].taken == false) {
            colors[i].taken = true;
            return colors[i].color;
        }
    }
    for (var i = 1; i < colors.length; i++) {
        colors[i].taken = false;
    }
    return colors[0].color;
}