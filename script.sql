DROP TABLE usuario;
------------ Tablas
CREATE TABLE usuario (
    id_User NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    userPassword VARCHAR(20),
    userName VARCHAR(20),
    nombre VARCHAR2(15),
    apellido VARCHAR2(15),
    correo VARCHAR2(35),
<<<<<<< Updated upstream
    telefono VARCHAR(15)
)

INSERT INTO usuario (nombre, userName, userPassword, apellido, correo, telefono)
    VALUES ('Gabriel', 'Gandalf', '1234', 'Monge', 'gabriel@gmail.com', '86837078');
    
    commit;
SELECT * FROM USUARIO;
    
DROP TABLE review;
=======
    telefono VARCHAR(15),
    CONSTRAINT user_pk PRIMARY KEY (id_User)
);

CREATE TABLE restaurante (
    id_Restaurante NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    tipo_Comida VARCHAR2(25),
    rest_Score NUMBER(1),
    variedad VARCHAR2(50),
    price_Range NUMBER(1),
    CONSTRAINT restaurante_pk PRIMARY KEY (id_Restaurante)
);

CREATE TABLE ubicacion (
    id_Ubicacion NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    restaurante VARCHAR2(25),
    rest_Score NUMBER(1),
    maps_Link VARCHAR2(50),
    price_Range NUMBER(1),
    CONSTRAINT ubicacion_pk PRIMARY KEY (id_Ubicacion),
    CONSTRAINT fk_rest_ubicacion
    FOREIGN KEY (restaurante, rest_Score)
    REFERENCES restaurante(id_Restaurante, rest_Score)
);

CREATE TABLE rating (
    id_Rating NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    restaurante number(25),
    rest_Score NUMBER(1),
    price_Range NUMBER(1),
    CONSTRAINT rating_pk PRIMARY KEY (id_Rating),
    CONSTRAINT fk_rating
    FOREIGN KEY (restaurante, rest_Score)
    REFERENCES restaurante(id_Restaurante, rest_Score)
);
>>>>>>> Stashed changes

CREATE TABLE review (
    id_Review NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    restaurante VARCHAR2(25),
    usuario VARCHAR2(25),
    rating NUMBER(1),
    review VARCHAR2(1024),
<<<<<<< Updated upstream
    created DATE,
    ubicacion VARCHAR2(20),
    fileName VARCHAR2(500)
)

ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';

INSERT INTO review (restaurante, usuario, rating, review, created, ubicacion)
    VALUES ('McDonalds', 'Gabriel', 5, 'Aquí va muchísimo texto', '2022-07-30', 'San José', 'empanada.png');


SELECT * FROM review;

CREATE OR REPLACE PROCEDURE insertReview(
    in_restaurante IN review.restaurante%TYPE,
    in_usuario IN review.usuario%TYPE,
    in_rating IN review.rating%TYPE,
    in_review IN review.review%TYPE,
    in_created IN review.created%TYPE,
    in_ubicacion IN review.ubicacion%TYPE,
    in_fileName IN review.fileName%TYPE)
IS
BEGIN
    INSERT INTO review (restaurante, usuario, rating, review, created, ubicacion, fileName)
    VALUES (in_restaurante, in_usuario, in_rating, in_review, in_created, in_ubicacion, in_fileName);
    COMMIT;
END;

DELETE FROM REVIEW;
commit;
EXECUTE insertReview('McDonalds', 'Gabriel', 5, 'Aquí va muchísimo texto', TO_DATE('1989-12-09','YYYY-MM-DD'), 'San José');

=======
    fecha NUMBER(10),
    ubicacion VARCHAR2(25),
    CONSTRAINT review_pk PRIMARY KEY (id_Review),
    CONSTRAINT fk_review
    FOREIGN KEY (restaurante), (usuario),(ubicacion)
    REFERENCES restaurante(id_Restaurante, rest_Score), usuario(id_User), ubicacion(id_Ubicacion)
);

CREATE TABLE platillo (
    id_Platillo NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    restaurante VARCHAR2(25),
    descripcion VARCHAR2(50),
    nombre VARCHAR2(20),
    precio NUMBER(10),
    CONSTRAINT platillo_pk PRIMARY KEY (id_Platillo),
    CONSTRAINT fk_platillo
    FOREIGN KEY (restaurante)
    REFERENCES restaurante(id_Restaurante)
);

CREATE TABLE bebida (
    id_Bebida NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    restaurante VARCHAR2(25),
    descripcion VARCHAR2(50),
    nombre VARCHAR2(20),
    precio NUMBER(10),
    CONSTRAINT bebida_pk PRIMARY KEY (id_Bebida),
    CONSTRAINT fk_bebida
    FOREIGN KEY (restaurante)
    REFERENCES restaurante(id_Restaurante)
);

CREATE TABLE empleado (
    id_Empleado NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    restaurante VARCHAR2(25),
    nombre VARCHAR2(15),
    apellido VARCHAR2(15),
    correo VARCHAR2(35),
    telefono VARCHAR(15),
    puesto VARCHAR2(20),
    turno VARCHAR(10),
    CONSTRAINT empleado_pk PRIMARY KEY (id_Empleado),
    CONSTRAINT fk_empleado
    FOREIGN KEY (restaurante)
    REFERENCES restaurante(id_Restaurante)
);
>>>>>>> Stashed changes
------------ Agregar un usuario
CREATE OR REPLACE PROCEDURE addUser(
    in_nombre IN usuario.nombre%TYPE,
    in_userPassword IN usuario.userPassword%TYPE,
    in_userName IN usuario.userName%TYPE,
    in_apellido IN usuario.apellido%TYPE,
    in_correo IN usuario.correo%TYPE,
    in_telefono IN usuario.telefono%TYPE)
IS
BEGIN
    INSERT INTO usuario (nombre, userName, userPassword, apellido, correo, telefono)
    VALUES (in_nombre, in_userName, in_userPassword, in_apellido, in_correo, in_telefono);
    COMMIT;
END;

------------ Eliminar un usuario
CREATE OR REPLACE PROCEDURE deleteUser (
<<<<<<< Updated upstream
    p_userName in usuario.userName%TYPE,
    p_userPassword IN usuario.userPassword%TYPE) 
IS 
Begin
    Delete from USUARIO WHERE userName = p_userName and userPassword = p_userPassword ; 
    COMMIT; 
=======
    p_nombre in usuario.nombre%TYPE,
    p_apellido in usuario.apellido%TYPE)
IS
Begin
    Delete from USUARIO WHERE nombre = p_nombre AND apellido = p_apellido;
    COMMIT;
>>>>>>> Stashed changes
END;

------------ Editar un usuario
SET SERVEROUTPUT ON
CREATE OR REPLACE PROCEDURE alterUser (
    ind_userName IN usuario.userName%TYPE,
    ind_userPassword IN usuario.userPassword%TYPE,
    in_userName IN usuario.userName%TYPE,
    in_nombre IN usuario.nombre%TYPE,
    in_userPassword IN usuario.userPassword%TYPE,
    in_apellido IN usuario.apellido%TYPE,
    in_correo IN usuario.correo%TYPE,
    in_telefono IN usuario.telefono%TYPE)
IS
BEGIN
    DBMS_OUTPUT.PUT_LINE(ind_userName||' '||ind_userPassword);
    UPDATE USUARIO SET 
        username = in_userName,
        userpassword = in_userPassword,
        nombre = in_nombre, 
        apellido = in_apellido, 
        correo = in_correo, 
        telefono = in_telefono
    WHERE userName = ind_userName AND userpassword = ind_userPassword;
    COMMIT;
END;