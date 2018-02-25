package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", "root:55555@tcp(127.0.0.1:3306)/gotest")
	if err != nil {
		fmt.Print(err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Print(err.Error())
	}
	stmt, err := db.Prepare("CREATE TABLE tree2 (node_id int NOT NULL AUTO_INCREMENT, name varchar(40), image varchar(40), lft int, rgt int, PRIMARY KEY (node_id));")
	if err != nil {
		fmt.Println(err.Error())
	}
	_, err = stmt.Exec()
	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Printf("tree table is operational")
	}
}