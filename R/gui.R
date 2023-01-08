#' GUI for annotating / analyzing / codifying documents
#'
#' Should open default browser.
#' Data MUST be exported as .json files!
#' You need to terminate the process after ending.
#'
#' @param input A list element from importing a .json file
#' @param docs Character vector with documents
#' @param codes Character vector with codes
#' @param show_monitor Logical show variables in GUI
#' @param annotation_user Character string with the annotators name
#'
#' @return false
#' @export
#'
#' @examples
#' \dontrun{
#' start_gui()
#' start_gui(input = mincaqdasr::sample_haitian_fathers_annotated)
#' start_gui(docs = mincaqdasr::sample_haitian_fathers, codes = c('role models', 'religious idea'))
#' }
start_gui <- function( input = FALSE, docs = FALSE, codes = FALSE, show_monitor = FALSE, annotation_user = 'default_user') {

  # 2do: para esto no necesitamos shinyapp

  json_input <- blank_input_list()

  if (is.list(input)) {
    # se dio un json
    # 2do: unificar terminologia json/list
    if ( is.character(input$documents) && is.vector(input$documents)) { json_input$documents = input$documents }
    if ( is.character(input$codes) && is.vector(input$codes)) { json_input$codes = input$codes }
    if ( is.data.frame(input$documents_annotations)) { json_input$documents_annotations = input$documents_annotations }
    if ( is.data.frame(input$fragments_annotations)) { json_input$fragments_annotations = input$fragments_annotations }
    json_input <- jsonlite::toJSON(json_input)
  }

  if (is.logical(input) && (!input)) {
    # si no se dio una lista (json) pero si se pusieron los inputs como vectores
    if ( is.character(docs) && is.vector(docs)) { json_input$documents = docs }
    if ( is.character(codes) && is.vector(codes)) { json_input$codes = codes }
    json_input <- jsonlite::toJSON(json_input)
  }

  # # https://stackoverflow.com/questions/70011643/shiny-app-as-function-where-to-put-www-folder-css-js
  ui <- shiny::fluidPage(
    shinyjs::useShinyjs(),
    shiny::tags$head(
      shiny::includeScript(system.file("gui.js", package = "mincaqdasr")),
      shiny::includeCSS(system.file("gui.css", package = "mincaqdasr")),
      shiny::includeCSS("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css")
    ),
    shiny::fluidRow(shiny::tags$div(id="posta"))
  )
  server <- function(input, output, session) {
    shinyjs::runjs(paste0("$(document).ready(function() {
                var input_data = " , json_input , ";
                read_input_data(input_data);
                set_variables( show_monitor = false , annotation_user = '" , annotation_user , "' );
                draw_front();
            });"))
  }

  # 2do: launch should be an option
  shiny::runApp(list(ui = ui, server = server), launch.browser =T)

}
