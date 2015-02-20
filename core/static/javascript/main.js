$(document).ready(function () {

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
        var row = $('<tr></tr>').addClass("player").attr("id", players[i].id);
        row.append($('<td></td>').text(players[i].name));
        row.append($('<td></td>').text(players[i].position));
        row.append($('<td></td>').text(players[i].totalPoints));
        row.append($('<td></td>').text(getCost(players[i].cost)));
        tbody.append(row);
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
                showChart(data);
            }
        },
        'error': function() {
            toastr.error('Error');
        }
    });
}

function showChart(player) {

    var pointsString = player["pointsHistory"];
    var points = (pointsString.slice(1, pointsString.length-1)).split(", ");

    var ctx = $("#myChart").get(0).getContext("2d");

    var labels = [];
    for (var i = 1; i <= points.length; i++) {
        labels.push("Gameweek " + i);
    }
    var data = {
        labels: labels,
        datasets: [
        {
            label: "Player",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: points
        }
        ]
    };
    var options = {
        multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
    }
    // This will get the first returned node in the jQuery collection.
    Chart.defaults.global.responsive = true;
    var myNewChart = new Chart(ctx).Line(data, options);
    
    $("#title").html(player["name"] + " | " + player["position"] + " | " + player["team"] + " | " + getCost(player["cost"]) + " | " + player["totalPoints"] + " points");

    $("#photo").attr("src", "http://cdn.ismfg.net/static/plfpl/img/shirts/photos/" + player["photo"]);
}

function getCost(cost) {
    if (cost > 99) {
        return "£" + (cost/10).toPrecision(3);  
    }
    return "£" + (cost/10).toPrecision(2);
}