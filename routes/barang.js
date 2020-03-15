var express = require('express');
var router = express.Router();

/* GET Barang page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('barang/list',{title:"Barang",data:rows});
		});
     });
});

router.post('/add', function(req, res, next) {
	req.assert('name', 'Isi name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_nama = req.sanitize( 'name' ).escape().trim();
		v_merek = req.sanitize( 'kategori' ).escape().trim();
		v_satuan = req.sanitize( 'size' ).escape().trim();
		v_jumlah = req.sanitize( 'stok' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();
		v_image = req.sanitize( 'image' ).escape().trim();

		var barang = {
			name: v_nama,
			kategori: v_merek,
            size: v_satuan,
            stok: v_jumlah,
            harga: v_harga,
            image: v_image
		}

		var insert_sql = 'INSERT INTO barang SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/add-barang', 
					{ 
						name: req.param('name'),
						kategori: req.param('kategori'),
						size: req.param('size'),
						stok: req.param('stok'),
						harga: req.param('harga'),
						image: req.param('image')
					});
				}else{
					req.flash('msg_info', 'Sukses menambah barang'); 
					res.redirect('/barang');
				}		
			});
		});
	}else{
		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>';
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-barang', 
		{ 
			nama: req.param('nama'), 
			merek: req.param('merek')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'barang/add-barang', 
	{ 
		title: 'Tambah Barang Baru',
		name: '',
		kategori: '',
        size: '',
        stok: '',
        harga: '',
        image: ''
	});
});

router.get('/edit/(:id)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/barang'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Barang tidak bisa dicari!"); 
					res.redirect('/barang');
				}
				else
				{	
					console.log(rows);
					res.render('barang/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id)', function(req,res,next){
	req.assert('name', 'Isi name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_nama = req.sanitize( 'name' ).escape().trim();
		v_merek = req.sanitize( 'kategori' ).escape().trim();
		v_satuan = req.sanitize( 'size' ).escape().trim();
		v_jumlah = req.sanitize( 'stok' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();
		v_image = req.sanitize( 'image' ).escape().trim();
		var barang = {
			name: v_nama,
			kategori: v_merek,
            size: v_satuan,
            stok: v_jumlah,
            harga: v_harga,
            image: v_image
		}

		var update_sql = 'update barang SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/edit', 
					{ 
						name: req.param('name'),
						kategori: req.param('kategori'),
						size: req.param('size'),
						stok: req.param('stok'),
						harga: req.param('harga'),
						image: req.param('image')
					});
				}else{
					req.flash('msg_info', 'Sukses update barang'); 
					res.redirect('/barang');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there was an error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-barang', 
		{ 
			nama: req.param('nama'), 
			merek: req.param('merek')
		});
	}
});

router.delete('/delete/(:id)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var barang = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from barang where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/barang');
				}
				else{
					req.flash('msg_info', 'Sukses menghapus barang'); 
					res.redirect('/barang');
				}
			});
		});
	});
});

module.exports = router;