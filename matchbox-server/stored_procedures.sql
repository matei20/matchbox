--autoincrement sequence
CREATE SEQUENCE INCREMENT_1
  START WITH 1
  INCREMENT BY 1
  CACHE 100;


--get all matches
create or replace procedure  USP_MATCHES(p_id IN Numeric,
                                cursorParam OUT SYS_REFCURSOR)
IS

BEGIN
    OPEN cursorParam FOR
      Select u.*,loc.city from users_info u JOIN location loc on u.id = loc.id 
      where u.id IN(Select a.to_user from likes A INNER JOIN likes B on (A.from_user=B.to_user and A.to_user=B.from_user) 
where a.like_box=1 and b.like_box=1 and a.from_user=p_id);
END;

--save message procedure
create or replace procedure USP_ADDMESSAGE(p_id IN VARCHAR2,
                                p_sender_id IN NUMERIC,
                                p_receiver_id IN NUMERIC,
                                p_created_at IN VARCHAR2,
                                p_message_text IN VARCHAR2,
                                p_unread IN NUMERIC,
                                cursorParam OUT SYS_REFCURSOR)
IS

BEGIN
    INSERT INTO messages(id,
                        sender_id,
                        receiver_id,
                        createdat,
                        message_text,
                        unread
                            ) 
    VALUES(p_id,
                                p_sender_id,
                                p_receiver_id,
                                p_created_at,
                                p_message_text,
                                p_unread);
    OPEN cursorParam FOR
    SELECT id FROM messages 
        where id = p_id;



END;

--register procedure
create or replace procedure  USP_ADDUSER(p_email IN VARCHAR2,
                                p_password IN VARCHAR2,
                                cursorParam OUT SYS_REFCURSOR)
IS
BEGIN
    --set define off;

insert INTO users VALUES( increment_1.nextval,p_email,p_password );


    OPEN cursorParam FOR
        SELECT id,email,password FROM  users where email = p_email ;
END;



--login procedure
create or replace procedure  USP_GETUSER(p_email IN VARCHAR2,
                                cursorParam OUT SYS_REFCURSOR)
IS
BEGIN
    OPEN cursorParam FOR
        SELECT id,email,password FROM  users where email = p_email ;
END;


--get user info procedure
create or replace procedure  USP_GETUSERINFO(id_in IN Numeric,
                                cursorParam OUT SYS_REFCURSOR)
IS
BEGIN
    OPEN cursorParam FOR
        SELECT * FROM  users_info where id = id_in ;
END;


--set user info procedure
create or replace procedure  USP_SETUSERINFO(p_id IN Number,
                                p_name IN VARCHAR2,
                                p_age IN Number,
                                p_minage IN Number,
                                p_maxage IN Number,
                                p_maxdistance IN Number,
                                p_gender IN VARCHAR2,
                                p_school IN VARCHAR2,
                                p_job IN VARCHAR2,
                                p_company IN VARCHAR2,
                                p_description IN VARCHAR2,
                                cursorParam OUT SYS_REFCURSOR)
IS
BEGIN
update users_info 
SET name=p_name,
    age=p_age,
    minage=p_minage,
    maxage=p_maxage,
    maxdistance=p_maxdistance,
    gender=p_gender,
    school=p_school,
    job=p_job,
    company=p_company,
    description=p_description
WHERE id = p_id;

    OPEN cursorParam FOR
        SELECT id FROM  users_info where id=p_id ;
END;


--get match procedure
create or replace procedure  USP_GETMATCH(p_id IN Numeric,
                                cursorParam OUT SYS_REFCURSOR)
IS
    v_minage users_info.minage%TYPE;
    v_maxage users_info.maxage%TYPE;
    
BEGIN
    SELECT minage into v_minage from users_info where id=p_id;
    SELECT maxage into v_maxage from users_info where id=p_id;
    OPEN cursorParam FOR
      Select u.*,loc.city,loc.country from users_info u join location loc on u.id = loc.id
      where u.gender != (Select gender from users_info where id=p_id) and
      u.id != All(Select to_user from likes where from_user=p_id ) and u.id != p_id and u.age BETWEEN v_minage and v_maxage ;
END;

--get conversations procedure
create or replace procedure USP_CONVERSATIONS(p_id IN Numeric,
                                cursorParam OUT SYS_REFCURSOR)
IS

BEGIN
    OPEN cursorParam FOR
    SELECT * FROM messages 
        where sender_id = p_id OR receiver_id = p_id
        ORDER BY (to_timestamp(createdat, 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"'));
     


END;

--set like procedure
create or replace procedure  USP_SETLIKE(p_from_user IN Numeric,
                                p_to_user IN Numeric,
                                p_like_box IN Numeric,
                                cursorParam OUT SYS_REFCURSOR)
IS
BEGIN
    INSERT INTO likes VALUES (p_from_user,p_to_user,p_like_box);
      OPEN cursorParam FOR
        SELECT from_user FROM  likes where from_user = p_from_user ;
END;


--delete user procedure
create or replace procedure  USP_DELETEUSER(p_id IN Number,
                                cursorParam OUT SYS_REFCURSOR)
IS
BEGIN

DELETE from users where id=p_id;
    OPEN cursorParam FOR
        SELECT users.id from users where id = 1;

END;

--set user location info procedure
create or replace procedure  USP_SETUSERLOCATIONINFO(p_id IN Number,
                                p_country IN VARCHAR2,
                                p_city IN VARCHAR2,
                                p_latitude IN VARCHAR2,
                                p_longitude IN VARCHAR2,
                                cursorParam OUT SYS_REFCURSOR)
IS
BEGIN
update location 
SET country=p_country,
    city=p_city,
    latitude=p_latitude,
    longitude=p_longitude
WHERE id = p_id;
    OPEN cursorParam FOR
        SELECT id FROM  users_info where id=p_id ;
END;


--trigger to insert in users_info and location after insert on users
create or replace TRIGGER usersInfoTrigger
AFTER INSERT
ON users
FOR EACH ROW
DECLARE
    v_id users_info.id%TYPE;
    v_email users_info.email%TYPE;

BEGIN
    v_id := :new.id;
    v_email := :new.email;
    INSERT INTO users_info(id, email) values (v_id, v_email);
    INSERT INTO location(id) values (v_id);
end;


--trigger delete user
CREATE or REPLACE TRIGGER deleteAccountTrigger
BEFORE DELETE
ON users
FOR EACH ROW
DECLARE
    v_id users_info.id%TYPE;
    
BEGIN
    v_id := :old.id;
    DELETE from likes where from_user=v_id or to_user = v_id;
    DELETE from location where id=v_id;
    DELETE from users_info where id=v_id;
end;

--CREATE users table
  CREATE TABLE "USERS" 
   (	"ID" NUMBER(20,0) NOT NULL ENABLE, 
	"EMAIL" VARCHAR2(50 BYTE) NOT NULL ENABLE, 
	"PASSWORD" VARCHAR2(270 BYTE), 
	 CONSTRAINT "USERS_ID_PK" PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS"  ENABLE, 
	 CONSTRAINT "USERS_EMAIL_UK" UNIQUE ("EMAIL")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS"  ENABLE, 
	 CONSTRAINT "USERS_EMAIL_CK" CHECK (REGEXP_LIKE (EMAIL,'^[A-Za-z]+[A-Za-z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')) ENABLE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;

  --create LIKES table
  CREATE TABLE "LIKES" 
   (	"FROM_USER" NUMBER(20,0), 
	"TO_USER" NUMBER(20,0), 
	"LIKE_BOX" NUMBER(1,0), 
	 CONSTRAINT "LIKES_FROM_USER_FK" FOREIGN KEY ("FROM_USER")
	  REFERENCES "USERS" ("ID") ENABLE, 
	 CONSTRAINT "LIKES_TO_USER_FK" FOREIGN KEY ("TO_USER")
	  REFERENCES "USERS" ("ID") ENABLE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;

--create USERS_INFO table
  CREATE TABLE "USERS_INFO" 
   (	"ID" NUMBER(20,0) NOT NULL ENABLE, 
	"NAME" VARCHAR2(25 BYTE), 
	"AGE" NUMBER(3,0), 
	"GENDER" VARCHAR2(1 BYTE), 
	"SCHOOL" VARCHAR2(40 BYTE), 
	"JOB" VARCHAR2(40 BYTE), 
	"COMPANY" VARCHAR2(40 BYTE), 
	"DESCRIPTION" VARCHAR2(120 BYTE), 
	"EMAIL" VARCHAR2(50 BYTE), 
	"MAXDISTANCE" NUMBER(3,0), 
	"MINAGE" NUMBER(3,0), 
	"MAXAGE" NUMBER(3,0), 
	 UNIQUE ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS"  ENABLE, 
	 CONSTRAINT "CHK_MINAGE" CHECK (minage>=18) ENABLE, 
	 CONSTRAINT "CHK_MAXAGE" CHECK (maxage <=100) ENABLE, 
	 CONSTRAINT "USERS_INFO_ID_FK" FOREIGN KEY ("ID")
	  REFERENCES "C##MATCH"."USERS" ("ID") ENABLE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;


--create LOCATION table
CREATE TABLE location( id NUMBER(20) NOT NULL,
                        country VARCHAR2(40),
                        city VARCHAR2(40),
                        latitude VARCHAR2(40),
                        longitude VARCHAR2(40),
                        CONSTRAINT uk_id UNIQUE(ID),
                        CONSTRAINT fk_location FOREIGN KEY(id)
                        REFERENCES users(id));

--create MESSAGES table
create table messages  (id VARCHAR(50) UNIQUE Not null,
                        sender_id NUMBER(20) NOT NULL,
                        receiver_id NUMBER(20) NOT NULL,
                        createdat varchar(40) not null,
                        message_text VARCHAR2(4000CHAR),
                        unread NUMBER(1),
                        CONSTRAINT fk_sender_id FOREIGN KEY(sender_id)REFERENCES users(id),
                        CONSTRAINT fk_receiver_id FOREIGN KEY(receiver_id)REFERENCES users(id)
                        
);


Check This: https://stackoverflow.com/questions/14725455/connecting-to-visual-studio-debugging-iis-express-server-over-the-lan