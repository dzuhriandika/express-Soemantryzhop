var express = require('express');
var router = express.Router();

var session_store;
/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});
router.get('/login',function(req,res,next){
	res.render('main/login',{title:"Login Page"});
});
router.post('/login',function(req,res,next){
	session_store=req.session;
	req.assert('txtEmail', 'Please fill the Username').notEmpty();
	req.assert('txtEmail', 'Email not valid').isEmail();
	req.assert('txtPassword', 'Please fill the Password').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		req.getConnection(function(err,connection){
			password = req.sanitize( 'txtPassword' ).escape().trim(); 
			email = req.sanitize( 'txtEmail' ).escape().trim();
			
			var query = connection.query('select * from user where email="'+email+'" and password="'+password+'"',function(err,rows)
			{
				if(err)
				{

					var errornya  = ("Error Selecting : %s ",err.code );  
					console.log(err.code);
					req.flash('msg_error', errornya); 
					res.redirect('/barang'); 
				}else
				{
					if(rows.length <=0)
					{

						req.flash('msg_error', "Wrong email address or password. Try again."); 
						res.redirect('/barang');
					}
					else
					{	
						session_store.is_login = true;
						res.redirect('/barang');
					}
				}

			});
		});
	}
	else
	{
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		console.log(errors_detail);
		req.flash('msg_error', errors_detail); 
		res.redirect('/login'); 
	}
});
router.get('/logout', function(req, res)
{ 
	req.session.destroy(function(err)
	{ 
		if(err)
		{ 
			console.log(err); 
		} 
		else 
		{ 
			res.redirect('/login'); 
		} 
	}); 
});
module.exports = router;