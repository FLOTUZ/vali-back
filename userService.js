//Librerias
const express = require("express");
const app = express();
//const faker = require("faker");

//Acceso a la BD
const db = require("./data/conector");

//Variables del servidor
const hostname = "127.0.0.1";
const port = "4000";

app.get("/users", (request, response) => {
    let acceso = false;

    let { correo, password } = request.query
    
    db.query(`select * from escuela.basico.users where correo = '${correo}'`, (error, results) => {
        if (error) {
            throw error;
        }
        //Si la contraseña de la bd es igual a la contraseña de la query
        if(results.rows[0].password === password){
            acceso = true;
            //Manda el correo como un json
            response.json({correo: results.rows[0].correo});
        }else{
            //Si algo está mal manda un mensaje
            response.json({message: "Revisa tus credenciales"})
        }
    });
});

app.post("/nuevoUsuario", (request, response) => {
    const { correo, password } = request.query

    //let correo = faker.internet.email();
    //let password = faker.random.word();

    db.query(
        `INSERT INTO escuela.basico.users (correo, password) VALUES ($1, $2)`,
        [correo, password],
        (error) => {
            if (error) {
                throw error;
            }
            response.status(201).end();

            console.log(request.query + " Dado de alta");
            //console.log(` {correo: ${correo}, password:${password}} dado de alta`);
        }
    );

});

app.get("/", (request, response) => {
    response.json({ info: "Api con node, express y postgresql" });
});

app.listen(port, hostname, () => {
    console.log(
        "El servidor esta escuchando en: http://" + hostname + ":" + port
    );
});
