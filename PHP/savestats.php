<?php

//(http://runnable.com/UnQMA-VaS1tAAABz/how-to-add-and-edit-elements-to-a-xml-using-simplexml-for-php)
//(http://stackoverflow.com/questions/1133931/getting-actual-value-from-php-simplexml-node)

//H�mtar variablerna som skickats fr�n Javascript "quizpage"
if(isset($_GET["contentClass"])){
	$contentClass = (string)$_GET["contentClass"];
}if(isset($_GET["quizNo"])){
	$quizNo = (int)$_GET["quizNo"];
}if(isset($_GET["amountCorrect"])){
	$amountCorrect = (int)$_GET["amountCorrect"];
}

//Laddar XML-filen
$file = "../XML/" . $contentClass . ".xml";
$quizzes = simplexml_load_file($file);
$quiz = $quizzes->quiz[$quizNo];

//�kar "timesplayed" med 1
$oldTimesPlayed = (int)$quiz->timesplayed[0];
$newTimesPlayed = ++$oldTimesPlayed;
$quiz->timesplayed[0] = $newTimesPlayed;

//�kar "times0correct" eller "timesxcorrect" med 1
if($amountCorrect == 0){
	$oldTimes0Correct = (int)$quiz->times0correct[0];
	$newTimes0Correct = ++$oldTimes0Correct;
	$quiz->times0correct[0] = $newTimes0Correct;
}else{
	$oldTimesXCorrect = (int)$quiz->timesxcorrectcount[0]->timesxcorrect[$amountCorrect - 1];
	$newTimesXCorrect = ++$oldTimesXCorrect;
	$quiz->timesxcorrectcount[0]->timesxcorrect[$amountCorrect - 1] = $newTimesXCorrect;
}

//Sparar XML-filen
$quizzes->saveXML($file);
?>
