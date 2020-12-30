//Librerias
//const faker = require("faker");
const express = require("express");
const app = express();
const cors = require("cors");

//Acceso a la BD
const db = require("./data/conector");

//Variables del servidor
const hostname = "127.0.0.1";
const port = "4000";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // If needed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  ); // If needed
  res.setHeader("Access-Control-Allow-Credentials", false); // If needed
  next();
});

//Se retorna el usuario si la contraseña es correcta
app.post("/login", (request, response) => {
  //El acceso a el sistema por defecto es falso
  let acceso = false;

  //Se desencryptan los datos con la llave maestra
  let bytes = Cryptojs.AES.decrypt(request.query[0], "5i5t3m45");
  let datos = bytes.toString(Cryptojs.enc.Utf8);

  //Se transforma el string a JSON
  datos = JSON.parse(datos);
  //vaciamos lo que hay en el objeto datos
  let { correo, password } = datos;

  //Se ejecuta el query
  db.query(
    `select * from escuela.basico.users where correo = '${correo}'`,
    (error, results) => {
      //Si hay error en la BD
      if (error) {
        throw error;
      }
      //Si me mandan datos vacios
      if (results.rows.length === 0) {
        response.json({
          message: "Ingrese los datos a validar",
        });
      } else {
        //Si la contraseña de la bd es igual a la contraseña de la query
        if (results.rows[0].password === password) {
          acceso = true;
          //Manda el correo como un json
          console.log("ingresó un usuario");
          response.json({
            access: acceso,
            correo: results.rows[0].correo,
          });
        } else {
          console.log("Un usuario intentó ingresar");

          //Si algo está mal manda un mensaje
          response.json({
            message: "Revisa tus credenciales",
            access: acceso,
          });
        }
      }
    }
  );
});

app.post("/nuevoUsuario", (request, response) => {
  const { correo, password } = request.query;

  //let correo = faker.internet.email();
  //let password = faker.random.word();

  //Para dar de alta un usuario
  db.query(
    `INSERT INTO escuela.basico.users (correo, password) VALUES ($1, $2)`,
    [correo, password],
    (error) => {
      if (error) {
        console.error(error);
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
