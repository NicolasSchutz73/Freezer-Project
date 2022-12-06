<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet" type="text/css" href="<?php echo HOST_CSS . '/styleSearch.css'; ?>">
   <script src="https://kit.fontawesome.com/bb4997e1c6.js" crossorigin="anonymous"></script>
   <title>search bar</title>
</head>

<body>
   <div class="wrapSearch">
      <div class="search">
         <input type="text" class="searchTerm" placeholder="Recherche une musique, une playlist...">
         <button type="submit" class="searchButton">
            <i class="fa fa-search"></i>
         </button>
      </div>
   </div>

</body>
<script src="<?php echo HOST_JS . '/scriptSearch.js' ?>"></script>

</html>