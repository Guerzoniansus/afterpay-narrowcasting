<?php

?>
<html> 
<head>
<!-- dit is het nu.nl algemeen rss nieuws omgezet via een site -->
</head>
<div class="news">
    <?php
    include("https://rss.bloople.net/?url=https%3A%2F%2Fwww.nu.nl%2Frss%2FAlgemeen&showtitle=true");
    ?>
</div>
<!-- style van de nieuws widget achtergrond(licht grijze tint) -->
<style>
.news {
    max-height: 95%;
    padding: 35px;
    height: 99%;
    width: 99%;
    overflow: hidden;
    background-color: rgba(77,167,122,0.05);
}
/* style van de title per item */
.feed-item-title a{

}
/* style van de beschrijving per item */
.feed-item-desc {
    color: black;
    font-size: 22px;
}
</style> 

<script>
    $(document).ready(function(){
        loadnews();
        setInterval(loadnews,5000);
    });
    function loadnews(){
        $('news').load("widgets/nieuws/Nieuws.php");
    }
</script>
