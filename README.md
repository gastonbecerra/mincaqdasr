
<!-- README.md is generated from README.Rmd. Please edit that file -->

# mincaqdasr

<!-- badges: start -->
<!-- badges: end -->

mincaqdasr es un herramienta para análisis cualitativo (CAQDAS),
particularmente para la tarea de **codificar o anotar un corpus de
documentos o fragmentos de los mismos**, a través de una interfaz
gráfica (GUI) que corre en cualquier navegador que tenga JavaScript
habilitado.

En investigación cualitativa una tarea esencial es la de “codificar”:
*“A code in qualitative inquiry is most often a word or short phrase
that symbolically assigns a summative, salient, essence-capturing,
and/or evocative attribute for a portion of language-based or visual
data”*[^1]. El objetivo de mincaqdasr es ofrecer una interfaz gráfica
sencilla para facilitar este proceso, que puedar ser incluida en el
código de un análisis mayor (donde, por ejemplo, se genera el corpus de
documentos, o se procesen correlaciones entre los códigos asignados), y
que ayude a volver nuestro análisis más transparente y transportable.

El corpus anotado se exporta en un archivo `.json` que contiene todos
los elementos de un proyecto, de modo modo que no es necesario hacer
bundles, carpetas, ni exportar nada más.  
[Ver Estructura de datos](#estructura-de-datos). **IMPORTANTE:** los
datos persisten sólo en el `.json`, de modo que debemos no olvidar
exportarlo antes finalizar de anotar los documentos (incluso si corremos
mincaqdasr desde R)!

También se incluyen varias funciones de R para manipular el `.json`
generado con el GUI, y que devuelve los datos en el standard *tidy
data*. Los `.json` se pueden importar en R con `jsonlite::read_json()`.

El GUI también se puede usar sin R [Ver Usar GUI sin R](#usar-gui-sin-r)

# Estructura de datos

Los datos se guardan en `.json` que incluye 4 elementos primarios:

1.  documentos (como un vector de texto);
2.  códigos (un vector de texto) que se aplican tanto para documentos
    como a fragmentos;
3.  anotaciones a nivel documento, que incluyen la referencia a uno o
    varios códigos y un memo del anotador;
4.  fragmentos y anotaciones a nivel fragmentos, que incluyen la
    referencia al documento que contiene el fragment, la referencia a
    uno o varios códigos, y memo del anotador.

Un ejemplo de este `.json` (que incluimos) corresponde a un análisis
sobre sentidos de la partenidad (*The Yeshiva University Fatherhood
Project*) que Auerbach y Silverstein incluyen en su libro sobre
investigación cualitativa, codificación y *grounded theory*[^2], y que
los autores analizan paso a paso: la lectura de los documentos,
selección de los fragmentos, anotación de comentarios del analista, y
generación y asignación de códigos o etiquetas. Todos estos pasos se
pueden realizar con el GUI de mincaqdasr.

En R, estos `.json` generados con mincaqdasr puede ser importado con
`jsonlite::read_json()`, y manipulados como una lista:

    #> List of 4
    #>  $ documents            : chr [1:6] "L: Actually the first time I thought about becoming a father was very early in my life. Probably I, I guess bec"| __truncated__ "AG: To me I would say it is very different. When I left my country and I came here in 1983, I was scared to bec"| __truncated__ "L: Mine would have been a combination of people. My father would definitely be one of those people because my f"| __truncated__ "J: I thought it was going to be an innovative experience. If I could say that, something you actually have the "| __truncated__ ...
    #>  $ codes                : chr [1:2] "Something about religion" "Using one’s own father as a role model"
    #>  $ documents_annotations: list()
    #>  $ fragments_annotations:'data.frame':   6 obs. of  9 variables:
    #>   ..$ id               : chr [1:6] "l3ttn9p8" "5zfi0ja8" "0arcod8v" "2489nots" ...
    #>   ..$ document         : int [1:6] 0 1 1 2 4 5
    #>   ..$ text             : chr [1:6] "the first time I thought about becoming a father was very early in my life. Probably I, I guess because of my u"| __truncated__ "I was scared to become a father. As a Christian I was afraid not to meet the proper woman to become my wife in "| __truncated__ "Fortunately, I had my father as an example I would say. He has been with my mother since I was little, and I wo"| __truncated__ "my father was a very good father. He is a guy who has justice; you cannot make him tremble in front of situations." ...
    #>   ..$ start            : int [1:6] 12 92 376 107 146 3
    #>   ..$ end              : int [1:6] 295 374 524 220 214 238
    #>   ..$ codes            :List of 6
    #>   .. ..$ : int 0
    #>   .. ..$ : int 0
    #>   .. ..$ : int 1
    #>   .. ..$ : int 1
    #>   .. ..$ : int(0) 
    #>   .. ..$ : int 1
    #>   ..$ memo             : chr [1:6] "Being a father is a serious matter, because it is connected with being religious." "Fatherhood connected with religion" "One’s own father as a model to emulate" "Expresses his admiration for his father." ...
    #>   ..$ annotation_update: chr [1:6] "2023-01-02T05:33:55.186Z" "2023-01-02T05:33:47.250Z" "2023-01-02T05:35:36.566Z" "2023-01-02T05:34:58.234Z" ...
    #>   ..$ annotation_user  : chr [1:6] "default_user" "default_user" "default_user" "default_user" ...

Otro ejemplo de `.json` es sobre fragmentos de noticias de la prensa
argentina acerca de “big data”. En este caso no se asignan códigos a
fragmentos, sino que cada documento es clasificado con una etiqueta de
“positivo” o “negativo”, de acuerdo a si el big data queda asociado a
una potencial aplicación beneficiosa o a un riesgo. El ejemplo se
utiliza en este tutorial[^3], donde se cita el corpus más amplio.

mincaqdas permite que un corpus se puede anotar en ambos niveles
(documentos y fragmentos).

## Instalación

Se puede instalar desde [GitHub](https://github.com/):

``` r
# install.packages("devtools")
devtools::install_github("gastonbecerra/mincaqdasr")
```

## Usar mincaqdasr en R

Cuando llamamos a `mincaqdasr::start_gui()` estamos abriendo un `.html`
adentro de una *shinyapp* (no es la mejor implementación, pero es
rápida; lo mejor sería abrir el navegador sin llamar una shinyapp).

Esto significa que R queda “escuchando” la *shinyapp* de modo que vamos
a ver en nuestra consola un mensaje tipo
`Listening on http://127.0.0.1:7654`. Una vez que hayamos terminado de
trabajar con el GUI *debemos cerrar este proceso para poder seguir
usando R*.

    > You can stop the app and return access to the console using any one of these options:

    > * Click the stop sign icon on the R console toolbar.
    > * Click on the console, then press Esc (or press Ctrl + C if you’re not using RStudio).
    > * Close the Shiny app window.

Más info sobre esto acá:
<https://mastering-shiny.org/basic-app.html#running>

## Usar mincaqdasr sin R

El GUI está pensado para correr de manera autónoma, de modo que se puede
utilizar sin llamarlo desde R, ni instalar todo el package. En cuyo
caso, sólo hay que descargar la carpeta `\inst` que tiene 3 archivos
llamados “gui” (`.html`, `.js`, `.css`) y 2 `.json` de ejemplo.

Para correr el GUI hay que abrir el archivo `inst/gui.html` con un
navegador que tenga JavaScript habilitado. Los documentos y códigos de
anotación se pueden incluir directamente dentro del `<script></script>`,
en una variable llamada `input_data`. En el .html ya hay un ejemplo
comentado que se puede editar.

## Ejemplos

``` r

library(mincaqdasr) # para todos los ejemplos, cargar la librería
```

Podemos correr el GUI con la función `start_gui()`, y se pueden incluir
los documentos y códigos como vectores de texto, o como un `.json`
importado.

Por ejemplo, si tenemos un corpus de 3 documentos (y no tenemos los
códigos de antemano) podemos pasar el corpus como parámetro.

``` r

corpus <- c(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  "Quisque mollis risus libero",
  "Maecenas accumsan scelerisque blandit"
)

mincaqdasr::start_gui(docs = corpus)
```

Si, en cambio, ya tenemos un `.json` anteriormente analizado, podemos
importarlo con `jsonlite::read_json()`, generando un elemento tipo
`list`, para luego pasarlo como parámetro de `input`:

``` r

fathers <- jsonlite::read_json( path = "sample_haitian_fathers_annotated.json" )

mincaqdasr::start_gui(input = fathers)
```

Luego, podemos utilizar las funciones `get_` para parsear un `.json` (en
realidad: un objeto tipo `list`, ya que seguro lo hemos importado con
`jsonlite::read_json()`) para que nos devuelva los documentos, los
códigos, los fragmentos y las anotaciones a nivel de documento y a nivel
de fragmentos. En todos los casos se devuelve una `tibble`.

``` r

fathers <- mincaqdasr::sample_haitian_fathers_annotated # usemos un ejemplo ya incluido en el paquete

get_fragments_annotations(fathers) # devuelve una tibble
#> # A tibble: 5 × 10
#>   fragment_id fragment   code_id code  docum…¹ start   end memo  annot…² annot…³
#>   <chr>       <chr>        <dbl> <chr>   <int> <int> <int> <chr> <chr>   <chr>  
#> 1 l3ttn9p8    the first…       0 Some…       0    12   295 Bein… 2023-0… defaul…
#> 2 5zfi0ja8    I was sca…       0 Some…       1    92   374 Fath… 2023-0… defaul…
#> 3 0arcod8v    Fortunate…       1 Usin…       1   376   524 One’… 2023-0… defaul…
#> 4 2489nots    my father…       1 Usin…       2   107   220 Expr… 2023-0… defaul…
#> 5 cywladwy    Yes, yes …       1 Usin…       5     3   238 C ad… 2023-0… defaul…
#> # … with abbreviated variable names ¹​document_id, ²​annotation_update,
#> #   ³​annotation_user
```

<!--
You'll still need to render `README.Rmd` regularly, to keep `README.md` up-to-date. `devtools::build_readme()` is handy for this. You could also use GitHub Actions to re-render `README.Rmd` every time you push. An example workflow can be found here: <https://github.com/r-lib/actions/tree/v1/examples>.
-->

[^1]: Saldaña, J. (2009). The coding manual for qualitative researchers.
    Sage Publications. p. 3

[^2]: Zizi, 1996, p. 170, 221. (Haitian Father Data). Citado y analizado
    en Auerbach, C., & Silverstein, L. B. (2003). Qualitative data: an
    introduction to coding and analysis. New York University Press.
    p. 49-53

[^3]: <https://bookdown.org/gaston_becerra/curso-intro-r/clasificar-automaticamente.html>
