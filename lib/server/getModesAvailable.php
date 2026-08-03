<?php

include_once '../main.php';

$info = sendGenericRequest("server/modes/available");

exit($info);