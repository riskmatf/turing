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
	
	foreign key (classroomName) references classrooms(name),
	foreign key (adminUsername) references admins(username)
);

delimiter $$
drop trigger if exists computerOrProjectorOrOther $$
create trigger computerOrProjectorOrOther before insert on reports
	for each row
	begin
		if new.reportType not in (1,2,3)
		then 
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Report type must be in (1,2,3)";
		elseif new.reportType = 1 and computerID is null
		then
			SIGNAL SQLSTATE '45000' SET message_text = "ERROR! Report type is 1 but computerID is null";
		end if;
	END;$$

delimiter ;