<?php

include_once '../main.php';

$info = sendGenericRequest("staff/stats");

exit($info);