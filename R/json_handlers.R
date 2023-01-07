
#' Get codes from mincaqdasr data list
#'
#' @param x A data list created with mincaqdasr GUI (exported as .json)
#'
#' @return A tibble
#' @export
#'
#' @examples
#' get_codes( mincaqdasr::sample_haitian_fathers_annotated )
get_codes <- function( x ) {
  y <- tibble::tibble(
    code = x$codes
  ) %>% dplyr::mutate(
    code_id = dplyr::row_number() - 1
  ) %>% dplyr::select(code_id , code)
  return(y)
}


#' Get documents from mincaqdasr data list
#'
#' @param x A data list created with mincaqdasr GUI (exported as .json)
#'
#' @return A tibble
#' @export
#'
#' @examples
#' get_documents( mincaqdasr::sample_big_data_annotated )
get_documents <- function( x ) {
  y <- tibble::tibble(
    document = x$documents
  ) %>% dplyr::mutate(
    document_id = dplyr::row_number() - 1
  ) %>% dplyr::select(document_id , document)
  return(y)
}

#' Get fragments from mincaqdasr data list
#'
#' @param x A data list created with mincaqdasr GUI (exported as .json)
#'
#' @return A tibble
#' @export
#'
#' @examples
#' get_fragments( mincaqdasr::sample_haitian_fathers_annotated )
get_fragments <- function( x ) {
  # 2do: hay que exportar las otras anotaciones
  y <- tibble::tibble(
    fragment_id = x$fragments_annotations[['id']],
    fragment = x$fragments_annotations[['text']]
  )
  return(y)
}

#' Get document annotations from mincaqdasr data list
#'
#' @param x A data list created with mincaqdasr GUI (exported as .json)
#'
#' @return A tibble
#' @export
#'
#' @examples
#' get_documents_annotations( mincaqdasr::sample_big_data_annotated )
get_documents_annotations <- function( x ) {
  # 2do: hay que chequear si el json no tiene anotaciones de documentos...
  # mincaqdasr::get_documents_annotations( mincaqdasr::sample_haitian_fathers_annotated )
  y <- x$documents_annotations %>%
    tidyr::unnest(cols = c(codes)) %>%
    dplyr::rename(document_id = document) %>%
    dplyr::rename(code_id = codes ) %>%
    dplyr::left_join( mincaqdasr::get_documents(x) , by = 'document_id' ) %>%
    dplyr::left_join( mincaqdasr::get_codes(x) , by = 'code_id' ) %>%
    dplyr::select( document_id , document , code_id , code ,
            memo , annotation_update , annotation_user)
  return(y)
}


#' Get fragment annotations from mincaqdasr data list
#'
#' @param x A data list created with mincaqdasr GUI (exported as .json)
#'
#' @return A tibble
#' @export
#'
#' @examples
#' get_fragments_annotations( mincaqdasr::sample_haitian_fathers_annotated )
get_fragments_annotations <- function( x ) {
  y <- x$fragments_annotations %>%
    tidyr::unnest(cols = c(codes)) %>%
    dplyr::rename(fragment_id = id) %>%
    dplyr::rename(code_id = codes ) %>%
    dplyr::left_join( mincaqdasr::get_fragments(x) , by = 'fragment_id' ) %>%
    dplyr::left_join( mincaqdasr::get_codes(x) , by = 'code_id' ) %>%
    dplyr::select( fragment_id , fragment , code_id , code ,
            document_id = document ,
            start, end,
            memo , annotation_update , annotation_user)
  return(y)
}

#' Merge documents, codes and annotations from 2 mincaqdasr data lists
#'
#' @param x A data list created with mincaqdasr GUI (exported as .json)
#' @param y A data list created with mincaqdasr GUI (exported as .json)
#'
#' @return A mincaqdasr data list
#' @export
#'
#' @examples
#' a = a
merge_jsons <- function( x , y ) {
  # 2do: hay que chequear que haya contenido, e.g., tomando anotaciones de fragmentos en sample_big_data
  # sin reemplazar, pero ajustnado los indices
  # com reemplazo, habría que mergear comentarios
  base_doc = length(x$documents)
  base_codes = length(x$codes)
  mas_indice <- function(indice , base) { return(indice+base) }
  y_documents_annotations <- cbind(document = lapply(X = y$documents_annotations$document , FUN = mas_indice, base=base_doc ),
                                   codes = lapply(X = y$documents_annotations$codes , FUN = mas_indice, base=base_codes ),
                                   memo = y$documents_annotations$memo,
                                   annotation_update = y$documents_annotations$annotation_update,
                                   annotation_user = y$documents_annotations$annotation_user) %>%
    as.data.frame() %>%
    dplyr::mutate(document = as.integer(document) ,
           memo = as.character(memo) ,
           annotation_update = as.character(annotation_update) ,
           annotation_user = as.character(annotation_user) )
  y_fragments_annotations <- cbind(
    id = y$fragments_annotations$id,
    document = vapply(X = y$fragments_annotations$document , FUN = mas_indice, base=base_doc , FUN.VALUE = numeric(1) ),
    text = y$fragments_annotations$text,
    start = y$fragments_annotations$start,
    end = y$fragments_annotations$end,
    codes = lapply(X = y$fragments_annotations$codes , FUN = mas_indice, base=base_codes ),
    memo = y$fragments_annotations$memo,
    annotation_update = y$fragments_annotations$annotation_update,
    annotation_user = y$fragments_annotations$annotation_user) %>%
    as.data.frame() %>%
    dplyr::mutate(document = as.integer(document) ,
           id = as.character(id) ,
           text = as.character(text) ,
           start = as.integer(start) ,
           end = as.integer(end) ,
           memo = as.character(memo) ,
           annotation_update = as.character(annotation_update) ,
           annotation_user = as.character(annotation_user) )

  z <- list()
  z <- x
  z$documents <- c(z$documents , y$documents)
  z$codes <- c(z$codes , y$codes)
  z$documents_annotations <- rbind(z$documents_annotations , y_documents_annotations)
  z$fragments_annotations <- rbind(z$fragments_annotations , y_fragments_annotations)
  return(z)
}
