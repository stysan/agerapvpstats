<?php

include_once '../main.php';

if (!isset($_GET['mode'])) {
    die('Необходим параметр режима');
}

if (!isset($_GET['field'])) {
    die('Необходим параметр поля');
}

$mode = $_GET['mode'];
$field = $_GET['field'];

$info = sendGenericRequest("core/top/$mode/$field");

exit($info);