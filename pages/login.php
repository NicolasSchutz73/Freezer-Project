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
    <div class='wrapper'>
        <h1>Connection</h1>
        <section>
            <form action='../config/testLogin.php' method='post'>
                <div>
                    <input type='text' name='login' placeholder='Login' autofocus pattern='[a-z]{2,20}' title='Entre 2 et 20 minuscules' maxlength=20>
                </div>
                <div>
                    <input type='password' name='pwd' placeholder='Mot de passe' pattern='.{6,100}' title='Entre 6 et 100 caractères' maxlength=100>
                </div>
                <input type='submit' value='Connection' id="send">
            </form>
            <p>Pas de compte ? <a href='register.php'>S'inscrire</a></p>
        </section>
    </div>

</body>

</html>