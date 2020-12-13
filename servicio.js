const express = require("express");
const app = express();
const path = require('path');

const hostname = "127.0.0.1";
const port = "4000";

let usuarios = [
    { user: "Emmanuel", password: "papaya" },
    { user: "Hermes", password: "h3rm35" },
    { user: "Luisa", password: "lu15a" },
];

app.get("/login", function (req, res) {
    //Se obtienen las variables del query URL
    let user = req.query.user;
    let pas = req.query.password;

    console.log(req.query);
    let userExiste = false;
    //Se busca en la BD, si existe le de da la bienvenida

    usuarios.find((i) => {

        if (i.user == user && i.password == pas) {
            userExiste = true;
            console.log(__dirname + "/login.html");
            //res.sendFile(path.join(__dirname + "/login.html"));
            res.send(
            `<h1>Hola ${i.user} te haz logeado satisfactoriamente</h1> <a href="http://localhost:3000/"> Regresar</a>`
            );
            console.log('Ingresó -->' + i.user);
            res.end();
        }
    });

    if (!userExiste) {
        //Si no existe le respondemos asì
        console.log('Login fallido');
        //res.sendFile(__dirname + "/failedLogin.html");
        res.send(`<h1>El usuario no existe o usaste una contraseña incorrecta</h1> <a href="http://localhost:3000/"> Regresar</a>`);
        res.end();
    }

});

app.listen(port, hostname, () => {
    console.log(
        "El servidor esta escuchando en: http://" + hostname + ":" + port
    );
});
