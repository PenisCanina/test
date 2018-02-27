package main

import (
	"database/sql"
	"fmt"
	"os"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"

	"log"
	"github.com/gin-gonic/gin/json"
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

	type TreeJSONRow struct {
		Data  string
		Depth int
	}
	router := gin.Default()
	router.Use(func (context *gin.Context) {
		// add header Access-Control-Allow-Origin
		context.Writer.Header().Add("Access-Control-Allow-Origin", "*")
		context.Writer.Header().Add("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
		context.Writer.Header().Add("Access-Control-Allow-Headers", "*")
		context.Next()
	})

	router.GET("/tree", func(c *gin.Context) {
		var (
			nodeRow   TreeJSONRow
			treeJSON  string
			prevDepth = 1
		)

		//'Access-Control-Allow-Origin goes here else it does'nt work.
		query, err := db.Query(`SELECT CONCAT('{"id" : ',node.node_id,', "name" : "',node.name, '", "image" : "', node.image, '", "children": [') AS node,
										COUNT(parent.node_id) AS depth
										FROM tree AS node,
										tree AS parent 
										WHERE node.lft BETWEEN parent.lft AND parent.rgt
										GROUP BY node.node_id
										ORDER BY node.rgt;`)
		if err != nil {
			fmt.Print(err.Error())
		}
		for query.Next() {
			err = query.Scan(&nodeRow.Data, &nodeRow.Depth)
			if prevDepth <= nodeRow.Depth {
				nodeRow.Data += strings.Repeat("]}", nodeRow.Depth-prevDepth+1)
				if prevDepth != 1 {
					nodeRow.Data += ","
				}
			}

			treeJSON = nodeRow.Data + treeJSON
			prevDepth = nodeRow.Depth
			if err != nil {
				fmt.Print(err.Error())
			}
		}
		defer query.Close()

		c.JSON(http.StatusOK, gin.H{
			"result": treeJSON,
		})
	})

	router.POST("/add", func(c *gin.Context){
		name := c.PostForm("name")
		img := c.PostForm("image")
		id := c.Query("id")
		var left, right int

		row := db.QueryRow("SELECT lft, rgt FROM tree WHERE node_id = ?;",id)
		err = row.Scan(&left, &right)

		log.Print(id," ", left," ", right)

		_, err := db.Exec("UPDATE tree SET rgt = rgt + 2 WHERE rgt > ?;", left)
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = db.Exec("UPDATE tree SET lft = lft + 2 WHERE lft > ?;", left)
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = db.Exec("INSERT INTO tree(name, image, lft, rgt) VALUES(?, ?, ? + 1, ? + 2);", name, img, left, left)
		if err != nil {
			fmt.Print(err.Error())
		}
		c.JSON(http.StatusOK, gin.H{"result" : name+" "+img+" "+id})
	})

	router.OPTIONS("/kill", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{})
		c.Next()
	})

	router.DELETE("/kill", func(c *gin.Context) {
		id := c.Query("id")
		log.Print(id)
		var left, right, width int
		row := db.QueryRow("SELECT lft, rgt FROM tree WHERE node_id = ?;", id)
		err := row.Scan(&left, &right)
		width = right - left + 1
		if err != nil {
			fmt.Print(err.Error())
		}
		if width > 1 {
			if err != nil {
				fmt.Print(err.Error())
			}
			_, err = db.Exec("DELETE FROM tree WHERE lft BETWEEN ? AND ?; ", left, right)
			if err != nil {
				fmt.Print(err.Error())
			}
			_, err = db.Exec("UPDATE tree SET rgt=(rgt - ?) WHERE rgt > ?;", width, right)
			if err != nil {
				fmt.Print(err.Error())
			}
			_, err = db.Exec("UPDATE tree SET lft = (lft - ?) WHERE lft > ?;", width, right)
			if err != nil {
				fmt.Print(err.Error())
			}
			c.JSON(http.StatusOK, gin.H{
				"message": fmt.Sprintf("Successfully killed: %s", id),
			})
		}
	})
	router.Run(":3001")
}
