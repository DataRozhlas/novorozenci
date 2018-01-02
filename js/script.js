/*jslint browser: true*/
/*global $ availableTags console */
"use strict";
$( function () {
    //$("#name").val("");

    $("#name").autocomplete({
        source: availableTags,
        minLength: 3
    });

    $.ui.autocomplete.filter = function (array, term) {
        return $.grep(array, function (value) {
            return value.toLowerCase().startsWith(term.toLowerCase());
        });
    };

    $("#testint").click(function () {
        $.ajax({
            url: "https://5mw39ochkf.execute-api.eu-central-1.amazonaws.com/prod/novorozenci",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({"name": $("#name").val().toUpperCase()}),
            dataType: "json",
            success: function success(response) {
                if (response["Items"].length === 0) {
                    $("#name").addClass("wronginput");
                } else {    
                    var data = [];
                    var years = [];
                    var median_array = [];

                    for (var year = 1916; year <= 2016; year++) {
                        data.push(response["Items"][0][year]);
                        years.push(year);
                        for (var i = response["Items"][0][year]; i > 0; i--) {
                            median_array.push(year)
                        };
                    };
                    $("#medianinfo").text("Mediánový/á " + $("#name").val() + " se narodil/a v roce " + median_array[Math.round(median_array.length/2)] + ".");

                    var chart = Highcharts.chart('chart', {
                        chart: {
                            type: 'column',
                            height: 400
                        },
                        title: {
                            text: null
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
                        },
                        series: [{
                            name: 'Narozených',
                            data: data
                        }]
                    });
                }
            }
        });
    });

    $("#name").on("input", function () {
        $("#name").removeClass("wronginput");
    });
});