var mysql      = require('mysql');
var conn = {
  host     : 'localhost',
  user     : 'root',
  password : 'ioana',
  database : 'Statistics',
  supportBigNumbers : true,
  bigNumberStrings : true,
};


//testare git=>noob
var StatisticsLibrary = {

	
	GetGadgetID : function(gadgetid,callback)
	{
		var connection = mysql.createConnection(conn);
		connection.connect();
	    connection.query('SELECT InternID FROM Gadgets WHERE ExternID = ?',gadgetid,
						 function(err, result)
					 	 {
						  	if (err) throw err;
						  	callback(null,result[0].InternID);
							connection.end();
					 	});

	},

	GetUserID : function(userid,callback)
	{
			 var connection = mysql.createConnection(conn);
			 connection.connect();
		var q = connection.query('SELECT InternID FROM Users WHERE ExternID = ?',userid,

		 function(err, result)
	 	 {
		  	if (err) throw err;


		  	//problema cand useru nu exista in BD
	  		if(result[0] == undefined){
	  		 	 var newu = {ExternID: userid};
	  			 connection.query('INSERT INTO Users SET ?',newu,
			 	 	function(err, result){
				 	if (err) throw err;
				 	 
				 	callback(null,result.insertId);
					connection.end();
					});
	  			
	  		 	 }

	  		 else
	  		 {	callback(null,result[0].InternID);
	  		 	connection.end();
	  		 }
		});
	},

	GetFileID : function(fileid,callback)
	{
	
		 var connection = mysql.createConnection(conn);
		 connection.connect();
		connection.query('Select * FROM Files WHERE ExternID = ?',[fileid], 
			function(err, result)
		 	{
		 		console.log(result);
			  if (err) throw err;
			  callback(null,result[0].InternID)
			  connection.end();
			});

	},

	GetProjectID : function(projectid,userid,callback)
	{
			 var connection = mysql.createConnection(conn);
	 			connection.connect();

			var q = connection.query('SELECT * FROM Projects WHERE ExternID = ? AND UserID = ?',[projectid,userid], function(err, result)
		 	{
			  if (err) throw err;
			  callback(null,result);
			  connection.end();
			});
	 
	},
	GetProjectFiles:function(projectid,callback)
	{
			 var connection = mysql.createConnection(conn);
			 connection.connect();

		var q = connection.query('SELECT * FROM Files WHERE IDProject = ?',projectid, 
			function(err, result)
		 	{
			  if (err) throw err;
			  callback(null,result);
			  connection.end();
			});


	},
	//StatisticsLibrary.NewProject(userid,projectid,nume,language,datatime);
	NewProject : function(userid, projectid, nume, language, datatime)
	{
		 var connection = mysql.createConnection(conn);
			 connection.connect();

		StatisticsLibrary.GetUserID(userid,function(err,resultuser)
		{
			if (err) throw err;
			var newp  = {ExternID: projectid,
				 ProjectName: nume,
				 Language: language,
				 UserID: resultuser
				};
		    connection.query('INSERT INTO Projects SET ?', newp, function(err, resultproject)
		 	{
		 		if (err) throw err;

				var newo  = {TypeOperation: 'A',
					 TableEntry: 'Projects',
					 IDEntry: resultproject.insertId,
					 Data: datatime,
					 UserID: resultuser
					};
		
				connection.query('INSERT INTO Operations SET ?', newo,function(err,result)
				{
					connection.end();
				});
			});
		});
	},
		//REDENUMIRE PROJECT..ALTCEVA ce ar mai trebui??

	//StatisticsLibrary.ModifyProject(projectid,nameproject,language,userid,datatime)
	ModifyProject : function(projectid,nameproject,language,userid,datatime)
	{
		 var connection = mysql.createConnection(conn);
			 connection.connect();

		//setInterval(function(){console.log("Hello")},3000);
		StatisticsLibrary.GetUserID(userid,function(err,resultuser)
			{
			if (err) throw err;
		
			StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
				{	
					
				connection.query('UPDATE Projects SET ProjectName = ?  WHERE InternID = ?',
								[nameproject,resultproject[0].InternID]);

				var newo  = {TypeOperation: 'M',
							 TableEntry: 'Projects',
							 IDEntry: resultproject[0].InternID,
							 Data: datatime,
							 UserID: resultuser
							};

				connection.query('INSERT INTO Operations SET ?',
								 newo,function(err,result)
								 {

								 connection.end();

								 });
				
				});
			});
	},

	//StatisticsLibrary.RemoveProject(projectid,userid,datatime)
	RemoveProject : function(projectid,userid,datatime)
	{
		 var connection = mysql.createConnection(conn);
			 connection.connect();

		StatisticsLibrary.GetUserID(userid,function(err,resultuser)
		{
			if (err) throw err;
			StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
			{

				var newo  = {TypeOperation: 'D',
							 TableEntry: 'Projects',
							 IDEntry: resultproject[0].InternID,
							 Data: datatime,
							 UserID: resultuser
							};

				connection.query('INSERT INTO Operations SET ?', newo);

				StatisticsLibrary.GetProjectFiles(resultproject[0].InternID,function(err,resultfile)
				{
					var i=0;
					for ( i=0;resultfile[i]!=undefined;i++)
					{
							newo  = {TypeOperation: 'D',
									 TableEntry: 'Files',
									 IDEntry: resultfile[i].InternID,
									 Data: datatime,
									 UserID: resultuser
									};

							connection.query('INSERT INTO Operations SET ?', newo);
							connection.query('DELETE FROM Files WHERE IDProject = ?',resultproject[0].InternID);
					}
					connection.query('DELETE FROM Projects WHERE InternID = ? AND UserID = ?',[resultproject[0].InternID,resultuser],function(err,result)
						{
							connection.end();

						});
					
				});
			});
		});
	},



	//StatisticsLibrary.LogIn(userid,datatime)
	LogIn : function(userid,datatime)
	{
	 var connection = mysql.createConnection(conn);
		 connection.connect();

	StatisticsLibrary.GetUserID(userid,function(err,resultuser)
		{
			var newlog = {In: 1,
						  Data: datatime,
						  UserID: resultuser 
						 };

			connection.query("INSERT INTO LogTable	SET ?",newlog,function(err,result)
				{
					connection.end();

				});
		
		});
	},

	//StatisticsLibrary.LogOut(userid,datatime)
	LogOut : function(userid,datatime)
	{
		 var connection = mysql.createConnection(conn);
			 connection.connect();

		StatisticsLibrary.GetUserID(userid,function(err,resultuser)
		{
			var newlog = {Out: 1,
						  Data: datatime,
						  UserID: resultuser 
						 };

			connection.query("INSERT INTO LogTable	SET ?",newlog,function(err,result)
				{
					connection.end();
				});
			
		});
	},

	//StatisticsLibrary.CreateFile(userid,projectid,fileid,filename,datatime);
	CreateFile : function(userid,projectid,fileid,filename,datatime)
	{	
		var connection = mysql.createConnection(conn);
		connection.connect();

		StatisticsLibrary.GetUserID(userid,function(err,resultuser)
			{
			if (err) throw err;

			StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
				{
				if (err) throw err;

				var newf  = {ExternID: fileid,
							 FileName: filename,
							 IDProject: resultproject[0].InternID
							};

		   		connection.query('INSERT INTO Files SET ?', newf, function(err, result)
			 		{
			 		if (err) throw err;

					var newo  = {TypeOperation: 'A',
								 TableEntry: 'Files',
								 IDEntry: result.insertId,
								 Data: datatime,
								 UserID: resultuser
								};
			
					connection.query('INSERT INTO Operations SET ?', newo);
					connection.end();
					});
				});
			});
	},

	//StatisticsLibrary.RenameFile(userid,projectid,fileid,filename,datatime);
	RenameFile : function(userid,projectid,fileid,filename,datatime)
	{	
	 var connection = mysql.createConnection(conn);
		 connection.connect();

	 StatisticsLibrary.GetUserID(userid,function(err,resultuser)
		{
		if (err) throw err;

		StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
			{
			if (err) throw err;

			StatisticsLibrary.GetFileID(fileid,function(err,resultfile)
				{
				if (err) throw err;
		   		connection.query('UPDATE Files SET FileName = ?  WHERE InternID = ? AND IDProject = ?',
			    				 [filename,resultfile,resultproject[0].InternID],
			    				 function(err,result)
			    				 {

			    				 	if (err) throw err;
			    				 

								
									var newo  = {TypeOperation: 'N',
												 TableEntry: 'Files',
												 IDEntry: resultfile,
												 Data: datatime,
												 UserID: resultuser
												};
							
									connection.query('INSERT INTO Operations SET ?', newo);
									
									connection.end();
								});	
				});
			});
		});
	},
	//StatisticsLibrary.RunProject(userid,projectid,gadgetid,datatime);
	RunProject: function(userid,projectid,gadgetid,datatime)
	{
		var connection = mysql.createConnection(conn);
		connection.connect();

		StatisticsLibrary.GetUserID(userid,function (err,resultuser)
			{
				if (err) throw err;

				StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
				{

					StatisticsLibrary.GetGadgetID(gadgetid,function(err,resultgadget)
					{
						var newo  = {TypeOperation: 'R',
									 TableENtry: 'Projects',
									 TableENtry2:'Gadgets',
									 IDEntry: resultproject[0].InternID,
									 IDEntry2: resultgadget,
									 Data: datatime,
									 UserID: resultuser
									};
				
						connection.query('INSERT INTO Operations SET ?', newo);
									
						connection.end();
					});
				});
		});
	},

	VerifyProject: function(userid,projectid,gadgetid,datatime)
	{
	    var connection = mysql.createConnection(conn);
		connection.connect();

		StatisticsLibrary.GetUserID(userid,function (err,resultuser)
			{
				if (err) throw err;

				StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
				{

					StatisticsLibrary.GetGadgetID(gadgetid,function(err,resultgadget)
					{
						var newo  = {TypeOperation: 'V',
									 TableENtry: 'Projects',
									 TableENtry2:'Gadgets',
									 IDEntry: resultproject[0].InternID,
									 IDEntry2: resultgadget,
									 Data: datatime,
									 UserID: resultuser
									};
				
						connection.query('INSERT INTO Operations SET ?', newo);
									
						connection.end();
					});
				});
		});		
	},

	//StatisticsLibrary.ShareProject(ownerid,userid,projectid,datatime);
	//nu stiu daca e tocmai ok ca am duplicat toate fisierele si proiectu?!?!
	ShareProject: function(ownerid,userid,projectid,datatime)
	{
		 var connection = mysql.createConnection(conn);
		 connection.connect();

		StatisticsLibrary.GetUserID(ownerid,function(err,resultuser)
		{
			if (err) throw err
			
			StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
			{

				StatisticsLibrary.GetUserID(userid,function(err,resultuser1)
				{
				if (err) throw err

				var newp  = {ExternID: projectid,
							 ProjectName: resultproject[0].ProjectName,
							 Language: resultproject[0].Language,
							 UserID: resultuser1
							};

			    connection.query('INSERT INTO Projects SET ?', newp,function(err,result)
				    {
				    	StatisticsLibrary.GetProjectFiles(resultproject[0].InternID,function(err,resultfile)
						{
							var i=0;
	

							var newo  = {TypeOperation: 'S',
									 TableEntry: 'Projects',
									 IDEntry: result.insertId,
									 Data: datatime,
									 UserID: resultuser1
									};
							

							connection.query('INSERT INTO Operations SET ?', newo);	
							for ( i=0;resultfile[i]!=undefined;i++)
							{

							
								var neww = {
											ExternID: resultfile[i].ExternID,
											FileName: resultfile[i].FileName,
											IDProject: result.insertId
										   };

								connection.query('INSERT INTO Files SET ?',neww,
												function(err,resu)
												{
													console.log(resu);
													newo  = {TypeOperation: 'C',
															 TableEntry: 'Files',
															 IDEntry: resu.insertId,
															 Data: datatime,
															 UserID: resultuser1
															};

													connection.query('INSERT INTO Operations SET ?', newo);
					   							
												});
							}
								connection.end();
						});


					});	
				});
			});
		});
	},


	//EditFile ??

	//StatisticsLibrary.AddGadget(userid,gadgetid,datatime,gadgetName);
	AddGadget: function(userid,gadgetid,datatime,gadgetName)
	{
	var connection = mysql.createConnection(conn);	
		connection.connect();


		connection.query('SELECT InternID FROM Users WHERE ExternID = ?',userid,function (err,resultuser)
		{
			if (err) throw err;

			var newG={
					ExternID:gadgetid,
					GadgetName:gadgetName,
					UserID:resultuser[0].InternID
					}
			connection.query('INSERT INTO Gadgets SET ?',newG,function(err,resultgadget)
			{
				if (err) throw err;
				var newo  = {TypeOperation: 'A',
						 TableEntry: 'Gadgets',
						 IDEntry: resultgadget.insertId,
						 Data: datatime,
						 UserID: resultuser[0].InternID
							}
	
				connection.query('INSERT INTO Operations SET ?', newo);
				connection.end();
			});		
		});

	},

	//StatisticsLibrary.RemoveGadget(userid,gadgetid,datatime);
	RemoveGadget: function(userid,gadgetid,datatime)
	{
		 var connection = mysql.createConnection(conn);
		 connection.connect();

		StatisticsLibrary.GetGadgetID(gadgetid,function(err,resultgadget)
		{
			StatisticsLibrary.GetUserID(userid,function(err,resultuser)
				{
					var newo  = {TypeOperation: 'D',
								 TableEntry: 'Gadgets',
								 IDEntry: resultgadget,
								 Data: datatime,
								 UserID: resultuser
								};
					connection.query('INSERT INTO Operations SET ?', newo);

					connection.query('DELETE FROM Gadgets WHERE InternID = ? AND UserID = ?',
									 [resultgadget,resultuser]);
					connection.end();
				});


		});
	},

	//StatisticsLibrary.RemoveFile(userid,projectid,fileid,datatime);
	RemoveFile: function(userid,projectid,fileid,datatime)
	{
		 var connection = mysql.createConnection(conn);
		 connection.connect();

		StatisticsLibrary.GetUserID(userid,function(err,resultuser)
		{
			if (err) throw err;
			StatisticsLibrary.GetFileID(fileid,function(err,resultfile)
			{
				if (err) throw err;
				StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
				{
					var newo  = {TypeOperation: 'D',
								 TableEntry: 'Files',
								 IDEntry: resultfile,
								 Data: datatime,
								 UserID: resultuser
								};
					connection.query('INSERT INTO Operations SET ?', newo);

					connection.query('DELETE FROM Files WHERE InternID = ? AND IDProject = ?',
									 [resultfile,resultproject[0].InternID]);
					connection.end();
				
				});
			});
		});
	},

	 //StatisticsLibrary.ConfigureGadget(userid,gadgetid,datatime);
	ConfigureGadget: function(userid,gadgetid,datatime)
	{
		 var connection = mysql.createConnection(conn);
		 connection.connect();

		StatisticsLibrary.GetUserID(userid,function (err,resultuser)
			{
				if (err) throw err;

				StatisticsLibrary.GetGadgetID(gadgetid,function(err,resultgadget)
				{


						var newo  = {TypeOperation: 'C',
									 TableEntry: 'Gadgets',
									 IDEntry: resultgadget,
									 Data: datatime,
									 UserID: resultuser
									};
				
						connection.query('INSERT INTO Operations SET ?', newo);
									
						connection.end();
				});
		});		
	},

}


	/*//AddGadget: function(userid,gadgetid,datatime,gadgetName)
//StatisticsLibrary.AddGadget('userid_1','gaddetid_1','2014-02-02 16:02:02','placutaRasp');
function generate_userid(i){
	i=i % 18+100;
	var s='';
	s+='a'+i.toString();
	return s;
}

function generate_gadgetid(i){
	i=i % 10+1000;
	var s='';
	s+='g'+i.toString();
	return s;
}

function generate_projectid(i){
	i=i % 21+100;
	var s='';
	s+='p'+i.toString();
	return s;
}

function generate_datatime(i){
	i=i % 9+1;
	var s='2014-0'+i.toString()+'-04 16:02:02';
	return s;
}

function generate_fileid(i){
	i=i % 10+1000;
	var s='';
	s+='f'+i.toString();
	return s;
}

function generate_filename(i){
	i=i % 10+1000;
	var s='';
	s+='filee'+i.toString();
	return s;
}

var i=0;
for (var ii=20;ii<100;ii++){
	var userid=generate_userid(ii);
	var gadgetid=generate_gadgetid(ii);
	var datatime=generate_datatime(ii);
	var fileid=generate_fileid(ii);

	//console.log(ii);
	//StatisticsLibrary.ConfigureGadget(userid,gadgetid,datatime);
	//StatisticsLibrary.RemoveFile(userid,projectid,fileid,datatime);
	//StatisticsLibrary.RemoveGadget(userid,gadgetid,datatime);
	console.log('userid='+userid+'\t gadgetid='+gadgetid+'\t datatime='+datatime+'\t gadgetname='+'gadget'+ii.toString()+'\n');
	StatisticsLibrary.AddGadget(userid,gadgetid,datatime,'gadget'+ii.toString());
	//StatisticsLibrary.VerifyProject(userid,projectid,gadgetid,datatime);
	
	//StatisticsLibrary.CreateFile(userid,projectid,fileid,filename,datatime);

	//StatisticsLibrary.ModifyProject(projectid,nameproject,language,userid,datatime)
	//StatisticsLibrary.RemoveProject(projectid,userid,datatime)



}*/