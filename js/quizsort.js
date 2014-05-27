"use strict";

//Statiskt objekt Sorter
var Sorter = {

    quizArray: [],

    sortButtons: document.querySelectorAll("#sortbuttons"),

    init: function () {

        //Hämtar klass för div "content" för att avgöra vilken XML-fil som ska läsas in
        var contentClass = document.getElementById("contentheight").getAttribute("class");
        var url = "../XML/" + contentClass + ".xml";

        //Skapande av en ny AjaxCon-instans
        new AjaxCon(url, function (data) {

            var xmlDoc = data;

            //Läser in quizzen till egenskapen quizArray
            var i, quizzes = xmlDoc.getElementsByTagName("quizzes")[0];

            for (i = 0; i < quizzes.children.length; i += 1) {
                var quiz = xmlDoc.getElementsByTagName("quiz")[i];
                Sorter.quizArray.push(quiz);
                Sorter.quizArray[i].date = new Date(quiz.getAttribute("created"));
                Sorter.quizArray[i].name = quiz.getAttribute("name");
            }
            Sorter.showquizzes();
        });
    },

    showquizzes: function () {

        var j, k, quizzesDiv = document.createElement("div"), dl = document.createElement("dl");

        quizzesDiv.setAttribute("id", "quizzes");
        dl.setAttribute("id", "dl");

        //Skriver ut quizzens namn, länkar till quizzen och datum de skapades i en dl-lista i DOM:en
        for (j = 0; j < Sorter.quizArray.length; j += 1) {
            var quiz = Sorter.quizArray[j];
            var aTag = document.createElement("a");
            aTag.setAttribute("href", quiz.getAttribute("url"));
            aTag.innerHTML = quiz.name;
            var dtTag = document.createElement("dt");
            dtTag.appendChild(aTag);
            var ddTag = document.createElement("dd");
            ddTag.innerHTML = "Skapat: " + quiz.getAttribute("created");
            dtTag.appendChild(ddTag);
            dl.appendChild(dtTag);
        }
        quizzesDiv.appendChild(dl);
        document.getElementById("contentheight").appendChild(quizzesDiv);

        //Händelsehanterare kopplad till "Bokstavsordning" och "Nyaste först"-knapparna
        for (k = 0; k < Sorter.sortButtons.length; k += 1) {
            Sorter.sortButtons[k].onclick = function (e) {
                e.preventDefault();
                Sorter.sort(e.target, quizzesDiv);
            };
        }
    },

    //Funktion som sorterar quizzen antingen enligt namn eller datum
    sort: function (button, quizzesDiv) {

        if (button.getAttribute("class") == "alphabetbutton") {

            //Sorterar quizArray enligt namn (http://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript)
            Sorter.quizArray.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        } else {
            //Sorterar quizArray enligt datum (http://stackoverflow.com/questions/6212737/sorted-a-javascript-array-of-objects-by-an-object-property)
            Sorter.quizArray.sort(function (a, b) {
                return b.date - a.date;
            });
        }
        //Tar bort dl-listan från DOM:en och anropar funktionen showquizzes
        quizzesDiv.removeChild(document.getElementById("dl"));
        Sorter.showquizzes();
    }
};

window.onload = Sorter.init;