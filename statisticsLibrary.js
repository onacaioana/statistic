var mysql      = require('mysql');
var conn = {
  host     : 'localhost',
  user     : 'root',
  password : 'ioana',
  database : 'Statistics',
  supportBigNumbers : true,
  bigNumberStrings : true,
};

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

	//clar e bun
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
					 Table: 'Projects',
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
							 Table: 'Projects',
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

	//la asta inca nu am facut conexiunea ok
	// 'sxasdacascascsacasca','123we'
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
							 Table: 'Projects',
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
									 Table: 'Files',
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
								 Table: 'Files',
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
												 Table: 'Files',
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
	//inca nu am facut conexiunea ok
	// TypeOperation= 'R'
		//neterminat
	RunProject: function(userid,projectid,gadgetid,datatime)
	{
		 var connection = mysql.createConnection(conn);
		 connection.connect();

		StatisticsLibrary.GetUserID(userid,function (err,resultuser)
			{
				if (err) throw err;

				StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
				{


						var newo  = {TypeOperation: 'R',
									 Table: 'Projects',
									 IDEntry: resultproject[0].InternID,
									 Data: datatime,
									 UserID: resultuser
									};
				
						connection.query('INSERT INTO Operations SET ?', newo);
									
						connection.end();
				});
		});
	},
	//nu am in tabelu operatii un camp pt a arata cu ce gadget face verificarea la fel ca si la share,run etc
	VerifyProject: function(userid,projectid,gadgetid,datatime)
	{
	 var connection = mysql.createConnection(conn);
		 connection.connect();

		StatisticsLibrary.GetUserID(userid,function (err,resultuser)
			{
				if (err) throw err;

				StatisticsLibrary.GetProjectID(projectid,resultuser,function(err,resultproject)
				{


						var newo  = {TypeOperation: 'V',
									 Table: 'Projects',
									 IDEntry: resultproject[0].InternID,
									 Data: datatime,
									 UserID: resultuser
									};
				
						connection.query('INSERT INTO Operations SET ?', newo);

						connection.end();
										

				});
		});		
	},

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
									 Table: 'Projects',
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
															 Table: 'Files',
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
	//inca nu am facut conexiunea ok


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
						 Table: 'Gadgets',
						 IDEntry: resultgadget.insertId,
						 Data: datatime,
						 UserID: resultuser[0].InternID
							}
	
				connection.query('INSERT INTO Operations SET ?', newo);
				connection.end();
			});		
		});

	},

	RemoveGadget: function(userid,gadgetid,datatime)
	{
		 var connection = mysql.createConnection(conn);
		 connection.connect();

		StatisticsLibrary.GetGadgetID(gadgetid,function(err,resultgadget)
		{
			StatisticsLibrary.GetUserID(userid,function(err,resultuser)
				{
					var newo  = {TypeOperation: 'D',
								 Table: 'Gadgets',
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
								 Table: 'Files',
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
	//TypeOperation 'C'
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
									 Table: 'Gadgets',
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


	//AddGadget: function(userid,gadgetid,datatime,gadgetName)
//StatisticsLibrary.AddGadget('userid_1','gaddetid_1','2014-02-02 16:02:02','placutaRasp');
