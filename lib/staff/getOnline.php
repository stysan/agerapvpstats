<?php

include_once '../main.php';

$info = sendGenericRequest("staff/online");

exit($info);