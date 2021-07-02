#' selectTableInput
#'
#' initialize a selectTableInput
#'
#' @description creates a selectTableInput component
#' @param inputId inputId used by Shiny
#' @param headers The table headers (if NULL, content's column names will be used).
#' @param content The table content (data.frame like object).
#' @param multiple Is selection of multiple rows allowed?
#' @param selected Index of initial row(s) selected.
#' @param maxRows Max. number of rows to be displayed.
#' @param actionLink Label for actionLink. If not NULL, an extra column will be added with an actionLink.
#'
#' @export
selectTableInput <- function(
  inputId,
  headers = NULL,
  content = NULL,
  multiple = FALSE,
  selected = NULL,
  maxRows = 5,
  actionLink = NULL
) {

  if (is.null(headers)) {
    headers <- colnames(content)
  }

  if (!is.null(actionLink)) {
    content[[" "]] <- lapply(
      1:nrow(content), function(id) actionLink(inputId = paste0(inputId, "-link-", id), actionLink)
    )
    headers <- append(headers, " ")
  }

  class <- "select-table-input"

  if (multiple) {
    class <- paste(class, "multiple")
    inputType <- "checkbox"
    firstColHeader <- checkbox(type = "checkbox", id = "chk_all")
  } else {
    inputType <- "radio"
    firstColHeader <- ""
  }

  # inputType <- ifelse(multiple, "checkbox", "radio")

  if (!is.null(selected) && !multiple && length(selected) > 1)
    stop("selected must be of length 1")

  if (nrow(content) < maxRows) maxRows <- nrow(content)

  addResourcePath(
    prefix = 'wsInputs', directoryPath = system.file('www', package='wsInputs')
  )

  # firstColHeader <- if (multiple) checkbox(type = "checkbox", id = "chk_all") else ""
  tagList(
    singleton(tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "wsInputs/style.css"))),
    singleton(tags$head(tags$script(src = "wsInputs/wsInputs.js"))),

    withTags(
      div(
        id = inputId,
        class = class,
        "data-max-rows" = maxRows,
        "data-action-link" = ifelse(is.null(actionLink), "false", "true"),
        table(
          tr(
            th(firstColHeader),
            lapply(headers, th)
          ),
          lapply(1:nrow(content), function(row) {
            tr(
              td(
                checkbox(type = inputType, id = paste0("chk_", row), checked = row %in% selected)
              ),
              lapply(content[row, ], td), class = ifelse(row %in% selected, "selected", ""))
          })
        )
      )
    )
  )
}

#' checkbox
#'
#' initialize a checkbox or radio input
#'
#' @description creates a checkbox or radio input
#' @param type Input type. Either "checkbox" or "radio".
#' @param id The input id.
#' @param checked Wheter the input should be checked or not.
#' @noRd
#'
checkbox <- function(type, id, checked = FALSE) {
  tag <- tags$input(type = type, id = id)
  if (checked)
    tag$attribs$checked <- "checked"
  return(tag)
}

library(shiny)

ui <- fluidPage(
  selectTableInput("table", content = head(iris), multiple = TRUE, actionLink = NULL, maxRows = 10)
)

server <- function(input, output, session) {
  observeEvent(input$table, {
    print(input$table)
  })

  observeEvent(input$tableLink, {

  })
}

shinyApp(ui, server)

