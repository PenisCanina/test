package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	 "encoding/json"
	"os"
)



func main() {

	type Configurations struct {
		User string
		Password string
		Host string
		Db string
		ServerPort string
	}

	file, _:= os.Open("config.json")
	decode := json.NewDecoder(file)
	config := Configurations{}
	err := decode.Decode(&config)
	if err != nil {
		fmt.Print(err.Error())
	}
	connect := config.User + ":" + config.Password +"@tcp("+config.Host+")/"+ config.Db



	db, err := sql.Open("mysql", connect)
	if err != nil {
		fmt.Print(err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Print(err.Error())
	}
	stmt, err := db.Prepare("CREATE TABLE tree (node_id int NOT NULL AUTO_INCREMENT, name varchar(40), image varchar(256), lft int, rgt int, PRIMARY KEY (node_id));")
	if err != nil {
		fmt.Println(err.Error())
	}
	_, err = stmt.Exec()
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "The Root", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/colorwheel-icon.png", 1, 20)
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "Notebook", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/contacts-icon.png", 14, 19)
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "Parking Cone", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/cone-icon.png", 8, 13)
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "Three drops of liquid ", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/cmyk-icon.png", 4, 7)
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "Check Box", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/check-icon.png", 17, 18)
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "Car", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/car-icon.png", 11, 12)
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "Bike", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/bike-icon.png", 9, 10)
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "Aperture Icon", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/aperture-icon.png", 5, 6)
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "Chat", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/chat-icon.png", 15, 16)
	_, err = db.Exec("INSERT INTO tree (name, image, lft, rgt) VALUES (?,?,?,?);", "Stone Island?", "http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/countdown-icon.png", 2, 3)
	if err != nil {
		fmt.Print(err.Error())
	} else {
		fmt.Println("tree table is operational")
		fmt.Println("presentаtion dаtа loаded")
	}
}