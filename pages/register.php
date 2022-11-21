<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <title>Freezer</title>
    <link rel="stylesheet" href="../style/style_login_register.css">
</head>

<body>
    <div class='wrapper'>
        <h1>Inscription</h1>
        <section>
            <form action='inscriptionBd.php' method='post'>
                <input type='text' name='login' placeholder='Login' autofocus pattern='[a-z]{2,20}' title='Entre 2 et 20 minuscules' maxlength=20>
                <input type='text' name='email' placeholder='Email' autofocus pattern='[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z.]{2,15}' maxlength=50>
                <div class="birthDate">
                    <label for="birth">Date de naissance :</label>
                    <input type='date' name='birth' id="birth">
                </div>
                <input type='password' name='pwd' placeholder='Mot de passe' pattern='{6,100}' title='Entre 6 et 100 caractères' maxlength=100>
                <input type='password' name='pwdConfirm' placeholder='Confirmation' title='Entre 6 et 100 caractères' maxlength=100 id="pwdConfirm">
                <input type='submit' value='Inscription' id="send">
            </form>
            <p>Déjà un compte ? <a href='login.php'>Se connecter</a></p>
        </section>
    </div>


</body>

</html>