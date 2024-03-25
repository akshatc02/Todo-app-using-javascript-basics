const fs=require('fs'); // library for file reading and writing
const express=require('express'); // Library for communication with server
const bodyParser = require('body-parser'); // library for reading the body data
const  path  = require('path');
const cors= require('cors');

var cnt =0;
const app=express(); // initialising the app
const port = 3001;
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,"index.html"));
})
app.use(bodyParser.json());
function listening(){
    console.log(`Example app listening on port ${port}`);
}

function findIndex(arr, id) {
 
    for (let i = 0; i < arr.length; i++) {
    
        
      if (arr[i].id === Number(id)){
        
        return i;}
    }
    return -1;
  }
function removeAtIndex(arr, index) {
    let newArray = [];
    for (let i = 0; i < arr.length; i++) {
      if (i !== index) newArray.push(arr[i]);
    }
    return newArray;
  }
function generateId() {
    return cnt + 1;
}
function deletetodo(req,res){
    var id=req.params.id;
 
    fs.readFile("todo.json","utf8",function(err,data){
        if(err){
            console.log(err)
        }
        else{
            const todo=JSON.parse(data);
           
            const todoindex= findIndex(todo,id);
           
           
            if(todoindex==-1){
                res.status(404).send()
            }
            else{
                var newt=removeAtIndex(todo,todoindex);
                
                fs.writeFile("todo.json",JSON.stringify(newt),(err) => {
                    if (err) throw err;
                    res.status(200).send(newt);})

            }
            

        }
    })
    
    // res.send(todo);
}
function updatetodo(req,res){
    var id=req.params.id;
    const{title,description}=req.body;
    if(id in todo){
        todo[id].title=title;
    todo[id].description=description;
    res.send(todo[id]);
    }
    else{
        res.status(404).send("Not Found")
    }


}

function addtodo(req,res){
    const { title, description } = req.body;
    // var num=generateId();
    const newTodo = {
        id: Math.floor(Math.random() * 1000000),
        title:title,
        description:description
        
    };
    fs.readFile("todo.json","utf8",function(err,data){
        if (err){
            throw err;

        }
        else{
            const pusht=JSON.parse(data);
            pusht.push(newTodo);
            fs.writeFile("todo.json",JSON.stringify(pusht),function(err){
                if(err){
                    throw err;
                }
                else{
                    res.status(201).json(pusht);

                }
        
               
        
            })
        }
    })
    
   
    
    
}

function gettodobyid(req,res){
    var id=req.params.id;
    if(id in todo){
        console.log(todo[id]);
        res.send(todo[id]);
    }
    else{
        res.status(404).send("Not Found");
    }
}
function gettodo(req,res){
   fs.readFile("todo.json","utf8",function(err,data){
    if(err){throw err;}
    else{
        var answer = JSON.parse(data);
        res.send(answer);
    }
   })


    
}
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,"index.html"));
})
app.use(cors());
app.get('/todos/:id',gettodobyid);
app.get('/todos',gettodo);
app.post('/todos',addtodo);
app.put('/todos/:id',updatetodo);
app.delete('/todos/:id',deletetodo);
app.listen(port,listening);

// module.exports = app;