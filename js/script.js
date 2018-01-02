/*jslint browser: true*/
/*global $ availableTags console */
"use strict";
$( function () {
    $(".nameac").click(function() {
        $(this).val('');
    });

    $(".nameac").autocomplete({
        source: availableTags,
        minLength: 2
    });

    $.ui.autocomplete.filter = function (array, term) {
        return $.grep(array, function (value) {
            return value.toLowerCase().startsWith(term.toLowerCase());
        });
    };

    //initial chart load
    $("#name1").val("Vojtěch")
    $("#name2").val("")
    loadNameData("Vojtěch", 1)

    // choosing name 1 - two options
    var shownName1;
    $(".ui-menu").click(function () {
        if (shownName1 != $("#name1").val()) {
            loadNameData($("#name1").val(), 1)
        }
    });

    var timeoutID1 = 0;
    $("#name1").on("input", function () {
        window.clearTimeout(timeoutID1)
        timeoutID1 = window.setTimeout( function () {
            loadNameData($("#name1").val(), 1)
        }, 500);
    });
    //keyboard doesnt work

    // choosing name 2
    var shownName2;
    $(".ui-menu").click(function () {
        if (shownName2 != $("#name2").val()) {
            loadNameData($("#name2").val(), 2)
        }
    });

    var timeoutID2 = 0;
    $("#name2").on("input", function () {
        window.clearTimeout(timeoutID2)
        timeoutID2 = window.setTimeout( function () {
            loadNameData($("#name2").val(), 2)
        }, 500);
    });

    var years = [];
    for (var year = 1916; year <= 2016; year++) {
        years.push(year);
    };

    var appchart = Highcharts.chart('appchart', {
                        chart: {
                            height: 300
                        },
                        title: {
                            text: null
                        },
                        tooltip: {
                            shared: true
                        },
                        xAxis: {
                            crosshair: true
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            categories: years
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Počet narozených'
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.1,
                                borderWidth: 0,
                                events: {
                                    legendItemClick: function () {
                                        return false; 
                                    }
                                }
                            }
                        }
                    });

    function loadNameData(name, series) {
        if (name == "") {
            return
        }
        name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        if (series === 1) {
            shownName1 = name;
            var boxid = "#name1"
        } else if (series === 2) {
            shownName2 = name;
            var boxid = "#name2"
        }

        $.ajax({
            url: "https://5mw39ochkf.execute-api.eu-central-1.amazonaws.com/prod/novorozenci",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({"name": name.toUpperCase()}),
            dataType: "json",
            success: function success(response) {

                if (response["Items"].length === 0) {
                    $(boxid).addClass("wronginput");
                } else {    
                    $(boxid).removeClass("wronginput");
                    var data = [];
                    var median_array = [];
                    years.forEach(function(year) {
                        data.push(response["Items"][0][year]);
                        for (var i = response["Items"][0][year]; i > 0; i--) {
                            median_array.push(year)
                        };
                    });
                    if (series === 1) {
                        $("#median1info").text("V roce 2016 žilo v Česku " + median_array.length + " nositelů jména " + name 
                            + ". Medián jejich let narození je " + median_array[Math.round(median_array.length/2)-1] + ".");
                        
                        if (appchart.series.length != 0) {
                            appchart.get("name1").remove();
                        }

                        appchart.addSeries({
                            type: "column",
                            name: name,
                            data: data,
                            id: "name1"
                        });

                    } else if (series === 2) {
                        $("#median2info").text("V roce 2016 žilo v Česku " + median_array.length + " nositelů jména " + name 
                            + ". Medián jejich let narození je " + median_array[Math.round(median_array.length/2)-1] + ".");

                        if (appchart.series.length === 2) {
                            appchart.get("name2").remove();
                        }

                        appchart.addSeries({
                            type: "spline",
                            name: name,
                            data: data,
                            id: "name2"
                        });
                    }
                }
            }
        });
    };
});