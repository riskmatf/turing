create database if not exists turing;
use turing;

create table if not exists classrooms(
	name varchar(20) not null primary key,
	location varchar(100) not null,
	numberOfComputers integer not null

);

create table if not exists admins(
	username varchar(20) primary key not null,
	displayName varchar(20) not null,
	password char(32) not null
);

create table if not exists reports(
	reportId integer auto_increment primary key not null,
	classroomName varchar(20) not null,
	reportType tinyint(1) not null,
	computerID integer default null,
	reportComment varchar(1000) default null,
	fixed tinyint(1) default 0 not null,
	adminComment varchar(1000) default null,
	adminUsername varchar(20) default null,
	timestamp integer not null,
	urgent tinyint(1) default 0 not null,
	
	foreign key (classroomName) references classrooms(name) ON DELETE CASCADE,
	foreign key (adminUsername) references admins(username)
);

delimiter $$
drop trigger if exists reportsBI $$
create trigger reportsBI before insert on reports
	for each row
	begin
		if new.reportType not in (1,2,3)
		then 
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Report type must be in (1,2,3)";
		elseif new.reportType = 1 and new.computerID is null
		then
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Report type is 1 but computerID is null";
		elseif new.fixed not in (0,1)
		then
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Fixed must be either 1 or 0!";
		elseif new.urgent not in (0,1)
		then
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Urgent must be either 1 or 0!";
		end if;
		set new.timestamp = UNIX_TIMESTAMP();
	END;$$

drop trigger if exists reportsBU $$
create trigger reportsBU before update on reports
	for each row
	begin
		if new.reportType not in (1,2,3)
		then 
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Report type must be in (1,2,3)";
		elseif new.reportType = 1 and new.computerID is null
		then
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Report type is 1 but computerID is null";
		elseif new.fixed not in (0,1)
		then
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Fixed must be either 1 or 0!";
		elseif new.urgent not in (0,1)
		then
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Urgent must be either 1 or 0!";
		end if;
	end;$$

drop trigger if exists adminBD $$
create trigger adminBD before delete on admins
	for each row
	begin
		update reports set adminComment = NULL, adminUsername = NULL where adminUsername = old.username $$
	end;$$
delimiter ;
