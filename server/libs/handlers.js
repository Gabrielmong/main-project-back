// request handlers

//dependencies
const oracledb = require("oracledb");
const fs = require("fs");
const dbconfig = require("./dbconfig.js");
const { password } = require("./dbconfig.js");
const libPath = "C:\\oracle\\instantclient_21_6";

if (libPath && fs.existsSync(libPath)) {
  oracledb.initOracleClient({ libDir: libPath });
}

// Define all handlers
const handlers = {};

handlers.userCrud = function (req, res) {
  const acceptableMethods = ["POST", "GET", "PUT", "DELETE"];
  if (acceptableMethods.indexOf(req.method) > -1) {
    handlers._userCrud[req.method](req, res);
  } else {
    res(405);
  }
};

handlers._userCrud = {};

handlers._userCrud.POST = async function (req, res) {
  console.log
  var userName =
    typeof req.body.userName == "string" &&
    req.body.userName.trim().length > 0
      ? req.body.userName.trim()
      : false;
  var password =
    typeof req.body.password == "string" &&
    req.body.password.trim().length > 0
      ? req.body.password.trim()
      : false;
  var nombre =
    typeof req.body.nombre == "string" &&
    req.body.nombre.trim().length > 0
      ? req.body.nombre.trim()
      : false;
  var apellido =
    typeof req.body.apellido == "string" &&
    req.body.apellido.trim().length > 0
      ? req.body.apellido.trim()
      : false;
  var correo =
    typeof req.body.correo == "string" &&
    req.body.correo.trim().length > 0
      ? req.body.correo.trim()
      : false;
  var telefono =
    typeof req.body.telefono == "string" &&
    req.body.telefono.trim().length > 0
      ? req.body.telefono.trim()
      : false;
  if (nombre && apellido && correo && telefono && userName && password) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var statement = `addUser ('${nombre}', '${password}', '${userName}', '${apellido}', '${correo}', '${telefono}');`;
      await connection.execute(
        `BEGIN
          ${statement}
         END;`
      );
      console.log("User created.");
      res.send("User added!");
    } catch (err) {
      console.error(err);
      res.send("Could not add to the DB");
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    res.send("Missing required fields");
  }
};

handlers._userCrud.GET = async function (req, res) {
  var userName =
    typeof req.query.userName == "string" &&
    req.query.userName.trim().length > 0
      ? req.query.userName.trim()
      : false;
  var password =
    typeof req.query.password == "string" &&
    req.query.password.trim().length > 0
      ? req.query.password.trim()
      : false;

  if (userName && password) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      // Por la forma en que oracle retorna resultados de un stored procedure, no se puede extraer los rows
      var statement = `select * from USUARIO where userName = '${userName}' and userPassword = '${password}'`;
      var result = await connection.execute(`${statement}`);
      await connection.commit();
      if (result.rows.length > 0) {
        console.log("User fetched.");
        res.send(result.rows);

      } else {
        res.send("User not found");
      }
    } catch (err) {
      console.error(err);
      res.send("Could not get from the DB");
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    res.send("Missing required fields");
  }
};

handlers._userCrud.PUT = async function (req, res) {
  var indUser =
    typeof req.body.indUser == "string" &&
    req.body.indUser.trim().length > 0
      ? req.body.indUser.trim()
      : false;
  var indPassword =
    typeof req.body.indPassword == "string" &&
    req.body.indPassword.trim().length > 0
      ? req.body.indPassword.trim()
      : false;
  var userName =
    typeof req.body.userName == "string" &&
    req.body.userName.trim().length > 0
      ? req.body.userName.trim()
      : false;
  var password =
    typeof req.body.password == "string" &&
    req.body.password.trim().length > 0
      ? req.body.password.trim()
      : false;
  var nombre =
    typeof req.body.nombre == "string" &&
    req.body.nombre.trim().length > 0
      ? req.body.nombre.trim()
      : false;
  var apellido =
    typeof req.body.apellido == "string" &&
    req.body.apellido.trim().length > 0
      ? req.body.apellido.trim()
      : false;
  var correo =
    typeof req.body.correo == "string" &&
    req.body.correo.trim().length > 0
      ? req.body.correo.trim()
      : false;
  var telefono =
    typeof req.body.telefono == "string" &&
    req.body.telefono.trim().length > 0
      ? req.body.telefono.trim()
      : false;
  if (indUser && indPassword && userName && password && nombre && apellido && correo && telefono) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);

      // Se puede hacer en stored
      var statement = `alterUser('${indUser}', '${indPassword}', '${userName}','${nombre}', '${password}', '${apellido}', '${correo}', '${telefono}')`;
      await connection.execute(
        `BEGIN
          ${statement};
        END;`
      );
      console.log("User updated.");
      res.send("User updated!");
    } catch (err) {
      console.error(err);
      res.send("Could not update in the DB");
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    res.send("Missing required fields");
  }
};

handlers._userCrud.DELETE = async function (req, res) {
  var nombre =
    typeof req.body.nombre == "string" &&
    req.body.nombre.trim().length > 0
      ? req.body.nombre.trim()
      : false;
  var apellido =
    typeof req.body.apellido == "string" &&
    req.body.apellido.trim().length > 0
      ? req.body.apellido.trim()
      : false;
  if (nombre && apellido) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var statement = `deleteUser('${nombre}', '${apellido}')`;
      await connection.execute(
        `BEGIN
          ${statement};
        END;`
      );
      await connection.commit();
      console.log("User deleted.");
      res("User deleted!");
    } catch (err) {
      console.error(err);
      res("Could not delete from the DB");
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    res("Missing required fields");
  }
};

handlers.crudReviews = function (req, res) {
  var acceptableMethods = ["POST", "GET", "PUT", "DELETE"];
  if (acceptableMethods.indexOf(req.method) > -1) {
    handlers._crudReviews[req.method](req, res);
  } else {
    res.send(res.status);
  }
};

handlers._crudReviews = {};

handlers._crudReviews.POST = async function (req, res) {
  var restaurante =
    typeof req.body.restaurante == "string" &&
    req.body.restaurante.trim().length > 0
      ? req.body.restaurante.trim()
      : false;
  var usuario =
    typeof req.body.usuario == "string" &&
    req.body.usuario.trim().length > 0
      ? req.body.usuario.trim()
      : false;
  var rating =
    typeof req.body.rating == "number" &&
    req.body.rating % 1 === 0 &&
    req.body.rating >= 0
      ? req.body.rating
      : false;
  var review =
    typeof req.body.review == "string" &&
    req.body.review.trim().length > 0
      ? req.body.review.trim()
      : false;
  var ubicacion =
    typeof req.body.ubicacion == "string" &&
    req.body.ubicacion.trim().length > 0
      ? req.body.ubicacion.trim()
      : false;
  var created =
    typeof req.body.created == "string" &&
    req.body.created.trim().length > 0
      ? req.body.created.trim()
      : false;

  var fileName = 
    typeof req.body.fileName == "string" &&
    req.body.fileName.trim().length > 0
      ? req.body.fileName.trim()
      : false;
  if (restaurante && usuario && rating && review && ubicacion && created) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var statement = `insertReview('${restaurante}', '${usuario}', ${rating}, '${review}', TO_DATE('${created}','YYYY-MM-DD'), '${ubicacion}', '${fileName}')`;
      await connection.execute(
        `BEGIN
          ${statement};
        END;`
      );
      await connection.commit();
      console.log("Review created.");
      res.send("Review created!");
    } catch (err) {
      console.error(err);
      res.send("Could not insert in the DB");
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    res.send("Missing required fields");
  }
};

handlers._crudReviews.GET = async function (req, res) {
  var connection;
  try {
    connection = await oracledb.getConnection(dbconfig);
    var statement = `SELECT * FROM REVIEW`;
    var result = await connection.execute(statement);
    console.log("Reviews retrieved.");
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.send();
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

handlers.loneReview = function (req, res) {
  var acceptableMethods = ["GET", "PUT", "DELETE"];
  if (acceptableMethods.indexOf(req.method) > -1) {
    handlers._loneReview[req.method](req, res);
  } else {
    res.send(405);
  }
};

handlers._loneReview = {};

handlers._loneReview.GET = async function (req, res) {
  id = req.query.id;
  if (id) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var statement = `SELECT * FROM REVIEW WHERE ID_REVIEW = ${id}`;
      var result = await connection.execute(statement);
      console.log("Single review fetched.");
      res.send(result.rows);
    } catch (err) {
      console.error(err);
      res.send("Could not get from the DB");
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
};

handlers._loneReview.PUT = async function (req, res) {
  var restaurante =
    typeof req.payload.restaurante == "string" &&
    req.payload.restaurante.trim().length > 0
      ? req.payload.restaurante.trim()
      : false;
  var usuario =
    typeof req.payload.usuario == "string" &&
    req.payload.usuario.trim().length > 0
      ? req.payload.usuario.trim()
      : false;  
  var rating =
    typeof req.payload.rating == "number" &&
    req.payload.rating % 1 === 0 &&
    req.payload.rating >= 0
      ? req.payload.rating
      : false;
  var review =
    typeof req.payload.review == "string" &&
    req.payload.review.trim().length > 0
      ? req.payload.review.trim()
      : false;
  var ubicacion =
    typeof req.payload.ubicacion == "string" &&
    req.payload.ubicacion.trim().length > 0
      ? req.payload.ubicacion.trim()
      : false;
  var created =
    typeof req.payload.created == "string" &&
    req.payload.created.trim().length > 0
      ? req.payload.created.trim()
      : false;

  if (id && restaurante && usuario && rating && review && ubicacion && created) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var statement = `UPDATE REVIEW SET RESTAURANTE = '${restaurante}', USUARIO = '${usuario}', RATING = ${rating}, REVIEW = '${review}', UBICACION = '${ubicacion}', CREATED = TO_DATE('${created}','YYYY-MM-DD') WHERE ID_REVIEW = ${id}`;

      await connection.execute(
        `BEGIN
          ${statement};
        END;`
      );
      await connection.commit();
        
      res(200, { error: "Review updated!" });
    } catch (err) {
      console.error(err);
      res(500, { error: "Could not update in the DB" });
    } finally {
      if (connection) {
        await connection.close();

      }
    }
  } else {
    res(400, { error: "Missing required fields" });
  }
}

handlers._loneReview.DELETE = async function (req, res) {
  console.log(req.body.id);
  var id = 
    typeof req.body.id == "number" &&
    req.body.id % 1 === 0 &&
    req.body.id >= 0
      ? req.body.id
      : false;
  
  if (id) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var statement = `DELETE FROM REVIEW WHERE ID_REVIEW = ${id}`;
      await connection.execute(
        `BEGIN
          ${statement};
        END;`
      );
      await connection.commit();
      res.send("Review deleted!");
    } catch (err) {
      console.error(err);
      res.send("Could not delete from the DB");
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    res.send("Missing required fields");
  }
}


// Not found handler
handlers.notFound = function (req, res) {
  res.send(404);
};

module.exports = handlers;
