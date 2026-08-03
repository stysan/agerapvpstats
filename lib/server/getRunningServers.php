<?php

include_once '../main.php';

if (!isset($_GET['mode'])) {
    $info = sendGenericRequest("server/running");   
} else {
    $mode = $_GET['mode'];
    $info = sendGenericRequest("server/running/$mode");
}

exit($info);