<?php

include_once '../main.php';

if (!isset($_GET['name'])) {
    die('Необходим параметр игрока');
}

$name = $_GET['name'];

$info = sendGenericRequest("player/friends/$name");

exit($info);