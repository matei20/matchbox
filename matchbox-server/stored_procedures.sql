create or replace procedure  USP_GETEMPLOYEES(cursorParam OUT SYS_REFCURSOR)
IS
BEGIN
    OPEN cursorParam FOR
        SELECT * FROM  EMPLOYEES;
END;


--autoincrement
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
      Select * from users_info  
      where id IN(Select a.to_user from likes A INNER JOIN likes B on (A.from_user=B.to_user and A.to_user=B.from_user) 
where a.like_box=1 and b.like_box=1 and a.from_user=p_id);
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
BEGIN
    OPEN cursorParam FOR
      Select * from users_info where gender!=(Select gender from users_info where id=p_id) and users_info.id!=All(Select to_user from likes where from_user=p_id ) and id!= p_id ;
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
        SELECT employee_id
            FROM employees
            WHERE employee_id = 100;
END;


--trigger to insert in users_info after insert on users
CREATE or REPLACE TRIGGER usersInfoTrigger
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
    DELETE from users_info where id=v_id;
end;


--CREATE packege package_setInformation
create or replace package package_setInformation AS
procedure USP_ADDUSER(p_email IN VARCHAR2, p_password IN VARCHAR2, cursorParam OUT SYS_REFCURSOR); 

end package_setInformation;

--CREATE users table
  CREATE TABLE "USERS" 
   (	"ID" NUMBER(20,0) NOT NULL ENABLE, 
	"EMAIL" VARCHAR2(50 BYTE) NOT NULL ENABLE, 
	"PASSWORD" VARCHAR2(270 BYTE), 
	 CONSTRAINT "USERS_EMAIL_UK" UNIQUE ("EMAIL")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS"  ENABLE, 
	 CONSTRAINT "USERS_ID_PK" PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS"  ENABLE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
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
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
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
	 CONSTRAINT "USERS_INFO_ID_FK" FOREIGN KEY ("ID")
	  REFERENCES "USERS" ("ID") ENABLE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;


Check This: https://stackoverflow.com/questions/14725455/connecting-to-visual-studio-debugging-iis-express-server-over-the-lan