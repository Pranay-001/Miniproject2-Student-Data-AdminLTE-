const express=require('express')
const app=express()
const MongoClient=require('mongodb').MongoClient
const bodyParser=require('body-parser')

var db;

MongoClient.connect('mongodb://localhost:27017/KMIT',{useUnifiedTopology: true},(err,database)=>{
    if(err) return console.error(err);
    db=database.db('KMIT');
    app.listen(3000,()=>{
        console.log('listing at 3000');
    });
});  

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('Students').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('homepage.ejs',{data:result});
    });
});

app.get('/update',(req,res)=>{
    db.collection('Students').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('update.ejs',{
            data:result,
            preVal:'1'
        });
    });
});

app.get('/delete',(req,res)=>{
    db.collection('Students').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('delete.ejs',{data:result});
    });
});

app.get('/add',(req,res)=>{
    res.render('add.ejs');
});

app.post('/addData',(req,res)=>{
    db.collection('Students').save(req.body,(err,result)=>{
        if(err) return console.log(err);
        res.redirect('/');
    });
});
app.post('/deleteData',(req,res)=>{
    db.collection('Students').deleteOne({'RollNo':req.body.rollno},(err,success)=>{
        if(err) return console.log(err);
        res.redirect('/');
    });
});

app.post('/updateData',(req,res)=>{
    var update={};
    update[req.body.field] = req.body.newVal;
    db.collection('Students').updateOne({'RollNo':req.body.rollno},
    {$set: update},(err,success)=>{
        if(err) return console.log(err);
        res.redirect('/');
    });
});
app.get('/deletePreData',(req,res)=>{
    const r=req["query"]["x"];
    db.collection('Students').deleteOne({'RollNo':r},(err,success)=>{
        if(err) return console.log(err);
        res.redirect('/');
    });
});
app.get('/updatePreData',(req,res)=>{
    db.collection('Students').find().toArray((err,result)=>{
        const r=req["query"]["x"];
        if(err) return console.log(err);
        res.render('update.ejs',{
            data:result,
            preVal:r
        });
    });
});