"use strict";

//Statiskt objekt Quiz
var Quiz = {

    amountQCorrect: 0,

    a: 0,

    init: function () {

        //Hämtar klass för div "content" för att avgöra vilken XML-fil som ska läsas in
        var contentClass = document.getElementById("content").getAttribute("class");
        var url = "../XML/" + contentClass + ".xml";

        //Skapande av en ny AjaxCon-instans
        new AjaxCon(url, function (data) {

            var xmlDoc = data;

            //Hämtar klass för div "quiz" för att avgöra vilket quiz som ska läsas in
            var quizNo = document.getElementById("quiz").getAttribute("class");
            var quiz = xmlDoc.getElementsByTagName("quiz")[quizNo];

            Quiz.question(quiz);
        });
    },

    question: function (quiz) {

        //Läser in frågans nr samt antal frågor och skriver ut det i DOM:en
        var questionNoP = document.createElement("p");
        questionNoP.innerHTML = "Fråga " + (quiz.getElementsByTagName("questionno")[Quiz.a].textContent) + " av " + (quiz.getElementsByTagName("questions")[0].children.length);
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
                return false;
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
            return false;
        };
        answertext.appendChild(sourceP);
        answertext.appendChild(sourceLink);

        //Skriver ut div "answertext" i DOM:en
        document.getElementById("question").appendChild(answertext);

        //Tar bort frågetext och svarsalternativ
        var questionTextDiv = document.getElementById("questiontext");
        questionTextDiv.removeChild(document.querySelector("#questiontext p"));
        questionTextDiv.removeChild(document.getElementById("alternatives"));

        //Visar "Nästa"-knappen tills den sista frågan i xml-filen har nåtts, då div "quizendmenu" istället visas, och funktion "endmenu" anropas
        if (Quiz.a < (quiz.getElementsByTagName("questions")[0].children.length) - 1) {
            var nextButton = document.getElementById("nextbutton");
            nextButton.removeAttribute("class", "hidden");
            //Händelsehanterare kopplad till "Nästa"-knappen
            nextButton.onclick = function () {
                Quiz.next(quiz);
                return false;
            };
        } else {
            var contentClass = document.getElementById("content").getAttribute("class");
            var quizNo = document.getElementById("quiz").getAttribute("class");

            //Skickar klass för div content, klass för div quiz samt antal rätt till PHP-skript för att skriva detta till rätt quiz i rätt XML-fil
            var params = "contentClass=" + contentClass + "&quizNo=" + quizNo + "&amountCorrect=" + Quiz.amountQCorrect;

            var url = "../PHP/savestats.php?" + params;

            //Skapande av en ny AjaxCon-instans
            new AjaxCon(url, function (data) {
                document.getElementById("quizendmenu").removeAttribute("class", "hidden");
                Quiz.endmenu(quiz, contentClass, quizNo);
            });
        }
    },

    //Funktion som anropas när "Nästa"-knappen klickats på
    next: function (quiz) {

        //Döljer "Nästa"-knappen
        document.getElementById("nextbutton").setAttribute("class", "hidden");

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
    },

    //Funktion som anropas när sista frågan i XML-filen har besvarats
    endmenu: function (quiz, contentClass, quizNo) {
        var commentDiv = document.getElementById("commentdiv"), ratingDiv = document.getElementById("ratingdiv"), statDiv = document.getElementById("statdiv"),
        commentButton = document.getElementById("commentbutton"), ratingButton = document.getElementById("ratingbutton"), statButton = document.getElementById("statbutton"),
        updateButton = document.getElementById("updatebutton");

        //Funktion som visar kommentarer och formulär för att skriva en ny kommentar
        var showComments = function (e) {
            e.preventDefault();
            var comAcc = document.getElementById("comaccepted");
            var comValP = document.getElementById("comvalp");

            if (ratingDiv.getAttribute("class") !== "hidden") {
                ratingDiv.setAttribute("class", "hidden")
            } if (statDiv.getAttribute("class") !== "hidden") {
                statDiv.setAttribute("class", "hidden");
            } if (comAcc.getAttribute("class") !== "hidden") {
                comAcc.setAttribute("class", "hidden")
            } if (comValP.getAttribute("class") !== "hidden") {
                comValP.setAttribute("class", "hidden")
            }
            commentDiv.removeAttribute("class", "hidden");

            var i, comments = quiz.getElementsByTagName("comments")[0], dl = document.getElementById("commentsdl"),
            noCommentsP = document.getElementById("nocommentsp"), commentForm = document.getElementById("commentform"),
            commentSubmit = document.getElementById("commentsubmit");

            //Skriver ut "Inga kommentarer" om det inte finns några kommentarer i XML-filen
            if (comments.children.length === 0) {
                commentDiv.removeChild(noCommentsP);
                var newNoCommentsP = document.createElement("p");
                newNoCommentsP.setAttribute("id", "nocommentsp");
                newNoCommentsP.innerHTML = "Inga kommentarer.";
                commentDiv.appendChild(newNoCommentsP);
                //Läser in kommentarstext och namn på kommenterare från XML-filen och skriver ut i en lista i DOM:en
            } else {
                commentDiv.removeChild(dl);
                var newDL = document.createElement("dl");
                newDL.setAttribute("id", "commentsdl");
                for (i = 0; i < comments.children.length; i += 1) {
                    var ddText = document.createElement("dd"), dtName = document.createElement("dt");
                    ddText.innerHTML = comments.getElementsByTagName("comment")[i].children[0].textContent;
                    dtName.innerHTML = comments.getElementsByTagName("comment")[i].children[1].textContent;
                    dtName.appendChild(ddText);
                    newDL.appendChild(dtName);
                }
                commentDiv.appendChild(newDL);
            }

            //Händelsehanterare kopplad till "click" för "Skicka"-knappen
            commentSubmit.onclick = function (e) {
                Quiz.submitComment(contentClass, quizNo, commentDiv, commentSubmit, comValP);
                return false;
            };
        };
        //Händelsehanterare kopplad till "click" för "Kommentarer"-knappen
        commentButton.addEventListener("click", showComments, false);


        //Funktion som visar betyg samt formulär för att skicka in nytt betyg
        var showRating = function (e) {
            e.preventDefault();
            var valP = document.getElementById("valp");

            if (commentDiv.getAttribute("class") !== "hidden") {
                commentDiv.setAttribute("class", "hidden")
            } if (statDiv.getAttribute("class") !== "hidden") {
                statDiv.setAttribute("class", "hidden");
            } if (valP.getAttribute("class") !== "hidden") {
                valP.setAttribute("class", "hidden");
            }
            ratingDiv.removeAttribute("class", "hidden");

            var i, j, ratings = quiz.getElementsByTagName("ratings")[0], ratingAmountVotesArray = [], totalAmountVotesArray = [],
            ratingAmountSum = 0, totalAmountSum = 0, ratingP = document.getElementById("ratingp"),
            ratingSubmit = document.getElementById("ratingsubmit");

            //Räknar ut betyg/"weighted average" för quizzet och skriver ut det i DOM:en
            //http://stackoverflow.com/questions/10196579/algorithm-used-to-calculate-5-star-ratings
            for (i = 0; i < ratings.children.length; i += 1) {
                var ratingAmountVotes = parseInt(ratings.getElementsByTagName("rating")[i].textContent);
                ratingAmountVotesArray.push([i + 1] * ratingAmountVotes);
                ratingAmountSum += ratingAmountVotesArray[i];
            }

            for (j = 0; j < ratings.children.length; j += 1) {
                var amountVotes = parseInt(ratings.getElementsByTagName("rating")[j].textContent);
                totalAmountVotesArray.push(amountVotes);
                totalAmountSum += totalAmountVotesArray[j];
            }
            var totalRating = ratingAmountSum / totalAmountSum;

            ratingDiv.removeChild(ratingP);
            var newRatingP = document.createElement("p");
            newRatingP.setAttribute("id", "ratingp");
            newRatingP.innerHTML = "Detta quiz har betyg: " + Math.round(totalRating);
            ratingDiv.insertBefore(newRatingP, document.getElementById("ratingform"));

            //Händelsehanterare kopplad till "click" för "Skicka"-knappen
            ratingSubmit.onclick = function (e) {
                Quiz.submitRating(contentClass, quizNo, ratingDiv, ratingSubmit, valP);
                return false;
            };
        };
        //Händelsehanterare kopplad till "click" för "Betygsätt"-knappen
        ratingButton.addEventListener("click", showRating, false);


        //Funktion som visar statistik för quizzet
        var showStats = function (e) {
            e.preventDefault();

            if (commentDiv.getAttribute("class") !== "hidden") {
                commentDiv.setAttribute("class", "hidden");
            } if (ratingDiv.getAttribute("class") !== "hidden") {
                ratingDiv.setAttribute("class", "hidden");
            }
            statDiv.removeAttribute("class", "hidden");

            var p = document.getElementById("statsp"), ul = document.getElementById("statsul");
            statDiv.removeChild(p);
            statDiv.removeChild(ul);

            //Läser in antal gånger quizzet har spelats från XML-filen och skriver ut det i DOM:en
            var newP = document.createElement("p");
            newP.setAttribute("id", "statsp");
            newP.innerHTML = "Antal gånger detta quiz har spelats: " + quiz.getElementsByTagName("timesplayed")[0].textContent;
            statDiv.appendChild(newP);

            //Läser in antal som har haft x rätt från XML-filen och skriver ut det i DOM:en
            var i, newUl = document.createElement("ul"), zeroLi = document.createElement("li"),
            timesXCorrectCount = quiz.getElementsByTagName("timesxcorrectcount")[0];
            newUl.setAttribute("id", "statsul");
            zeroLi.innerHTML = "Antal som har haft 0 rätt: " + quiz.getElementsByTagName("times0correct")[0].textContent;
            newUl.appendChild(zeroLi);

            for (i = 0; i < timesXCorrectCount.children.length; i += 1) {
                var li = document.createElement("li");
                var amount = timesXCorrectCount.getElementsByTagName("timesxcorrect")[i].textContent;
                li.innerHTML = "Antal som har haft " + (i + 1) + " rätt: " + amount;
                newUl.appendChild(li);
            }
            statDiv.appendChild(newUl);
        };
        //Händelsehanterare kopplad till "click" för "Statistik"-knappen
        statButton.addEventListener("click", showStats, false);

        updateButton.onclick = function (e) {
            Quiz.updateComments(contentClass, quizNo);
            return false;
        };
    },

    //Funktion som skickar kommentar och kommenterare till PHP-skript "savecomments" för att skriva dem till XML-filen
    submitComment: function (contentClass, quizNo, commentDiv, commentSubmit, comValP) {

        var comAccP = document.getElementById("comaccepted"), comment = document.getElementById("comment").value,
        userName = document.getElementById("username").value;
        var params = "contentClass=" + contentClass + "&quizNo=" + quizNo + "&comment=" + comment + "&userName=" + userName;
        var url = "../PHP/savecomments.php?" + params;

        if (comment.length === 0 || userName.length === 0) {
            if (comValP.getAttribute("class") === "hidden") {
                comValP.removeAttribute("class", "hidden");
            }
        } else {
            commentSubmit.disabled = true;
            commentSubmit.removeAttribute("class", "formbutton");
            commentSubmit.setAttribute("class", "transparent");

            new AjaxCon(url, function (data) {
                if (comValP.getAttribute("class") !== "hidden") {
                    comValP.setAttribute("class", "hidden");
                }
                comAccP.removeAttribute("class", "hidden");
                commentSubmit.disabled = false;
                commentSubmit.removeAttribute("class", "transparent");
                commentSubmit.setAttribute("class", "formbutton");
            });
        }
    },

    //Funktion som skickar betyg till PHP-skript "saverating" för att skriva det till XML-filen
    submitRating: function (contentClass, quizNo, ratingDiv, ratingSubmit, valP) {

        var i, ratingValue, rating = document.getElementById("ratingform").elements["rating"], one = document.getElementById("one"),
        two = document.getElementById("two"), three = document.getElementById("three"), four = document.getElementById("four"),
        five = document.getElementById("five");

        //Kontrollerar att ett alternativ har valts (http://stackoverflow.com/questions/1423777/javascript-how-can-i-check-whether-a-radio-button-is-selected)
        //samt hämtar värdet från den valda radioknappen (http://stackoverflow.com/questions/15839169/how-to-get-value-of-selected-radio-button)
        if (one.checked || two.checked || three.checked || four.checked || five.checked) {
            for (i = 0; i < rating.length; i += 1) {
                if (rating[i].checked) {
                    ratingValue = rating[i].value;
                }
            }

            var params = "contentClass=" + contentClass + "&quizNo=" + quizNo + "&ratingValue=" + ratingValue;
            var url = "../PHP/saverating.php?" + params;

            //Skickar betyget till PHP-skriptet, skriver ut att betyg har tagits emot, avaktiverar "Skicka"-knappen och gör den transparent
            new AjaxCon(url, function (data) {
                if (valP.getAttribute("class") !== "hidden") {
                    valP.setAttribute("class", "hidden");
                }
                var p = document.createElement("p");
                p.innerHTML = "Ditt betyg har tagits emot.";
                ratingDiv.appendChild(p);
                ratingSubmit.disabled = true;
                ratingSubmit.removeAttribute("class", "formbutton");
                ratingSubmit.setAttribute("class", "transparent");
            });
            //Visar "Du måste välja ett av betygsalternativen" om inget alternativ har valts
        } else {
            if (valP.getAttribute("class") === "hidden") {
                valP.removeAttribute("class", "hidden");
            }
        }
    },

    updateComments: function (contentClass, quizNo) {

        var url = "../XML/" + contentClass + ".xml";

        //Skapande av en ny AjaxCon-instans
        new AjaxCon(url, function (data) {

            var xmlDoc = data;

            var quiz = xmlDoc.getElementsByTagName("quiz")[quizNo];

            Quiz.endmenu(quiz, contentClass, quizNo);
        });
    }
};

window.onload = Quiz.init;