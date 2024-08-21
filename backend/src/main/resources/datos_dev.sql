-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
-- ------------------------------------------------------
-- Server version	8.0.39

INSERT IGNORE INTO `barberos` VALUES (1,'Experto en cortes de cabello clásicos y modernos. Apasionado por brindar a sus clientes un estilo único y personalizado.','https://www.facebook.com/','../../resources/img/barbers/barber1.jpg','https://www.instagram.com/',_binary '','Juan Pérez','Barbero Principal','https://www.x.com/'),(2,'Maestro en el arte de dar forma y cuidar las barbas. Con amplia experiencia en estilos tradicionales y contemporáneos.','https://www.facebook.com/','../../resources/img/barbers/barber2.jpg','https://www.instagram.com/',_binary '','Carlos Rodríguez','Barbero Especialista en Barbas','https://www.x.com/'),(3,'Habilidoso en el arte del afeitado clásico y moderno. Brinda una experiencia relajante y de lujo a sus clientes.','https://www.facebook.com/','../../resources/img/barbers/barber3.jpg','https://www.instagram.com/',_binary '','Andrés Martínez','Barbero Especialista en Afeitado','https://www.x.com/'),(4,'Creador de peinados elegantes y sofisticados con resultados impresionantes.','https://www.facebook.com/','../../resources/img/barbers/barber4.jpg','https://www.instagram.com/',_binary '','Alejandro Torres','Barbero Especialista en Peinados de Eventos','https://www.x.com/'),(5,'Maestría en cortes clásicos y atención a los detalles.','https://www.facebook.com/','../../resources/img/barbers/barber5.jpg','https://www.instagram.com/',_binary '','Miguel Sánchez','Barbero Especialista en Cortes Clásicos','https://www.x.com/'),(6,'Cuidado de barbas largas con precisión y estilo.','https://www.facebook.com/','../../resources/img/barbers/barber6.jpg','https://www.instagram.com/',_binary '','Gabriel López','Barbero Experto en Barbas Largas','https://www.x.com/');
INSERT IGNORE INTO `categorias` VALUES (1,'Imagen de una barba.','resources/icons/beard.png',_binary '','Corte de Barba'),(2,'Imagen de tijeras de barbero.','resources/icons/scissors.png',_binary '','Corte de Cabello'),(3,'Imagen de una silla de barbero.','resources/icons/chair.png',_binary '','Corte Infantil'),(4,'Imagen de una brocha de afeitar.','resources/icons/brush.png',_binary '','Facial'),(5,'Imagen de una secadora de cabello.','resources/icons/hair-dryer.png',_binary '','Peinados con Secador');
INSERT IGNORE INTO `reservas` VALUES (1,'luismariob5@user','Luis Mario Bonilla','(000) 000-0000','2024-08-07 18:40:00.000000',_binary '\0',NULL,'2024-08-07 18:00:00.000000',_binary '',4,7),(3,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-07 05:50:00.000000',_binary '\0',NULL,'2024-08-07 05:30:00.000000',_binary '',2,1),(4,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-07 05:00:00.000000',_binary '\0',NULL,'2024-08-07 04:40:00.000000',_binary '',2,1),(5,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-07 05:00:00.000000',_binary '\0',NULL,'2024-08-07 04:40:00.000000',_binary '',1,1),(6,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-07 05:00:00.000000',_binary '\0',NULL,'2024-08-07 04:40:00.000000',_binary '',5,1),(7,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-07 05:00:00.000000',_binary '\0',NULL,'2024-08-07 04:40:00.000000',_binary '',6,1),(8,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-07 05:00:00.000000',_binary '\0',NULL,'2024-08-07 04:40:00.000000',_binary '',4,1),(9,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-07 05:00:00.000000',_binary '\0',NULL,'2024-08-07 04:40:00.000000',_binary '',3,1),(10,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-08 10:00:00.000000',_binary '\0',NULL,'2024-08-08 09:40:00.000000',_binary '',4,1),(11,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-08 10:00:00.000000',_binary '\0',NULL,'2024-08-08 09:40:00.000000',_binary '',3,1),(12,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-08 10:00:00.000000',_binary '\0',NULL,'2024-08-08 09:40:00.000000',_binary '',6,1),(13,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-08 10:00:00.000000',_binary '\0',NULL,'2024-08-08 09:40:00.000000',_binary '\0',2,1),(14,'luismariob5@user','Luis Mario bonilla','(000) 000-0000','2024-08-08 10:00:00.000000',_binary '\0',NULL,'2024-08-08 09:40:00.000000',_binary '',1,1),(15,'luismariob5@user','Luis Mario Bonilla','(000) 000-0000','2024-08-07 05:30:00.000000',_binary '\0',NULL,'2024-08-07 05:00:00.000000',_binary '',2,3),(16,'luismbm@boni.dev','Luis Mario Bonilla Madera','(809) 000-0000','2024-08-19 14:00:00.000000',_binary '','En caso de cualquier imprevisto comunicarse por via telefónica.','2024-08-19 13:00:00.000000',_binary '',1,8),(17,'luismbm@boni.dev','Luis Mario Bonilla Madera ','(829) 000-0000','2024-08-19 11:20:00.000000',_binary '','','2024-08-19 11:00:00.000000',_binary '',1,1),(18,'luismbm@boni.dev','Luis Mario Bonilla Madera','(829) 000-0000','2024-08-19 15:00:00.000000',_binary '','En caso de cualquier imprevisto comunicarse por via telefónica.','2024-08-19 14:00:00.000000',_binary '',4,8),(19,'luismbm@boni.dev','Luis Mario Bonilla Madera','(809) 000-0000','2024-08-20 12:20:00.000000',_binary '','En caso de cualquier imprevisto comunicarse por via telefónica.','2024-08-20 12:00:00.000000',_binary '',3,1),(20,'luism@boni.dev','Luis Mario ','(809) 000-0000','2024-08-22 12:30:00.000000',_binary '','','2024-08-22 12:00:00.000000',_binary '',3,2),(21,'luismbm@boni.dev','Luis Mario Bonilla Madera','(849) 000-0000','2024-08-21 10:20:00.000000',_binary '','','2024-08-21 10:00:00.000000',_binary '',5,1),(22,'luismB@boni.dev','Luis Mario Bonilla','(809) 000-0000','2024-08-22 12:30:00.000000',_binary '','','2024-08-22 12:00:00.000000',_binary '',2,3),(23,'luism@boni.dev','Luis ','(809) 000-0000','2024-08-22 12:30:00.000000',_binary '','','2024-08-22 12:00:00.000000',_binary '',6,2);
INSERT IGNORE INTO `servicios` VALUES (1,20,'Afeitado clásico con navaja.','resources/img/services/pricing/classic-shave.jpg',_binary '','Afeitado Clásico',250.00,1),(2,30,'Afeitado con aplicación de toalla caliente.','resources/img/services/pricing/hot-towel-shave.jpg',_binary '','Afeitado con Toalla Caliente',350.00,1),(3,30,'Corte de cabello clásico.','resources/img/services/pricing/classic-haircut.jpg',_binary '','Corte de Cabello Clásico',400.00,2),(4,35,'Corte de cabello realizado solo con tijeras.','resources/img/services/pricing/scissor-cut.jpg',_binary '','Corte de Cabello con Tijeras',450.00,2),(5,25,'Corte de cabello básico para niños.','resources/img/services/pricing/basic-kid-haircut.jpg',_binary '','Corte Infantil Básico',300.00,3),(6,30,'Corte de cabello con estilo para niños.','resources/img/services/pricing/stylish-kid-haircut.jpg',_binary '','Corte Infantil con Estilo',350.00,3),(7,40,'Limpieza facial básica.','resources/img/services/pricing/basic-facial.jpg',_binary '','Limpieza Facial Básica',500.00,4),(8,60,'Limpieza facial profunda.','resources/img/services/pricing/deep-facial.jpg',_binary '','Limpieza Facial Profunda',700.00,4),(9,15,'Peinado rápido con secador.','resources/img/services/pricing/quick-dry.jpg',_binary '','Peinado con Secador Rápido',200.00,5),(10,25,'Peinado con secador y volumen.','resources/img/services/pricing/volume-dry.jpg',_binary '','Peinado con Secador y Volumen',300.00,5);
INSERT IGNORE INTO `usuarios`(id, email, nombre, nombre_usuario, password, role, is_active) VALUES (1,'admin@boni.dev',NULL,'adminBonidev','$2a$10$0zcHkKgnSVLS3fMAJmMcbuAqZPgGOHbLl6tPWeDmD4hzDeaHpdHka','ROLE_ADMIN',_binary ''),(2,'barber@boni.dev',NULL,'barberBonidev','$2a$10$pX3s.OLem4epCmgMXfitWe4LAWCQsaEPyiNaaey7t14bNJ1g491xC','ROLE_BARBER',_binary ''),(3,'user@boni.dev',NULL,'userBonidev','$2a$10$P7mvDqakzRBWkpi4tWe9u.dQQyypAQt.QuPYv60J6HeUxcU.3.7Ra','ROLE_USER',_binary ''),(4,'user@sample',NULL,'user1','$2a$10$b9Fw9.nIoLXwFQgFWEBTeei5ylAVrsWzIoFwcP6Xu9bB4GrAPaM0u','ROLE_USER',_binary '\0'),(7,'user2@sample',NULL,'user2','$2a$10$fbJ1JyNT8u2V/0XnifXNVuO7d5.1hZrz5OWRpQnQBSWW1qhZ6Rcka','ROLE_USER',_binary '\0'),(8,'luismariob5@user',NULL,'LuisMarioB5','$2a$10$27zspBZuFCMtdO1C8UNyc.MkK.xSX.AOB3/G.Tj.8FjM90ANmFG/S','ROLE_USER',_binary '\0'),(9,'luis@bonilla.dev',NULL,'luisBonilla','$2a$10$FV9TGWoQPKDrj9bGx9IQueNZhoqPhHNk.i.lhDCshpxZPTzRLuppq','ROLE_USER',_binary '\0'),(11,'luisbonilla@boni.dev',NULL,'luisbonilla10','$2a$10$rOVgqwiDWGbS8SDTdCz6geKICaejcIlTG4aycaoM.7X7lAiVMcluy','ROLE_USER',_binary '\0'),(12,'angel@boni.dev',NULL,'angel','$2a$10$I9gXhXl8KTiRMvkwCov2dO.ISPrSTbdHWu3aJn6Sry3zeal5jNytC','ROLE_ADMIN',_binary ''),(13,'luism@boni.dev',NULL,'LuisMario','$2a$10$PhFlml6gmt6rmRbn2S00fe/XzMTOTH.frLHz9oOexk7XEQhvNGPfu','ROLE_USER',_binary '');

-- Dump completed on 2024-08-21 15:02:44
