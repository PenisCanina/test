package main

import (
	"bytes"
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	_"log"
	"log"
)

func main() {
	db, err := sql.Open("mysql", "root:55555@tcp(127.0.0.1:3306)/gotest")
	if err != nil {
		fmt.Print(err.Error())
	}
	defer db.Close()
	// make sure connection is available
	err = db.Ping()
	if err != nil {
		fmt.Print(err.Error())
	}

	type Person struct {
		Id         int
		First_Name string
		Last_Name  string
	}

	type Node struct {
		Id    int
		Name  string
		Image string
		Left  int
		Right int
	}

	type TreeJSONRow struct {
		Data  string
		Depth int
	}
	router := gin.Default()
	router.Use(func (context *gin.Context) {
		// add header Access-Control-Allow-Origin
		context.Writer.Header().Add("Access-Control-Allow-Origin", "*")
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
		var left, right, foo int
		c.JSON(http.StatusOK, gin.H{"result" : name+" "+img+" "+id})
		row := db.QueryRow("SELECT lft, rgt FROM tree WHERE node_id = ?;",id)
		err = row.Scan(&left, &right)
		foo = left
		log.Print(id," ", left," ", right)
		if right - left > 1 {
			//foo = right
		}
		_, err := db.Exec("UPDATE tree SET rgt = rgt + 2 WHERE rgt > ?;", foo)
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = db.Exec("UPDATE tree SET lft = lft + 2 WHERE lft > ?;", foo)
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = db.Exec("INSERT INTO tree(name, image, lft, rgt) VALUES(?, ?, ? + 1, ? + 2);", name, img, foo, foo)
		if err != nil {
			fmt.Print(err.Error())
		}
	})

	router.GET("/treelist", func(c *gin.Context) {
		var (
			node Node
			tree []Node
		)
		rows, err := db.Query("select * from tree;")
		if err != nil {
			fmt.Print(err.Error())
		}
		for rows.Next() {
			err = rows.Scan(&node.Id, &node.Name, &node.Image, &node.Left, &node.Right)
			tree = append(tree, node)
			fmt.Print(tree)
			if err != nil {
				fmt.Print(err.Error())
			}
		}
		defer rows.Close()
		c.JSON(http.StatusOK, gin.H{
			"result": tree,
			"count":  len(tree),
		})
	})

	//-----------------------------------------------------------------------------
	// GET a person detail
	router.GET("/person/:id", func(c *gin.Context) {
		var (
			person Person

			result gin.H
		)
		id := c.Param("id")
		row := db.QueryRow("select id, first_name, last_name from person where id = ?;", id)
		err = row.Scan(&person.Id, &person.First_Name, &person.Last_Name)
		if err != nil {
			// If no results send null
			result = gin.H{
				"result": nil,
				"count":  0,
			}
		} else {
			result = gin.H{
				"result":  person,
				"count":   1,
				"message": "HELLO",
			}
		}
		c.JSON(http.StatusOK, result)
	})

	// GET all persons
	router.GET("/persons", func(c *gin.Context) {
		var (
			person  Person
			persons []Person
		)
		rows, err := db.Query("select id, first_name, last_name from person;")
		if err != nil {
			fmt.Print(err.Error())
		}
		for rows.Next() {
			err = rows.Scan(&person.Id, &person.First_Name, &person.Last_Name)
			persons = append(persons, person)
			if err != nil {
				fmt.Print(err.Error())
			}
		}
		defer rows.Close()
		c.JSON(http.StatusOK, gin.H{
			"result": persons,
			"count":  len(persons),
		})
	})

	// GET all persons
	router.GET("/nodes", func(c *gin.Context) {
		var (
			person  Person
			persons []Person
		)
		rows, err := db.Query("select * from nodes;")
		if err != nil {
			fmt.Print(err.Error())
		}
		for rows.Next() {
			err = rows.Scan(&person.Id, &person.First_Name, &person.Last_Name)
			persons = append(persons, person)
			if err != nil {
				fmt.Print(err.Error())
			}
		}
		defer rows.Close()
		c.JSON(http.StatusOK, gin.H{
			"result": persons,
			"count":  len(persons),
		})
	})

	// POST new person details
	router.POST("/person", func(c *gin.Context) {
		var buffer bytes.Buffer
		first_name := c.PostForm("first_name")
		last_name := c.PostForm("last_name")
		stmt, err := db.Prepare("insert into person (first_name, last_name) values(?,?);")
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = stmt.Exec(first_name, last_name)

		if err != nil {
			fmt.Print(err.Error())
		}

		// Fastest way to append strings
		buffer.WriteString(first_name)
		buffer.WriteString(" ")
		buffer.WriteString(last_name)
		defer stmt.Close()
		name := buffer.String()
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf(" %s successfully created", name),
		})
	})

	// PUT - update a person details
	router.PUT("/person", func(c *gin.Context) {
		var buffer bytes.Buffer
		id := c.Query("id")
		first_name := c.PostForm("first_name")
		last_name := c.PostForm("last_name")
		stmt, err := db.Prepare("update person set first_name= ?, last_name= ? where id= ?;")
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = stmt.Exec(first_name, last_name, id)
		if err != nil {
			fmt.Print(err.Error())
		}

		// Fastest way to append strings
		buffer.WriteString(first_name)
		buffer.WriteString(" ")
		buffer.WriteString(last_name)
		defer stmt.Close()
		name := buffer.String()
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Successfully updated to %s", name),
		})
	})

	// Delete resources
	router.DELETE("/person", func(c *gin.Context) {
		id := c.Query("id")
		stmt, err := db.Prepare("delete from person where id= ?;")
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = stmt.Exec(id)
		if err != nil {
			fmt.Print(err.Error())
		}
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Successfully deleted user: %s", id),
		})
	})
	router.Run(":3001")
}
