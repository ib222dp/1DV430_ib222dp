"use strict";

//Statiskt objekt Quiz
var Quiz = {

    amountQCorrect: 0,

    init: function () {

        //Öppnar XML-filen (http://stackoverflow.com/questions/22495746/using-javascript-to-show-xml-info-in-html-webpage?rq=1)
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "../XML/politicsquizzes.xml", false);
        xhr.send();
        var xmlDoc = xhr.responseXML;
        var quiz = xmlDoc.documentElement;

        var questionNoP = document.createElement("p");
        questionNoP.innerHTML = xmlDoc.getElementsByTagName("questionno")[0].textContent;
        document.getElementById("question").insertBefore(questionNoP, document.getElementById("questiontext"));

        var questionTextP = document.createElement("p");
        questionTextP.innerHTML = xmlDoc.getElementsByTagName("questiontext")[0].textContent;
        document.getElementById("questiontext").insertBefore(questionTextP, document.getElementById("alternatives"));

        var i, alternatives = xmlDoc.getElementsByTagName("questionalternatives")[0].children, ul = document.createElement("ul");

        function answerWindow(e) {
            alert("test");
        }

        //Händelsehanterare kopplad till "click" för svarsalternativen
        for (i = 0; i < alternatives.length; i += 1) {
            var aTag = document.createElement("a");
            aTag.innerHTML = xmlDoc.getElementsByTagName("questionalternative")[i].textContent;
            aTag.addEventListener("click", answerWindow, false);
            var liTag = document.createElement("li");
            liTag.appendChild(aTag);
            ul.appendChild(liTag);
        }
        document.getElementById("alternatives").appendChild(ul);
    }
};

window.onload = Quiz.init;




//http://stackoverflow.com/questions/2154801/childnodes-not-working-in-firefox-and-chrome-but-working-in-ie
//var quizNameH1 = document.createElement("p");
//quizNameH1.innerHTML = xmlDoc.getElementsByTagName("quizname")[0].textContent; (fungerar FF, Chrome)
//quizNameH1.innerHTML = quiz.childNodes[0].text; (fungerar IE)
//document.getElementById("quiz").appendChild(quizNameH1);
