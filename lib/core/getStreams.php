<?php

include_once '../main.php';

$info = sendGenericRequest("core/streams");

exit($info);