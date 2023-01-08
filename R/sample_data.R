#' Fragments of interviews about fatherhood
#'
#' Annotated/analyzed corpus of documents
#'
#' @format ## `sample_haitian_fathers`
#' A list with 4 elements
#' \describe{
#'   \item{documents}{Character vector with document}
#'   \item{codes}{Characer vector with codes}
#'   \item{documents_annotations}{A data frame with annotation on document level}
#'   \item{documents_annotations$document}{An integer with the position of document in $documents}
#'   \item{documents_annotations$codes}{A list of integers with the position of codes in $codes}
#'   \item{documents_annotations$memo}{A character string with memos}
#'   \item{documents_annotations$annotation_update}{A character string with the timestamp of the last change}
#'   \item{documents_annotations$annotation_user}{A character string with the username}
#'   \item{fragments_annotation}{A data frame with fragments and fragment annotations}
#'   \item{fragments_annotation$id}{A character string with ID hash}
#'   \item{fragments_annotation$document}{An integer with the position of document in $documents}
#'   \item{fragments_annotation$text}{A character string with the fragment's text}
#'   \item{fragments_annotation$start}{An integer with the start position of the fragment in the document}
#'   \item{fragments_annotation$end}{An integer with the en position of the fragment in the document}
#'   \item{fragments_annotation$codes}{A list of integers with the position of codes in $codes}
#'   \item{fragments_annotation$memo}{A character string with memos}
#'   \item{fragments_annotation$annotation_update}{A character string with the timestamp of the last change}
#'   \item{fragments_annotation$annotation_user}{A character string with the username}#'
#' }
#' @source #' Zizi, 1996, p. 170, 221. (Haitian Father Data). Quoted and analyzed in Auerbach, C., & Silverstein, L. B. (2003). Qualitative data: an introduction to coding and analysis. New York University Press. p. 49-53
"sample_haitian_fathers_annotated"

#' Fragments of news about big data
#'
#' Annotated/analyzed corpus of documents
#'
#' @format A list with 4 elements
#' \describe{
#'   \item{documents}{Character vector with document}
#'   \item{codes}{Characer vector with codes}
#'   \item{documents_annotations}{A data frame with annotation on document level}
#'   \item{documents_annotations$document}{An integer with the position of document in $documents}
#'   \item{documents_annotations$codes}{A list of integers with the position of codes in $codes}
#'   \item{documents_annotations$memo}{A character string with memos}
#'   \item{documents_annotations$annotation_update}{A character string with the timestamp of the last change}
#'   \item{documents_annotations$annotation_user}{A character string with the username}
#'   \item{fragments_annotation}{A data frame with fragments and fragment annotations}
#'   \item{fragments_annotation$id}{A character string with ID hash}
#'   \item{fragments_annotation$document}{An integer with the position of document in $documents}
#'   \item{fragments_annotation$text}{A character string with the fragment's text}
#'   \item{fragments_annotation$start}{An integer with the start position of the fragment in the document}
#'   \item{fragments_annotation$end}{An integer with the en position of the fragment in the document}
#'   \item{fragments_annotation$codes}{A list of integers with the position of codes in $codes}
#'   \item{fragments_annotation$memo}{A character string with memos}
#'   \item{fragments_annotation$annotation_update}{A character string with the timestamp of the last change}
#'   \item{fragments_annotation$annotation_user}{A character string with the username}#'
#' }
#' @source #' https://bookdown.org/gaston_becerra/curso-intro-r/clasificar-automaticamente.html
"sample_big_data_annotated"

blank_input_list <- function () {
  return(
    list(
      documents = as.character(),
      codes = as.character(),
      documents_annotations = data.frame(),
      fragments_annotations = data.frame()
    )
  )
}
