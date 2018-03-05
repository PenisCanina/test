# test
Test repo


dependencies:
  go: 
    github.com/gin-gonic/gin
    github.com/go-sql-driver/mysql
  js:
    react
    axios
    serve

run:
  backend:
    create mysql db
    configure /back/config.json with mysql user, password, host, db-name
    run setup.exe
    run rest.exe
  frontend:
    npm install -g serve
    serve -s build (in /front directory, app is then deployed to static server on port 5000)
  ...
  profit? 
  
  
  
