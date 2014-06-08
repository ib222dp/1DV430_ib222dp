"use strict";

//Konstruktor för att läsa in XML-fil eller skicka variabler till PHP-skript via AJAX
//(http://stackoverflow.com/questions/22495746/using-javascript-to-show-xml-info-in-html-webpage?rq=1)
//(http://stackoverflow.com/questions/1917576/how-to-pass-javascript-variables-to-php)
//(http://stackoverflow.com/questions/1600360/passing-multiple-parameter-to-php-from-javascript)
function AjaxCon(url, callback) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                if (url.slice(-4) === ".xml") {
                    callback(xhr.responseXML);
                } else {
                    callback(xhr.responseText);
                }
            } else {
                console.log("Läsfel, status: " + xhr.status);
            }
        }
    };

    if (url.slice(-4) === ".xml") {
        //Lägger till datum och tid till query-string för att se till att XML-filen verkligen läses in på nytt 
        //(http://www.newgrounds.com/bbs/topic/1095281)
        xhr.open("get", url + "?nocache=" + new Date().getTime(), true);
    } else {
        xhr.open("get", url, true);
    }

    xhr.send(null);
};