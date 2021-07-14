<?php
require_once __DIR__ . "/vendor/autoload.php";

if (isset($_GET['seed']))
    $seed = (int)$_GET['seed'];
else
    $seed = time();
$array = scandir(__DIR__ . "/playlist");
$return = ["audio" => [], "offset" => 0, "count" => 0];
unset($array[0]);
unset($array[1]);
seededShuffle($array, $seed);
if (isset($_GET['offset'])) {
    $offset = $_GET['offset'];
    if ($offset < 0 or $offset >= count($array))
        die("error");
} else
    $offset = 0;

$getID3 = new getID3;
$tags = $getID3->analyze("playlist/$array[$offset]");
$return['audio'] = [
    "track" => $array[$offset],
    "tags" => $tags['tags']['id3v2']
];
$return['count'] = count($array);
$return['offset'] = $offset;
header("Cache-Control", "max-age=44640");
echo json_encode($return);

function seededShuffle(array &$array, int $seed)
{
    mt_srand($seed);
    sort($array);
    for ($i = 0; $i < count($array); $i++) {
        $rand = mt_rand(0, count($array) - 1);
        $temp = $array[$rand];
        $array[$rand] = $array[$i];
        $array[$i] = $temp;
    }
}
