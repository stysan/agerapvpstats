<?php

include_once '../main.php';

if (!isset($_GET['mode'])) {
    die('Необходим параметр режима');
}

$mode = $_GET['mode'];

$info = sendGenericRequest("server/maps/by-mode/$mode");

exit($info);