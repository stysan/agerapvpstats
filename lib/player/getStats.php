<?php

include_once '../main.php';

if (!isset($_GET['name'])) {
    die('Необходим параметр игрока');
}

if (!isset($_GET['mode'])) {
    die('Необходим параметр режима');
}

$name = $_GET['name'];
$mode = $_GET['mode'];

$info = sendGenericRequest("player/stats/$name/$mode");

exit($info);