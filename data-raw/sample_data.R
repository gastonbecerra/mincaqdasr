# sample_haitian_fathers <- c(
#   "L: Actually the first time I thought about becoming a father was very early in my life. Probably I, I guess because of my upbringing—as I was brought up in Church and it was always a serious matter to me. I never went out with a girl without thinking that this is the girl I could possibly marry. Therefore, I always had it in my mind what it would be like. Well, I did not have strong views of what I would be like, what I had was knowing that I would be good toward the people I’d be dealing with. I did not know how I’d be that first time but I knew I would be a loving father. I did not have a picture of how I was going to be but I just knew I was going to be good toward the people . . . So . . ." ,
#   "AG: To me I would say it is very different. When I left my country and I came here in 1983, I was scared to become a father. As a Christian I was afraid not to meet the proper woman to become my wife in order to become a father. When I met my wife and realized that she was a Christian and looking behind at how my father raised us, I decided to become a father at that time. Fortunately, I had my father as an example I would say. He has been with my mother since I was little, and I would say he is still an example for me." ,
#   "L: Mine would have been a combination of people. My father would definitely be one of those people because my father was a very good father. He is a guy who has justice; you cannot make him tremble in front of situations. He sits, analyzes, and comes to a conclusion. There are several pastors in my life I have come to admire, in the way some of them were. They also play a part, in that it is going to be a combina? tion of people. My father was the strongest role model, but he was not the only person who played the role." ,
#   "J: I thought it was going to be an innovative experience. If I could say that, something you actually have the power to influence your personality in a very young mind to do some good. So I think it would be like being from a military background, creating a human being for the profit of society.",
#   "C: I could say the moment I met my wife, I thought about being a father. As my first girl friend, I thought eventually I would be married to her. To me it became obvious that I would be a father as a married person. I thought it was going to be a difficult job, a 24-hour job because there is no such thing as part-time fatherhood. I think it takes your whole being mentally and physically. Your presence in the house, in the home is very necessary at all times. My kids—they have it, God bless them they have it. I thought it was going to be a unique experience—you do not learn it in college or anywhere else.",
#   "C: Yes, yes when I think about the days of my youth I can see my father and his dedication. The love that he has shown, and his hard-working style and his honesty. All that left a serious imprint on me. My dream was to look like my father. Everybody saw in him a model. His credibility was something that everybody I would say envies, that type of person he was. They love him—people would give him money to save because they knew he would not spend it. So, I always thought that it would be in my best in? terest to be like him."
# )
# usethis::use_data(sample_haitian_fathers, overwrite = TRUE)
#
# sample_big_data <- c(
#     'los beneficios del bigdata en el futbol son muy reales y se puede realmente conseguir ventaja competitiva.',
#     'informacion en la actualidad es sinonimo de bigdata.',
#     'telefonica dispone de un sistema denominado bigdata que permite, mediante el desplazamiento de los usuarios de celulares dentro del ejido urbano, determinar puntos conflictivos, horarios de mayor movimiento y espacios de mayor circulacion.',
#     'se utiliza la tendencia del bigdata - recopilacion y utilizacion de datos para mejorar el rendimiento empresarial -, de forma que podemos conocer en que falla y en que es bueno cada usuario que utiliza el simulador.',
#     'la desideologizacion va de la mano con la bigdata: cuando hay suficientes datos, la teoria sobra.',
#     'los datos obtenidos gracias al bigdata son una valiosa fuente de informacion para el sector publico y para el privado.',
#     'con la analitica de bigdata, mas empresas estan creando nuevos productos para satisfacer las necesidades puntuales de los clientes.',
#     'hay una gran amenaza a la intimidad con el bigdata.',
#     'la combinacion de bigdata y estrategias de miedo es muy peligrosa: la persecucion selectiva muchas veces usa la herramienta de la discriminacion.',
#     'a pesar de presentar al bigdata en su aspecto mas positivo y revolucionario para la humanidad, los autores senalan los peligros a los que nos puede conducir una dictadura de los datos.',
#     'quien se deja enganar por bigdata puede creer que comprar bufandas o camperas causa frio.',
#     'el acceso indiscriminado a datos personales podria crear tambien problemas serios a victimas de violencia o de conflictos, lo que exige garantizar un uso adecuado de todo este potencial del bigdata.',
#     'el bigdata tambien tiene una connotacion mas oscura en su condicion de primo lingüistico de big brother, big oil y big government.',
#     'el inminente avance de las denominadas tecnologias de la informacion y la comunicacion, la inteligencia artificial, robotica y el bigdata resucitan en los trabajadores temores.'
# )
# usethis::use_data(sample_big_data, overwrite = TRUE)

sample_big_data_annotated <- jsonlite::read_json(
  path = system.file("./sample_big_data_annotated.json", package = "mincaqdasr"),
  simplifyVector = TRUE)
usethis::use_data(sample_big_data_annotated, overwrite = TRUE)

sample_haitian_fathers_annotated <- jsonlite::read_json(
  path = system.file("./sample_haitian_fathers_annotated.json", package = "mincaqdasr"),
  simplifyVector = TRUE)
usethis::use_data(sample_haitian_fathers_annotated, overwrite = TRUE)

# 2do: close connections
