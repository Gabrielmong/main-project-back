// request handlers

//dependencies
const oracledb = require("oracledb");
const fs = require("fs");
const dbconfig = require("./dbconfig.js");
const libPath = "C:\\oracle\\instantclient_21_6";

if (libPath && fs.existsSync(libPath)) {
  oracledb.initOracleClient({ libDir: libPath });
}

// Define all handlers
const handlers = {};

// DB use
handlers.crud = function (data, callback) {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._crud[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the CRUD methods
handlers._crud = {};

handlers._crud.post = async function (data, callback) {
  var name =
    typeof data.payload.name == "string" && data.payload.name.trim().length > 0
      ? data.payload.name.trim()
      : false;
  var age =
    typeof data.payload.age == "number" &&
    data.payload.age % 1 === 0 &&
    data.payload.age >= 0
      ? data.payload.age
      : false;

  if (name && age) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      await connection.execute(
        `INSERT INTO PRUEBA (name, age) VALUES ('${name}', ${age})`
      );
      await connection.commit();

      callback(200, { error: "User added to the DB" });
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not insert into the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

handlers._crud.get = async function (data, callback) {
  var name =
    typeof data.queryStringObject.name == "string" &&
    data.queryStringObject.name.trim().length > 0
      ? data.queryStringObject.name.trim()
      : false;
  if (name) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var result = await connection.execute(
        `SELECT * FROM PRUEBA WHERE name = '${name}'`
      );
      await connection.commit();
      if (result.rows.length > 0) {
        callback(200, result.rows);
      } else {
        callback(404, { error: "User not found" });
      }
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not get from the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

handlers._crud.put = async function (data, callback) {
  var id = parseInt(data.payload.id);
  var name =
    typeof data.payload.name == "string" && data.payload.name.trim().length > 0
      ? data.payload.name.trim()
      : false;
  var age =
    typeof data.payload.age == "number" &&
    data.payload.age % 1 === 0 &&
    data.payload.age >= 0
      ? data.payload.age
      : false;

  if (id && name && age) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      await connection.execute(
        `UPDATE PRUEBA SET name = '${name}', age = ${age} WHERE id = ${id}`
      );
      await connection.commit();

      callback(200, { error: "User updated" });
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not update the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

handlers._crud.delete = async function (data, callback) {
  console.log(data.payload.id);
  var id = parseInt(data.payload.id);
  if (id) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      await connection.execute(`DELETE FROM PRUEBA WHERE id = ${id}`);
      await connection.commit();

      callback(200, { error: "User deleted" });
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not delete from the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

handlers.userCrud = function (data, callback) {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._userCrud[data.method](data, callback);
  } else {
    callback(405);
  }
};

handlers._userCrud = {};

handlers._userCrud.post = async function (data, callback) {
  var nombre =
    typeof data.payload.nombre == "string" &&
    data.payload.nombre.trim().length > 0
      ? data.payload.nombre.trim()
      : false;
  var apellido =
    typeof data.payload.apellido == "string" &&
    data.payload.apellido.trim().length > 0
      ? data.payload.apellido.trim()
      : false;
  var correo =
    typeof data.payload.correo == "string" &&
    data.payload.correo.trim().length > 0
      ? data.payload.correo.trim()
      : false;
  var telefono =
    typeof data.payload.telefono == "string" &&
    data.payload.telefono.trim().length > 0
      ? data.payload.telefono.trim()
      : false;
  if (nombre && apellido && correo && telefono) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var statement = `addUser ('${nombre}', '${apellido}', '${correo}', '${telefono}');`;
      console.log(statement);
      await connection.execute(
        `BEGIN
          ${statement}
         END;`
      );
      callback(200, { error: "User added to the DB" });
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not insert into the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    callback(400, { error: data.payload });
  }
};

handlers._userCrud.get = async function (data, callback) {
  var userName =
    typeof data.queryStringObject.userName == "string" &&
    data.queryStringObject.userName.trim().length > 0
      ? data.queryStringObject.userName.trim()
      : false;
  var password =
    typeof data.queryStringObject.password == "string" &&
    data.queryStringObject.password.trim().length > 0
      ? data.queryStringObject.password.trim()
      : false;

      console.log(data.queryStringObject);
  if (userName && password) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      // Por la forma en que oracle retorna resultados de un stored procedure, no se puede extraer los rows
      var statement = `select * from USUARIO where userName = '${userName}' and userPassword = '${password}'`;
      console.log(statement);
      var result = await connection.execute(`${statement}`);
      await connection.commit();
      if (result.rows.length > 0) {
        callback(200, result.rows);
      } else {
        callback(404, { error: "User not found" });
      }
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not get from the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

handlers._userCrud.put = async function (data, callback) {
  console.log(data.payload);
  var indNombre =
    typeof data.payload.indNombre == "string" &&
    data.payload.indNombre.trim().length > 0
      ? data.payload.indNombre.trim()
      : false;
  var indApellido =
    typeof data.payload.indApellido == "string" &&
    data.payload.indApellido.trim().length > 0
      ? data.payload.indApellido.trim()
      : false;
  var nombre =
    typeof data.payload.nombre == "string" &&
    data.payload.nombre.trim().length > 0
      ? data.payload.nombre.trim()
      : false;
  var apellido =
    typeof data.payload.apellido == "string" &&
    data.payload.apellido.trim().length > 0
      ? data.payload.apellido.trim()
      : false;
  var correo =
    typeof data.payload.correo == "string" &&
    data.payload.correo.trim().length > 0
      ? data.payload.correo.trim()
      : false;
  var telefono =
    typeof data.payload.telefono == "string" &&
    data.payload.telefono.trim().length > 0
      ? data.payload.telefono.trim()
      : false;

  if (indNombre && indApellido && nombre && apellido && correo && telefono) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);

      // Se puede hacer en stored
      var statement = `alterUser('${indNombre}', '${indApellido}', '${nombre}', '${apellido}', '${correo}', '${telefono}')`;
      console.log(statement);
      await connection.execute(
        `BEGIN
          ${statement};
        END;`
      );
      callback(200, { error: "User updated in the DB" });
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not update in the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

handlers._userCrud.delete = async function (data, callback) {
  var nombre =
    typeof data.payload.nombre == "string" &&
    data.payload.nombre.trim().length > 0
      ? data.payload.nombre.trim()
      : false;
  var apellido =
    typeof data.payload.apellido == "string" &&
    data.payload.apellido.trim().length > 0
      ? data.payload.apellido.trim()
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

      callback(200, { error: "User deleted from the DB" });
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not delete from the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

handlers.crudReviews = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._crudReviews[data.method](data, callback);
  } else {
    callback(405);
  }
};

handlers._crudReviews = {};

handlers._crudReviews.post = async function (data, callback) {
  var restaurante =
    typeof data.payload.restaurante == "string" &&
    data.payload.restaurante.trim().length > 0
      ? data.payload.restaurante.trim()
      : false;
  var usuario =
    typeof data.payload.usuario == "string" &&
    data.payload.usuario.trim().length > 0
      ? data.payload.usuario.trim()
      : false;
  var rating =
    typeof data.payload.rating == "number" &&
    data.payload.rating % 1 === 0 &&
    data.payload.rating >= 0
      ? data.payload.rating
      : false;
  var review =
    typeof data.payload.review == "string" &&
    data.payload.review.trim().length > 0
      ? data.payload.review.trim()
      : false;
  var ubicacion =
    typeof data.payload.ubicacion == "string" &&
    data.payload.ubicacion.trim().length > 0
      ? data.payload.ubicacion.trim()
      : false;
  var created =
    typeof data.payload.created == "string" &&
    data.payload.created.trim().length > 0
      ? data.payload.created.trim()
      : false;

  if (restaurante && usuario && rating && review && ubicacion && created) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var statement = `insertReview('${restaurante}', '${usuario}', ${rating}, '${review}', TO_DATE('${created}','YYYY-MM-DD'), '${ubicacion}')`;
      console.log(statement);
      await connection.execute(
        `BEGIN
          ${statement};
        END;`
      );
      await connection.commit();

      callback(200, { error: "Review created!" });
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not insert in the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

handlers._crudReviews.get = async function (data, callback) {
  var connection;
  try {
    connection = await oracledb.getConnection(dbconfig);
    var statement = `SELECT * FROM REVIEW`;
    var result = await connection.execute(statement);
    callback(200, result.rows);
  } catch (err) {
    console.error(err);
    callback(500, { error: "Could not get from the DB" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

handlers.loneReview = function (data, callback) {
  var acceptableMethods = ["get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._loneReview[data.method](data, callback);
  } else {
    callback(405);
  }
};

handlers._loneReview = {};

handlers._loneReview.get = async function (data, callback) {
  id = data.queryStringObject.id;
  if (id) {
    var connection;
    try {
      connection = await oracledb.getConnection(dbconfig);
      var statement = `SELECT * FROM REVIEW WHERE ID_REVIEW = ${id}`;
      var result = await connection.execute(statement);
      callback(200, result.rows);
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not get from the DB" });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
};

handlers._loneReview.put = async function (data, callback) {
  id = data.queryStringObject.id;
  var restaurante =
    typeof data.payload.restaurante == "string" &&
    data.payload.restaurante.trim().length > 0
      ? data.payload.restaurante.trim()
      : false;
  var usuario =
    typeof data.payload.usuario == "string" &&
    data.payload.usuario.trim().length > 0
      ? data.payload.usuario.trim()
      : false;  
  var rating =
    typeof data.payload.rating == "number" &&
    data.payload.rating % 1 === 0 &&
    data.payload.rating >= 0
      ? data.payload.rating
      : false;
  var review =
    typeof data.payload.review == "string" &&
    data.payload.review.trim().length > 0
      ? data.payload.review.trim()
      : false;
  var ubicacion =
    typeof data.payload.ubicacion == "string" &&
    data.payload.ubicacion.trim().length > 0
      ? data.payload.ubicacion.trim()
      : false;
  var created =
    typeof data.payload.created == "string" &&
    data.payload.created.trim().length > 0
      ? data.payload.created.trim()
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
        
      callback(200, { error: "Review updated!" });
    } catch (err) {
      console.error(err);
      callback(500, { error: "Could not update in the DB" });
    } finally {
      if (connection) {
        await connection.close();

      }
    }
  } else {
    callback(400, { error: "Missing required fields" });
  }
}

handlers.uploadImg = function (data, callback) {
  var acceptableMethods = ["post"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._uploadImg[data.method](data, callback);
  } else {
    callback(405);
  }
}


handlers._uploadImg = {};


handlers._uploadImg.post = async function (data, callback) {
  console.log(data.payload);
  callback(200, { error: "Algo" });
}




// Ping handler
handlers.ping = function (data, callback) {
  callback(200, { status: "Success!" });
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

module.exports = handlers;
