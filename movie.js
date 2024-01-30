var express = require('express');

var fs= require('fs');
var router = express.Router();
var pool=require("./pool")
var upload=require("./multer")
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

function checkAdminSession()
{ try{
   var admin=JSON.parse(localStorage.getItem('ADMIN'))
   if(admin==null)
   { return false}
   else
   {
    return admin
   }
   
}
catch(e)
{
  return false
}
}
router.get('/movieinterface', function(req,res,next) {
 if(checkAdminSession())

  res.render('movieinterface',{status:0});
else 

res.redirect('/admin/adminlogin')

});

router.get('/fetch_all_state',function(req,res){
  pool.query("select * from state", function(error,result) {
  if(error)
  { res.status(500).json({message:'Database error' ,status:false,data:[]})}
  else
  { 
    res.status(200).json({message:'success',status:true,data:result}) 
  }
  })
  })
  
  router.get('/fetch_all_city',function(req,res){

    pool.query("select * from city where stateid=?",[req.query.stateid],function(error,result) {
    if(error)
    { res.status(500).json({message:'Database error' ,status:false,data:[]})}
    else
    { 
      res.status(200).json({message:'success',status:true,data:result}) 
    }
    })
    })

router.post('/movie_submit',upload.single("poster"),function(req,res){
 console.log("Body:",req.body)
 console.log("FILE:",req.file)
pool.query("insert into movies(moviename, releasedate, discription, stateid, cityid, address, cinema, movietype , rating, language, poster) values(?,?,?,?,?,?,?,?,?,?,?)",[  req.body.moviename, req.body.releasedate, req.body.discription, req.body.stateid, req.body.cityid, req.body.address, req.body.cinema, req.body.movietype, req.body.rating, req.body.language, req.file.filename],function(error,result){
if(error)
{  console.log("Error:",error)
  res.render('movieinterface',{status:1})
}
else
{
  res.render('movieinterface',{status:2})
}


})
})
router.get('/displayallmovies', function(req,res,next) {
  if(checkAdminSession())
  {
  pool.query("select M.*,(select S.statename from state S where S.stateid=M.stateid) as statename ,(select C.cityname from city C where C.cityid=M.cityid) as cityname from movies M",function(error,result){
    if( error)
   
    { console.log(error)
       res.render('displayallmovies',{data:[]})}
    else
    { console.log(result)
       res.render('displayallmovies',{data:result})}

  }) 
}
else
{
res.redirect('/admin/adminlogin')
}
});

router.get('/showmovietoedit', function(req,res,next) {

  pool.query("select M.*,(select S.statename from state S where S.stateid=M.stateid) as statename ,(select C.cityname from city C where C.cityid=M.cityid) as cityname from movies M where M.movieid=?",[req.query.mid],function(error,result){
    if( error)
  
    { console.log(error)
       res.render('showmovietoedit',{data:[]})}
    else
    { console.log(result)
       res.render('showmovietoedit',{data:result[0]})}

  })
})

router.post('/movie_edit_data',function(req,res){
  console.log("Body",req.body)
if(req.body.btn=="Edit")
{
  pool.query("update movies set moviename=?, releasedate=?, discription=?, stateid=?, cityid=?, address=?, cinema=?, movietype=? , rating=?, language=? where movieid=?",[  req.body.moviename, req.body.releasedate, req.body.discription, req.body.stateid, req.body.cityid, req.body.address, req.body.cinema, req.body.movietype, req.body.rating, req.body.language,req.body.movieid],function(error,result){
  if(error)
  {
    console.log("Error:",error)
    res.redirect('displayallmovies')
  }
  else
  {
    res.redirect('displayallmovies')
  }
})

}
else
{


  pool.query("delete from movies where movieid=?",[req.body.movieid],function(error,result){
    if(error)
    {
      console.log("Error:",error)
      res.redirect('displayallmovies')
    }
    else
    {
      res.redirect('displayallmovies')
    }
  })




}
})

router.get('/showmoviepostertoedit', function(req,res,next) {
console.log(req.query)
  res.render('showmoviepostertoedit',{data:req.query})

})

router.post('/editmovieposter',upload.single('poster') , function(req,res,next) {
  pool.query("update movies set poster=? where movieid=?",[req.file.filename,req.body.pid],function(error,result){

 
 
    if(error)
    {
      console.log("Error:",error)
      res.redirect('displayallmovies')
    }
    else
    {
      fs.unlinkSync(`public/images/${req.body.oldposter}`)
      res.redirect('displayallmovies')
    }
  })
  })



///hhkh/
  router.get('/displayallmoviescard', function(req,res,next) {
    if(checkAdminSession())
    {
    pool.query("select M.*,(select S.statename from state S where S.stateid=M.stateid) as statename ,(select C.cityname from city C where C.cityid=M.cityid) as cityname from movies M",function(error,result){
      if( error)
     
      { console.log(error)
         res.render('displayallmoviescard',{data:[]})}
      else
      { console.log(result)

         res.render('displayallmoviescard',{data:result})}
  
    })
    
  }
  else
  {
   res.redirect('/admin/adminlogin')
  }


  });
  
  router.get('/showmovietoedit', function(req,res,next) {
    
    pool.query("select M.*,(select S.statename from state S where S.stateid=M.stateid) as statename ,(select C.cityname from city C where C.cityid=M.cityid) as cityname from movies M where M.movieid=?",[req.query.mid],function(error,result){
      if( error)
    
      { console.log(error)
         res.render('showmovietoedit',{data:[]})}
      else
      { console.log(result)
         res.render('showmovietoedit',{data:result[0]})}
  
    })
  
 
  })
  
  router.post('/movie_edit_data',function(req,res){
  
    console.log("Body",req.body)
  if(req.body.btn=="Edit")
  {
    pool.query("update movies set moviename=?, releasedate=?, discription=?, stateid=?, cityid=?, address=?, cinema=?, movietype=? , rating=?, language=? where movieid=?",[  req.body.moviename, req.body.releasedate, req.body.discription, req.body.stateid, req.body.cityid, req.body.address, req.body.cinema, req.body.movietype, req.body.rating, req.body.language,req.body.movieid],function(error,result){
    if(error)
    {
      console.log("Error:",error)
      res.redirect('displayallmoviescard')
    }
    else
    {
      res.redirect('displayallmoviescard')
    }
  })
  
  }
  else
  {
  
  
    pool.query("delete from movies where movieid=?",[req.body.movieid],function(error,result){
      if(error)
      {
        console.log("Error:",error)
        res.redirect('displayallmoviescard')
      }
      else
      {
        res.redirect('displayallmoviescard')
      }
    })
  
  
  
  
  }
  })
  
  router.get('/showmoviepostertoedit', function(req,res,next) {
  console.log(req.query)
    res.render('showmoviepostertoedit',{data:req.query})
  
  })
  
  router.post('/editmovieposter',upload.single('poster') , function(req,res,next) {
    pool.query("update movies set poster=? where movieid=?",[req.file.filename,req.body.pid],function(error,result){
  
   
   
      if(error)
      {
        console.log("Error:",error)
        res.redirect('displayallmoviescard')
      }
      else
      {
        fs.unlinkSync(`public/images/${req.body.oldposter}`)
        res.redirect('displayallmoviescard')
      }
    })
    })
  
  
  
  



  module.exports = router;
