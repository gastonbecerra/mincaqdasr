test_that("sample data loads 3", {
  expect_type(sample_haitian_fathers_annotated, "list")
})

test_that("sample data loads 4", {
  expect_type(sample_big_data_annotated, "list")
})

test_that("sample data consistency check 1", {
  expect_type(sample_big_data_annotated$codes, "character")
})

test_that("sample data consistency check 2", {
  expect_type(sample_haitian_fathers_annotated$documents, "character")
})

test_that("sample data consistency check 3", {
  expect_type(sample_haitian_fathers_annotated$documents_annotations, "list")
})

test_that("get_codes returning tibble", {
  expect_true(mincaqdasr::get_codes( mincaqdasr::sample_big_data_annotated ) %>% tibble::is_tibble())
})

test_that("get_documents returning a non empty tibble", {
  expect_true(mincaqdasr::get_documents( mincaqdasr::sample_big_data_annotated ) %>% tibble::is_tibble())
  expect_true(mincaqdasr::get_documents( mincaqdasr::sample_big_data_annotated ) %>% nrow() > 1)
})

test_that("get_fragments returning a non empty tibble", {
  expect_true(mincaqdasr::get_fragments( mincaqdasr::sample_haitian_fathers_annotated ) %>% tibble::is_tibble())
  expect_true(mincaqdasr::get_documents( mincaqdasr::sample_haitian_fathers_annotated ) %>% nrow() > 1)
})

test_that("get_documents_annotations returning a non empty tibble", {
  expect_true(mincaqdasr::get_documents_annotations( mincaqdasr::sample_big_data_annotated ) %>% tibble::is_tibble())
  expect_true(mincaqdasr::get_documents_annotations( mincaqdasr::sample_big_data_annotated ) %>% nrow() > 1)
})

test_that("get_fragments_annotations returning a non empty tibble", {
  expect_true(mincaqdasr::get_fragments_annotations( mincaqdasr::sample_haitian_fathers_annotated ) %>% tibble::is_tibble())
  expect_true(mincaqdasr::get_fragments_annotations( mincaqdasr::sample_haitian_fathers_annotated ) %>% nrow() > 1)
})
