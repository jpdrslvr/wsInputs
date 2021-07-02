#' selectFileInput
#'
#' initialize a selectFileInput
#'
#' @description creates a selectFileInput component
#' @param inputId inputId used by Shiny.
#' @param choices Choices.
#'
#' @export
selectFileInput <- function(inputId, choices = NULL) {
  addResourcePath(
    prefix = 'wsInputs', directoryPath = system.file('www', package='wsInputs')
  )

  tagList(
    singleton(tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "wsInputs/style.css"))),
    singleton(tags$head(tags$script(src = "wsInputs/wsInputs.js"))),

    withTags(
      div(
        id = inputId,
        class = "select-file-input",
        lapply(choices, function(c) {
          div( class = "file-row",
            div(class = "file-name", "data-value" = c, c),
            button(type = "button", class = "close-button", icon("times"))
          )
        })
      )
    )
  )
}

#' appendSelectFileInput
#'
#' append to selectFileInput element
#'
#' @description append to selectFileInput element
#' @param session The session object.
#' @param inputId inputId used by Shiny.
#' @param choices Choices.
#'
#' @export
appendSelectFileInput <- function(session, inputId, choices) {
  session$sendInputMessage(inputId, choices)
}

#' resetSelectFileInput
#'
#' reset to selectFileInput element
#'
#' @description reset to selectFileInput element
#' @param session The session object.
#' @param inputId inputId used by Shiny.
#'
#' @export
resetSelectFileInput <- function(session, inputId) {
  session$sendCustomMessage("resetSelectFileInput", inputId)
}



