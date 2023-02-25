create database dbchat;
create table dbchat.tbusers(
	users_id int auto_increment not null primary key,
    users_name varchar(80) not null,
    users_email varchar(120) not null unique,
    users_pass varchar(255) not null,
    users_img varchar(255),
    users_status bool
);
create table dbchat.tbmessages(
	msg_id int auto_increment not null primary key,
    msg_remetente_id int not null,
    msg_destinatario_id int not null,
	msg text not null
);
insert into dbchat.tbusers(users_name, users_email, users_pass) values('pedro', 'pedro@gmail.com', '123');