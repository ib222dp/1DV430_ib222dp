<?php
//H�mtar variablerna som skickats fr�n Javascript "quizpage"
if(isset($_GET["contentClass"])){
	$contentClass = (string)$_GET["contentClass"];
}if(isset($_GET["quizNo"])){
	$quizNo = (int)$_GET["quizNo"];
}if(isset($_GET["ratingValue"])){
	$ratingValue = (int)$_GET["ratingValue"];
}

//Laddar XML-filen
$file = "../XML/" . $contentClass . ".xml";
$quizzes = simplexml_load_file($file);
$quiz = $quizzes->quiz[$quizNo];

if($ratingValue > 0 && $ratingValue < 6 ){
	//�kar antalet g�nger quizzet har f�tt x("ratingValue") som betyg med 1
	$oldTimesRating = (int)$quiz->ratings[0]->rating[$ratingValue-1];
	$newTimesRating = ++$oldTimesRating;
	$quiz->ratings[0]->rating[$ratingValue-1] = $newTimesRating;

	//Sparar XML-filen
	$quizzes->saveXML($file);
}
?>