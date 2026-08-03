<?php

include_once '../main.php';

if (!isset($_GET['name'])) {
    die('Player parameter is required');
}

$name = $_GET['name'];

$info = sendGenericRequest("player/profile/$name");

exit($info);