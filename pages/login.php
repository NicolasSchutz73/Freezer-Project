<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Freezer Music Player</title>
    <link rel="stylesheet" href="../style/style_login_register.css">
</head>


<body>

    <div class="wrapper">
        <div class="inner-container">
            <form action='../config/testLogin.php' method='post' class="box">
                <h1>Login</h1>
                <input type="text" name='login' placeholder='Username' autofocus pattern='[a-z]{2,20}' title='Entre 2 et 20 minuscules' maxlength=20 />
                <input type='password' name='pwd' placeholder='Mot de passe' pattern='.{6,100}' title='Entre 6 et 100 caractères' maxlength=100 />
                <button>Login</button>
                <p>Pas de compte ? <a href='register.php'>S'inscrire</a></p>
        </div>
    </div>
    </div>

</body>

</html>