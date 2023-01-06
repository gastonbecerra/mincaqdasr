test_that("sample data loads 1", {
  expect_type(sample_big_data, "character")
})

test_that("sample data loads 2", {
  expect_type(sample_haitian_fathers, "character")
})

test_that("sample data loads 3", {
  expect_type(sample_haitian_fathers_annotated, "list")
})

test_that("sample data loads 4", {
  expect_type(sample_big_data_annotated, "list")
})

