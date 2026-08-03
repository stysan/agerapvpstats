<?php

include_once '../main.php';

$info = sendGenericRequest("core/online/total");

exit($info);