"use strict";

//Statiskt objekt Quiz
var Quiz = {

    amountQCorrect: 0,

    a: 0,

    init: function () {

        //Hämtar klass för div "content" för att avgöra vilken XML-fil som ska läsas in
        var contentClass = document.getElementById("content").getAttribute("class");
        var url = "../XML/" + contentClass + ".xml";

        //Öppnar XML-filen (http://stackoverflow.com/questions/22495746/using-javascript-to-show-xml-info-in-html-webpage?rq=1)
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, false);
        xhr.send(null);
        var xmlDoc = xhr.responseXML;

        //Hämtar quizzets klass för att avgöra vilket quiz som ska läsas in
        var quizNo = document.getElementById("quiz").getAttribute("class");
        var quiz = xmlDoc.getElementsByTagName("quiz")[quizNo];

        Quiz.question(quiz);
    },

    question: function (quiz) {

        //Läser in frågans nr samt antal frågor och skriver ut det i DOM:en
        var questionNoP = document.createElement("p");
        questionNoP.innerHTML = "Fråga " + quiz.getElementsByTagName("questionno")[Quiz.a].textContent + " av " + quiz.getElementsByTagName("questions")[0].children.length;
        document.getElementById("questionno").appendChild(questionNoP);

        //Skriver ut antal rätt av antal frågor
        var amountQCorrectP = document.createElement("p");
        amountQCorrectP.innerHTML = "ANTAL RÄTT: " + Quiz.amountQCorrect + " av " + quiz.getElementsByTagName("questions")[0].children.length;
        document.getElementById("amountqcorrect").appendChild(amountQCorrectP);

        //Läser in frågan och skriver ut den i DOM:en
        var questionTextP = document.createElement("p");
        questionTextP.innerHTML = quiz.getElementsByTagName("questiontext")[Quiz.a].textContent;
        document.getElementById("questiontext").insertBefore(questionTextP, document.getElementById("alternatives"));

        //Läser in svarsalternativen och skriver ut dem i DOM:en, samt skapar händelsehanterare kopplad till "click" för svarsalternativen
        var i, alternatives = quiz.getElementsByTagName("questionalternatives")[Quiz.a],
        ul = document.createElement("ul"), alternativesDiv = document.createElement("div");

        alternativesDiv.setAttribute("id", "alternatives");

        for (i = 0; i < alternatives.children.length; i += 1) {
            var aTag = document.createElement("a");
            aTag.setAttribute("href", "#");
            aTag.setAttribute("id", alternatives.getElementsByTagName("questionalternative")[i].getAttribute("id"));
            aTag.setAttribute("class", alternatives.getElementsByTagName("questionalternative")[i].textContent);
            aTag.innerHTML = alternatives.getElementsByTagName("questionalternative")[i].textContent;
            aTag.onclick = function (e) {
                Quiz.answer(e, quiz);
            };
            var liTag = document.createElement("li");
            liTag.appendChild(aTag);
            ul.appendChild(liTag);
        }
        alternativesDiv.appendChild(ul);
        document.getElementById("questiontext").appendChild(alternativesDiv);
    },

    //Funktion som ändrar innehållet i "content" när något av svarsalternativen klickas på
    answer: function (e, quiz) {
        e.preventDefault();

        //Skapar div "answertext"
        var answertext = document.createElement("div");
        answertext.setAttribute("id", "answertext");

        //Skapar texten "... är Rätt svar!" eller "... är Fel svar!" beroende på vilket svarsalternativ som klickats på
        var resultText;

        if (e.target.getAttribute("id") === "A") {
            resultText = document.createTextNode(e.target.getAttribute("class") + " är RÄTT SVAR!");
            Quiz.amountQCorrect += 1;
        } else {
            resultText = document.createTextNode(e.target.getAttribute("class") + " är FEL SVAR!");
        }
        var resultTextP = document.createElement("p");
        resultTextP.appendChild(resultText);
        answertext.appendChild(resultTextP);

        //Skriver ut antal rätt av antal frågor
        document.getElementById("amountqcorrect").removeChild(document.querySelector("#amountqcorrect p"));
        var amountQCorrectP = document.createElement("p");
        amountQCorrectP.innerHTML = "ANTAL RÄTT: " + Quiz.amountQCorrect + " av " + quiz.getElementsByTagName("questions")[0].children.length;
        document.getElementById("amountqcorrect").appendChild(amountQCorrectP);

        //Läser in svarskommentaren och skriver ut den i DOM:en
        var answerCommentP = document.createElement("p");
        answerCommentP.innerHTML = quiz.getElementsByTagName("answercomment")[Quiz.a].textContent;
        answertext.appendChild(answerCommentP);

        //Läser in källangivelsen och skriver ut den i DOM:en
        var sourceP = document.createElement("p");
        sourceP.innerHTML = "Källa:";
        var sourceLink = document.createElement("a");
        sourceLink.innerHTML = quiz.getElementsByTagName("sourcetext")[Quiz.a].textContent;
        sourceLink.setAttribute("href", "#");
        //Öppnar källan i nytt fönster när länken till källan klickats på
        sourceLink.onclick = function (e) {
            window.open(quiz.getElementsByTagName("sourcelink")[Quiz.a].firstChild.nodeValue);
        };
        answertext.appendChild(sourceP);
        answertext.appendChild(sourceLink);

        //Skriver ut div "answertext" i DOM:en
        document.getElementById("question").appendChild(answertext);

        //Tar bort frågetext och svarsalternativ
        var questionTextDiv = document.getElementById("questiontext");
        questionTextDiv.removeChild(document.querySelector("#questiontext p"));
        questionTextDiv.removeChild(document.getElementById("alternatives"));

        //Visar "Nästa"-knappen tills den sista frågan i xml-filen har nåtts, då div "quizendmenu" istället visas
        if (Quiz.a < (quiz.getElementsByTagName("questions")[0].children.length) - 1) {
            var nextButton = document.getElementById("nextbutton");
            nextButton.removeAttribute("class", "hidden");
            //Händelsehanterare kopplad till "Nästa"-knappen
            nextButton.onclick = function () {
                Quiz.next(quiz);
            };
        } else {
            //Skickar antal rätt till PHP-skript som skriver resultatet till XML-filen
            //(http://stackoverflow.com/questions/1917576/how-to-pass-javascript-variables-to-php)
            var xhr = new XMLHttpRequest();
            var urlToSend = "PHP/savestats.php?amountCorrect=" + Quiz.amountQCorrect;
            xhr.open("post", "PHP/savestats.php", true);
            xhr.send(urlToSend);
            document.getElementById("quizendmenu").removeAttribute("class", "hidden");
        }
    },

    //Funktion som anropas när "Nästa"-knappen klickats på
    next: function (quiz) {

        //Döljer "Nästa"-knappen
        document.getElementById("nextbutton").setAttribute("class", "hidden");

        //Anropar question-funktionen tills den sista frågan i xml-filen har nåtts
        if (Quiz.a < (quiz.getElementsByTagName("questions")[0].children.length) - 1) {

            //Tar bort frågans nummer
            var questionNoDiv = document.getElementById("questionno");
            var questionNoP = document.querySelector("#questionno p");
            questionNoDiv.removeChild(questionNoP);

            //Tar bort antal rätt
            var amountQCorrectDiv = document.getElementById("amountqcorrect");
            var amountQCorrectP = document.querySelector("#amountqcorrect p");
            amountQCorrectDiv.removeChild(amountQCorrectP);

            //Tar bort div "answertext"
            document.getElementById("question").removeChild(answertext);

            Quiz.a++;
            Quiz.question(quiz);
        }
    }
};

window.onload = Quiz.init;




//http://stackoverflow.com/questions/2154801/childnodes-not-working-in-firefox-and-chrome-but-working-in-ie
//quizNameH1.innerHTML = xmlDoc.getElementsByTagName("quizname")[0].textContent; (fungerar FF, Chrome)
//quizNameH1.innerHTML = quiz.childNodes[0].text; (fungerar IE)