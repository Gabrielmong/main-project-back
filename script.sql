DROP TABLE usuario;
------------ Tablas
CREATE TABLE usuario (
    id_User NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    nombre VARCHAR2(15),
    apellido VARCHAR2(15),
    correo VARCHAR2(35),
    telefono VARCHAR(15)
)

CREATE TABLE review (
    id_Review NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    restaurante VARCHAR2(25),
    usuario VARCHAR2(25),
    rating NUMBER(1),
    review VARCHAR2(1024),
    created DATE,
    ubicacion VARCHAR2(20)   
)

ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';

INSERT INTO review (restaurante, usuario, rating, review, created, ubicacion)
    VALUES ('McDonalds', 'Gabriel', 5, 'Aquí va muchísimo texto', '2022-07-30', 'San José');


SELECT * FROM review;

CREATE OR REPLACE PROCEDURE insertReview(
    in_restaurante IN review.restaurante%TYPE,
    in_usuario IN review.usuario%TYPE,
    in_rating IN review.rating%TYPE,
    in_review IN review.review%TYPE,
    in_created IN review.created%TYPE,
    in_ubicacion IN review.ubicacion%TYPE)
IS
BEGIN
    INSERT INTO review (restaurante, usuario, rating, review, created, ubicacion)
    VALUES (in_restaurante, in_usuario, in_rating, in_review, in_created, in_ubicacion);
    COMMIT;
END;

DELETE FROM REVIEW;
EXECUTE insertReview('McDonalds', 'Gabriel', 5, 'Aquí va muchísimo texto', TO_DATE('1989-12-09','YYYY-MM-DD'), 'San José');

------------ Agregar un usuario
CREATE OR REPLACE PROCEDURE addUser(
    in_nombre IN usuario.nombre%TYPE,
    in_apellido IN usuario.apellido%TYPE,
    in_correo IN usuario.correo%TYPE,
    in_telefono IN usuario.telefono%TYPE)
IS
BEGIN
    INSERT INTO usuario (nombre, apellido, correo, telefono)
    VALUES (in_nombre, in_apellido, in_correo, in_telefono);
    COMMIT;
END;
    
------------ Eliminar un usuario
CREATE OR REPLACE PROCEDURE deleteUser (
    p_nombre in usuario.nombre%TYPE,
    p_apellido in usuario.apellido%TYPE) 
IS 
Begin
    Delete from USUARIO WHERE nombre = p_nombre AND apellido = p_apellido; 
    COMMIT; 
END;
------------ Editar un usuario

CREATE OR REPLACE PROCEDURE alterUser (
    ind_nombre IN usuario.nombre%TYPE,
    ind_apellido IN usuario.apellido%TYPE,
    in_nombre IN usuario.nombre%TYPE,
    in_apellido IN usuario.apellido%TYPE,
    in_correo IN usuario.correo%TYPE,
    in_telefono IN usuario.telefono%TYPE)
IS
BEGIN
    UPDATE USUARIO SET nombre = in_nombre, apellido = in_apellido, correo = in_correo, telefono = in_telefono
    WHERE nombre = ind_nombre AND apellido = ind_apellido;
    COMMIT;
END;