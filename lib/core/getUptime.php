<?php

include_once '../main.php';

$info = sendGenericRequest("core/uptime");

exit($info);