<?php
//H�mtar och validerar variablerna som skickats fr�n Javascript "quizpage"
//(http://stackoverflow.com/questions/381265/better-way-to-check-variable-for-null-or-empty-string)
//(http://stackoverflow.com/questions/11034058/strlen-and-utf-8-encoding)
//(http://stackoverflow.com/questions/4575150/textarea-character-limit-by-javascript-php)

$trimComment = trim($_GET["comment"]);
$trimComment2 = str_replace("\r\n", "\n", $trimComment);
$trimComment3 = str_replace("\r", "\n", $trimComment2);
$trimUserName = trim($_GET["userName"]);

if(!isset($_GET["contentClass"]) || empty($_GET["contentClass"])){
	exit();
}else {
	$contentClass = (string)$_GET["contentClass"];
}if(!isset($_GET["quizNo"]) || $_GET["quizNo"] === ""){
	exit();
}else {
	$quizNo = (int)$_GET["quizNo"];
}if(!isset($trimComment3) || $trimComment3 === "" || mb_strlen($trimComment3, "UTF-8") > 500){
	exit();
}else {
	$comment = (string)$trimComment3;
}if(!isset($trimUserName) || $trimUserName === "" || mb_strlen($trimUserName, "UTF-8") > 25){
	exit();
}else {
	$userName = (string)$trimUserName;
}

if($quizNo >= 0){
	//Laddar XML-filen
	$file = "../XML/" . $contentClass . ".xml";
	$quizzes = simplexml_load_file($file);
	$quiz = $quizzes->quiz[$quizNo];

	//L�gger till ny kommentar (kommentarstext och kommenterare) i XML-filen
	//(http://www.php.net/manual/en/simplexmlelement.addchild.php)
	$newComment = $quiz->comments[0]->addChild("comment");
	$newComment->addChild("commenttext", $comment);
	$newComment->addChild("commenter", $userName);

	//Sparar XML-filen
	$quizzes->saveXML($file);
}
?>