
get_codes <- function( x ) {
  y <- tibble(
    code = x$codes
  ) %>% mutate(
    code_id = row_number() - 1
  ) %>% select(code_id , code)
  return(y)
}

# get documents as dataframe
get_documents <- function( x ) {
  y <- tibble(
    document = x$documents
  ) %>% mutate(
    document_id = row_number() - 1
  ) %>% select(document_id , document)
  return(y)
}

# get fragments as dataframe
get_fragments <- function( x ) {
  y <- tibble(
    fragment_id = x$fragments_annotations[['id']],
    fragment = x$fragments_annotations[['text']]
  )
  return(y)
}

# get document annotations as dataframe
get_documents_annotations <- function( x ) {
  y <- x$documents_annotations %>% unnest(cols = c(codes)) %>%
    rename(document_id = document) %>%
    rename(code_id = codes ) %>%
    left_join( get_documents(x) , by = 'document_id' ) %>%
    left_join( get_codes(x) , by = 'code_id' ) %>%
    select( document_id , document , code_id , code ,
            memo , annotation_update , annotation_user)
  return(y)
}

# get fragment annotations as dataframe
get_fragments_annotations <- function( x ) {
  y <- x$fragments_annotations %>%
    unnest(cols = c(codes)) %>%
    rename(fragment_id = id) %>%
    rename(code_id = codes ) %>%
    left_join( get_fragments(x) , by = 'fragment_id' ) %>%
    left_join( get_codes(x) , by = 'code_id' ) %>%
    select( fragment_id , fragment , code_id , code ,
            document_id = document ,
            start, end,
            memo , annotation_update , annotation_user)
  return(y)
}

merge_jsons <- function( x , y ) {
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
    mutate(document = as.integer(document) ,
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
    mutate(document = as.integer(document) ,
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
