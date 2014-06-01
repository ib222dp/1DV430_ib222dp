<?php
//H�mtar variablerna som skickats fr�n Javascript "quizpage"
if(!isset($_GET["contentClass"]) || empty($_GET["contentClass"])){
	exit();
}else {
	$contentClass = (string)$_GET["contentClass"];
}if(!isset($_GET["quizNo"]) || $_GET["quizNo"] === ""){
	exit();
}else {
	$quizNo = (int)$_GET["quizNo"];
}if(!isset($_GET["ratingValue"]) || $_GET["ratingValue"] === ""){
	exit();
}else{
	$ratingValue = (int)$_GET["ratingValue"];
}

if($quizNo >= 0 && $ratingValue > 0 && $ratingValue < 6 ){
	//Laddar XML-filen
	$file = "../XML/" . $contentClass . ".xml";
	$quizzes = simplexml_load_file($file);
	$quiz = $quizzes->quiz[$quizNo];

	//�kar antalet g�nger quizzet har f�tt x("ratingValue") som betyg med 1
	$oldTimesRating = (int)$quiz->ratings[0]->rating[$ratingValue-1];
	$newTimesRating = ++$oldTimesRating;
	$quiz->ratings[0]->rating[$ratingValue-1] = $newTimesRating;

	//Sparar XML-filen
	$quizzes->saveXML($file);
}
?>