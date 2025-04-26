package handlers

import (
	"fmt"
	"html/template"
	"net/http"
)

func ErrorHandler(w http.ResponseWriter, r *http.Request, errorCode int, errorMessage string) {
	w.WriteHeader(errorCode) //display error message in the terminal of the navigator

	tmpl, err := template.New(`error.html`).ParseFiles(`templates/error.html`)
	if err != nil {
		fmt.Println(err)
		return
	}
	errData := struct {
		ErrorCode    int
		ErrorMessage string
	}{
		ErrorCode:    errorCode,
		ErrorMessage: errorMessage,
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	err = tmpl.Execute(w, errData)
	if err != nil {
		fmt.Println(err)
		return
	}
}
