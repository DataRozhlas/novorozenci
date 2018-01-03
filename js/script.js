/*jslint browser: true*/
/*global $ availableTags console */
"use strict";
$( function () {
    $(".nameac").click(function() {
        $(this).val("");
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
    var years = [];
    for (var year = 1916; year <= 2016; year++) {
        years.push(year);
    };

    var appchart = Highcharts.chart("appchart", {
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
                            crosshair: true,
                            categories: years
                        },
                        credits: {
                            enabled: false
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: "Počet narozených"
                            },
                            labels: {
                                format: '{value}'
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

    $("#name1").val("Jiří");
    $("#name2").val("");
    loadNameData("Jiří", 1, true);

    // choosing name 1 - two options
    var shownName1;
    $(".ui-menu").click(function () {
        if (shownName1 != $("#name1").val()) {
            loadNameData($("#name1").val(), 1);
        }
    });
    $("#name1").on("keydown", function (event) {
        if (event.which === 13) {
            $(".ui-menu").hide();
            if (shownName1 != $("#name1").val()) {
                loadNameData($("#name1").val(), 1);
            }
        }
    });

    var timeoutID1 = 0;
    $("#name1").on("input", function () {
        window.clearTimeout(timeoutID1);
        timeoutID1 = window.setTimeout( function () {
            if (shownName1 != $("#name1").val()) {
                loadNameData($("#name1").val(), 1);
            }
        }, 500);
    });

    // choosing name 2
    var shownName2;
    $(".ui-menu").click(function () {
        if (shownName2 != $("#name2").val()) {
            loadNameData($("#name2").val(), 2);
        }
    });
    $("#name2").on("keydown", function (event) {
        if (event.which === 13) {
            $(".ui-menu").hide();
            if (shownName2 != $("#name2").val()) {
                loadNameData($("#name2").val(), 2);
            }
        }
    });


    var timeoutID2 = 0;
    $("#name2").on("keyup", function () {
        if ($("#name2").val() === "" || $("#name2").val() === " ") {
            try {
                appchart.get("name2").remove();
            } catch {}
        }
    });
    $("#name2").on("input", function () {
        window.clearTimeout(timeoutID2);
        timeoutID2 = window.setTimeout( function () {
            if (shownName2 != $("#name2").val()) {
                loadNameData($("#name2").val(), 2);
            }
        }, 500);
    });
    
    function loadNameData(name, series, init=false) {
        if (name === "") {
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

    Highcharts.chart("uniqnames", {
        chart: {
            height: 400
        },
        colors: ["#2b908f"],
        title: {
            text: "Jedinečná jména podle roku narození"
        },
        xAxis: {
            crosshair: true,
            categories: years
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        yAxis: {
            min: 0,
            title: {
                text: "Počet narozených"
            },
            labels: {
                format: '{value}'
            }
        },
        series: [{
            type: "area",
            name: "Jedinečná jména",
            data: [86,132,141,223,269,366,435,537,605,650,730,782,888,953,1038,1081,1128,1177,1227,1267,1290,1334,1420,1440,1569,1585,1602,1687,1739,1669,1746,1684,1715,1734,1677,1696,1726,1670,1671,1641,1632,1637,1566,1548,1568,1575,1624,1680,1739,1742,1737,1669,1771,1792,1826,1839,1867,1803,1903,1896,1831,1778,1756,1744,1712,1654,1616,1559,1604,1640,1636,1701,1647,1786,1808,1988,2260,2263,2289,2300,2288,2343,2341,2190,2474,3500,3804,4026,4278,4647,5280,5578,6303,6434,6320,6159,6231,6219,6157,6198,5558]
        }],
        plotOptions: {
            area: {
                animation: false
            }
        }
    });


    Highcharts.chart('oldest-female', {
        chart: {
            inverted: true,
            height: 600
        },
        colors: ["#f45b5b", "#434348"],

        credits: {
            enabled: false
        },
        title: {
            text: '"Nejstarší" jména - ženy'
        },
        subtitle: {
            text: 'Jména s nejvyšším mediánem věku'
        },
        tooltip: {
            shared: true
        },
        yAxis: {
            title: {
                text: 'Věk'
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        xAxis: {
            categories: ["Aloisie", "Alenka", "Danuška", "Gertruda", "Josefa", "Františka", "Helga", "Miluška", "Emilie",
                "Jaruška", "Lidmila", "Bedřiška", "Blažena", "Božena", "Krista", "Růžena", "Věnceslava", "Ivanka", "Anděla",
                "Květoslava", "Maria", "Marie", "Milada", "Vlastimila", "Zdenka"],
            reversed: true,
            labels: {
                style: {
                    fontSize:'15px'
                }
            }
        },
        series: [{
            type: 'columnrange',
            name: 'Rozpětí (25. - 75. percentil)',
            data: [ 
                [73, 86], //ALOISIE 80
                [71, 83], //ALENKA 77
                [70, 83], //DANUŠKA 77
                [74, 84], //GERTRUDA 77
                [68, 84], //JOSEFA 76
                [66, 83], //FRANTIŠKA 75
                [67, 78], //HELGA 75
                [69, 83], //MILUŠKA 74
                [65, 81], //EMILIE 73
                [68, 83], //JARUŠKA 73

                [66, 80], //LIDMILA 73
                [63, 81], //BEDŘIŠKA 72
                [64, 81], //BLAŽENA 72
                [64, 81], //BOŽENA 72
                [61, 76], //KRISTA 71
                [61, 80], //RŮŽENA 71
                [65, 79], //VĚNCESLAVA 71
                [67, 73], //IVANKA 70
                [50, 81], //ANDĚLA 69
                [60, 78], //KVĚTOSLAVA 69

                [55, 78], //MARIA 69
                [59, 77], //MARIE 69
                [60, 78], //MILADA 69
                [62, 79], //VLASTIMILA 69
                [59, 78]  //ZDENKA 69
            ]
        },
        {
            type: 'scatter',
            name: 'Medián',
            data: [80, 77, 77, 77, 76, 75, 75, 74, 73, 73, 73, 72, 72, 72, 71, 71, 71, 70, 69, 69, 69, 69, 69, 69, 69],
            marker: {
                symbol: "diamond"
            }
        }]

    });

    Highcharts.chart('oldest-male', {
        chart: {
            inverted: true,
            height: 600
        },
        colors: ["#8085e9", "#434348"],
        credits: {
            enabled: false
        },
        title: {
            text: '"Nejstarší" jména - muži'
        },
        subtitle: {
            text: 'Jména s nejvyšším mediánem věku'
        },
        tooltip: {
            shared: true
        },
        yAxis: {
            title: {
                text: 'Věk'
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        xAxis: {
                    categories: ["Adolf", "Alois", "Leopold", "Emanuel", "Erich", "Bohumír", "Bohumil",
                        "Ferdinand", "Bedřich", "Bohuslav", "Arnošt", "Bořivoj", "Emil",
                        "František", "Ján", "Ludvík", "Oldřich", "Otto", "Anton", "Josef",
                        "Jozef", "Karol", "Miloslav", "Otakar", "Rudolf"],
                    reversed: true,
                    labels: {
                        style: {
                            fontSize:'15px'
                        }
                    }
                },
                series: [{
                    type: 'columnrange',
                    name: 'Rozpětí (25. - 75. percentil)',
                    data: [ 
                        [61, 79], //ADOLF 73
                        [58, 76], //ALOIS 68
                        [59, 77], //LEOPOLD 68
                        [53, 75], //EMANUEL 67
                        [54, 77], //ERICH 67
                        [55, 74], //BOHUMÍR 66
                        [53, 73], //BOHUMIL 65
                        [47, 76], //FERDINAND 65
                        [51, 73], //BEDŘICH 64
                        [53, 72], //BOHUSLAV 64

                        [49, 74], //ARNOŠT 63
                        [47, 71], //BOŘIVOJ 63
                        [49, 73], //EMIL 63
                        [46, 72], //FRANTIŠEK 63
                        [52, 72], //JÁN 63
                        [49, 73], //LUDVÍK 63
                        [48, 71], //OLDŘICH 63
                        [48, 75], //OTTO 63
                        [50, 72], //ANTON 62
                        [45, 71], //JOSEF 62

                        [52, 71], //JOZEF 62
                        [51, 72], //KAROL 62
                        [50, 71], //MILOSLAV 62
                        [45, 71], //OTAKAR 62
                        [47, 72], //RUDOLF 62
                    ]
                },
                {
                    type: 'scatter',
                    name: 'Medián',
                    data: [73,68,68,67,67,66,65,65,64,64,63,63,63,63,63,63,63,63,62,62,62,62,62,62,62],
                    marker: {
                        symbol: "diamond"
                    }
                }]

    });
    
    Highcharts.chart('youngest-female', {
        chart: {
            inverted: true,
            height: 600
        },
        colors: ["#f45b5b", "#434348"],

        credits: {
            enabled: false
        },
        title: {
            text: '"Nejmladší" jména - ženy'
        },
        subtitle: {
            text: 'Jména s nejnižším mediánem věku'
        },
        tooltip: {
            shared: true
        },
        yAxis: {
            title: {
                text: 'Věk'
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        xAxis: {
            categories: ["Ella", "Mia", "Emma", "Leontýna", "Liliana", "Sofie", "Stela", "Stella",
            "Amálie", "Ela", "Elen", "Ema", "Izabela", "Josefína", "Justýna", "Laura", "Nella", 
            "Rozálie", "Ellen", "Sofia", "Vanesa", "Viktorie", "Agáta", "Klaudie", "Nela"],
            reversed: true,
            labels: {
                style: {
                    fontSize:'15px'
                }
            }
        },
        series: [{
            type: 'columnrange',
            name: 'Rozpětí (25. - 75. percentil)',
            data: [
                [2, 7], //Ella 4
                [2, 7], //Mia 4
                [2, 9], //Emma 5
                [3, 9], //Leontýna 5
                [3, 10], //Liliana 5

                [3, 7], //Sofie 5
                [2, 8], //Stela 5
                [2, 8], //Stella 5
                [3, 9], //Amálie 6
                [3, 9], //Ela 6

                [3, 9], //Elen 6
                [3, 10], //Ema 6
                [3, 13], //Izabela 6
                [3, 12], //Josefína 6
                [3, 9], //Justýna 6

                [3, 9], //Laura 6
                [3, 9], //Nella 6
                [2, 10], //Rozálie 6
                [3, 12], //Ellen 7
                [3, 11], //Sofia 7

                [4, 11], //Vanesa 7
                [3, 12], //Viktorie 7
                [4, 13], //Agáta 8
                [4, 14], //Klaudie 8
                [5, 13]  //Nela 8
            ]
        },
        {
            type: 'scatter',
            name: 'Medián',
            data: [4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,7,7,7,7,8,8,8],
            marker: {
                symbol: "diamond"
            }
        }]

    });

    Highcharts.chart('youngest-male', {
        chart: {
            inverted: true,
            height: 600
        },
        colors: ["#8085e9", "#434348"],
        credits: {
            enabled: false
        },
        title: {
            text: '"Nejmladší" jména - muži'
        },
        subtitle: {
            text: 'Jména s nejnižším mediánem věku'
        },
        tooltip: {
            shared: true
        },
        yAxis: {
            title: {
                text: 'Věk'
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        xAxis: {
                    categories: ["Eliáš", "Damián", "Teodor", "Tobias", "Tobiáš", "Max",
                    "Maxmilián", "Oliver", "Sebastian", "Sebastián", "Alex", "Jáchym", "Matyáš",
                    "Maxim", "Mikuláš", "Samuel", "Vincent", "Jonáš", "Nicolas", "Šimon", "Vítek",
                    "Hugo", "Kristián", "Kryštof", "Nikolas"],
                    reversed: true,
                    labels: {
                        style: {
                            fontSize:'15px'
                        }
                    }
                },
                series: [{
                    type: 'columnrange',
                    name: 'Rozpětí (25. - 75. percentil)',
                    data: [
                        [2, 7], //Eliáš 4
                        [3, 10], //Damián 5
                        [2, 11], //Teodor 5
                        [3, 8], //Tobias 5
                        [3, 8], //Tobiáš 5

                        [3, 9], //Max 6
                        [3, 12], //Maxmilián 6
                        [3, 10], //Oliver 6
                        [3, 10], //Sebastian 6
                        [3, 10], //Sebastián 6

                        [3, 12], //Alex 7
                        [3, 11], //Jáchym 7
                        [4, 10], //Matyáš 7
                        [4, 11], //Maxim 7
                        [3, 17], //Mikuláš 7

                        [4, 11], //Samuel 7
                        [3, 35], //Vincent 7
                        [4, 13], //Jonáš 8
                        [5, 14], //Nicolas 8
                        [4, 13], //Šimon 8

                        [4, 13], //Vítek 8
                        [4, 43], //Hugo 9
                        [4, 15], //Kristián 9
                        [4, 15], //Kryštof 9
                        [5, 16]  //Nikolas 9
                    ]
                },
                {
                    type: 'scatter',
                    name: 'Medián',
                    data: [4,5,5,5,5,6,6,6,6,6,7,7,7,7,7,7,7,8,8,8,8,9,9,9,9],
                    marker: {
                        symbol: "diamond"
                    }
                }]

    });

    //next one here
});