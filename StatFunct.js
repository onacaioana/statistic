var func = require('./statisticsLibrary');
var mysql = require('mysql');

//current date
var date = new Date();
var current_month = date.getMonth();
var current_year = date.getFullYear();


var interval = [];
var val = []; 

var conn = {
		    host     : 'localhost',
		    user     : 'root',
		    password : 'ioana',
		    database : 'Statistics',
		    supportBigNumbers : true,
		    bigNumberStrings : true,
		    multipleStatements: true
		   };


function MediumNrOfProjects()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();
	



		connection.query('SELECT InternID FROM Users',function (err,UsersResult)
		{
			if (err) throw err;				
		
			connection.query('SELECT Data FROM Operations WHERE TypeOperation = "A" AND TableEntry="Projects" ',
							 function (err,ProjectsResult)
							 {

								var NoProjectsPerUser=0;
								var i=0;
								var j=ProjectsResult.length;

								for(i=0;i<j;i++){
									var da = new Date(ProjectsResult[i].Data);
									if((current_month-1 == da.getMonth() || current_month == da.getMonth()) & current_year == da.getFullYear())
										NoProjectsPerUser++;
									}
								NoProjectsPerUser=NoProjectsPerUser/UsersResult.length;
								
								//do something with result
								connection.end();
							 });
		});
	}

function MedianNrOfProjects()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();
	



		connection.query('SELECT InternID FROM Users',function (err,UsersResult)
		{
			if (err) throw err;				
		
			connection.query('SELECT Data,UserID FROM Operations WHERE TypeOperation = "A" AND TableEntry="Projects" ',
							function (err,ProjectsResult)
							{
							 	var ProjectList=[];
								var NoProjectsPerUser=0;
								var contor=0;
								var median=0;

								for(var j=0;j<UsersResult.length;j++){
									NoProjectsPerUser=0;
									for(var i=0;i<ProjectsResult.length;i++){
										var da = new Date(ProjectsResult[i].Data);
										if(UsersResult[j].InternID == ProjectsResult[i].UserID)
											if((current_month-1 == da.getMonth() || current_month == da.getMonth()) & current_year == da.getFullYear())
												NoProjectsPerUser++;
									}	
									ProjectList[contor]=NoProjectsPerUser;
									contor++;
								}
								ProjectList = ProjectList.sort();
								
								if(contor % 2 ==1)
									median = ProjectList[contor/2];
								else{
									var p=(contor-1)/2;
									median =(ProjectList[contor/2] +ProjectList[Math.floor(p)])/2;			
								}
								//do something with the result
								connection.end();
							});
		});
	}

function MediumProjectPerUserWithPro()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();
	



		connection.query('SELECT InternID FROM Users',function (err,UsersResult)
		{
			if (err) throw err;				
		
			connection.query('SELECT Data,UserID FROM Operations WHERE TypeOperation = "A" AND TableEntry="Projects" ',
							 function (err,ProjectsResult)
							{

								var NumberProjects=0;
								var ActivUserNo=0;
								var PasiveUserNo=0;
								var i=0;
								var j=ProjectsResult.length;

								//search projects for 1 month
								for(i=0;i<j;i++)
									{
									var da = new Date(ProjectsResult[i].Data);
									if((current_month-1 == da.getMonth() || current_month == da.getMonth()) & current_year == da.getFullYear())
										NumberProjects++;

								
									
									}
								//search pasive users(users without projects)
								var ok=0;
								for(var ii=0;ii<UsersResult.length;ii++)
									if(UsersResult[ii].InternID in ProjectsResult)
									ok=1;
								
								if(ok==0)
								PasiveUserNo++;		

								ActivUserNo=UsersResult.length - PasiveUserNo;
								NumberProjects=NumberProjects/ActivUserNo;
								
								//do something with result
								connection.end();
							});
		});
	}

function MedianProjectPerUserWithPro()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();
	



		connection.query('SELECT InternID FROM Users',function (err,UsersResult)
		{
			if (err) throw err;				
		
			connection.query('SELECT Data,UserID FROM Operations WHERE TypeOperation = "A" AND TableEntry="Projects" ',
							 function (err,ProjectsResult)
							{

								var NumberProjects=0;
								var ActivUserNo=UsersResult.length;
								var ProjectList =[];
								var contor=0;
								var median=0;
								//search projects for 1 month
								for(var j=0;j<UsersResult.length;j++){
									NumberProjects=0;
									for(var i=0;i<ProjectsResult.length;i++){
										var da = new Date(ProjectsResult[i].Data);
										if(UsersResult[j].InternID == ProjectsResult[i].UserID)
										if((current_month-1 == da.getMonth() || current_month == da.getMonth()) & current_year == da.getFullYear())
											NumberProjects++;
									}
									if(NumberProjects == 0)
										ActivUserNo--;
									else {
										ProjectList[contor] = NumberProjects;
										contor++;
									}
									
								}

								ProjectList = ProjectList.sort();
								if(contor % 2 ==1)
									median = ProjectList[(contor-1)/2];
								else{
									var p=(contor-1)/2;
									median =(ProjectList[contor/2] +ProjectList[Math.floor(p)])/2;	
										
								}	
								//do something with the result
								connection.end();
							});
		});
	}

function SplitTenPercentOnXAxis()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();

	connection.query('SELECT InternID FROM Projects ',function (err,ProjectResult){
		N=ProjectResult.length;
		
		k=(Math.floor)(0.1*N);
		if (k==0) 
			k=1;
		interval[0]=k;
		
		for (var i=1;i<10&&interval[i-1]<N;i++){
			interval[i]=interval[i-1]+k;
		}
		if (N!=interval[i-1])
			interval[i]=N;
		//initialize hash with 0
		for(var j=0;j<interval.length;j++){
			val[interval[j]]=0;
		}
	});
	}

function ProjectsPerUser()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();

	connection.query('SELECT InternID FROM Users ',function (err,UsersResult)
		{
		if (err) throw err;	
		connection.query('SELECT * FROM Projects',
						 function (err,ProjectsResult)
						 {	
						 	if (err) throw err;	

						 		//interval - splits a barchart in 10 equal ranges on X axis based on No Max of Projects/User
						 		N=ProjectsResult.length;
								k=(Math.floor)(0.1*N);
								if (k==0) 
									k=1;
								interval[0]=k;
								
								for (var i=1;i<10&&interval[i-1]<N;i++){
									interval[i]=interval[i-1]+k;
								}
								if (N!=interval[i-1])
									interval[i]=N;

								//initialize hash with 0
								for(var j=0;j<interval.length;j++){
									val[interval[j]]=0;
								}	

							//find nr_of_projects for each user
						 	var NrProject=0;
							for(var i=0;i<UsersResult.length;i++)
							{
								NrProject=0;
								for(var ii=0;ii<ProjectsResult.length;ii++)
									{

										if(ProjectsResult[ii].UserID == UsersResult[i].InternID)
											NrProject++;

									}

								var nr=NrProject;
									if (nr<interval[0] && nr!=0)
										val[interval[0]]++;
									else
										for(var j=1;j<interval.length;j++)
										{
											if (nr<interval[j] && nr>=interval[j-1])
												val[interval[j-1]]++;
										}
							}
							console.log('Valorile intervalelor '+interval+' sunt: '+val);
							connection.end();
						});
		});
	}

function MonthlyRegistered()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();

	connection.query('SELECT InternID FROM Users ',function (err,UsersResult)
	{
		if (err) throw err;	
		var NrOfLog=0;
		connection.query('SELECT * FROM `LogTable` WHERE `In`= 1',
						function (err,LogResult){
							
							if (err) throw err;	
							for(var i=0;i<UsersResult.length;i++){
						    	
						    	var MinLogIn= new Date();
						    	for(var j=0;j<LogResult.length;j++){
						    		
						    		if(LogResult[j].UserID == UsersResult[i].InternID && MinLogIn > LogResult[j].Data)
						    			MinLogIn=LogResult[j].Data;	
								}
								if((current_month-1 == MinLogIn.getMonth() || current_month == MinLogIn.getMonth()) & current_year == MinLogIn.getFullYear())
									NrOfLog++;
								
						    }
			            	console.log(NrOfLog);
			            });	
 	connection.end();
	});
	}

function OnlineHours()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();

		connection.query('SELECT InternID FROM Users ',function (err,UsersResult)
		{
			if (err) throw err;	
			
			connection.query('SELECT * FROM `LogTable` WHERE  `In`= 1 ; SELECT * FROM `LogTable` WHERE `Out`= 1',
						function (err,LogResult){
							var NrOfHours=0;
							for(var i=0;i<UsersResult.length;i++){

								var LogIns=[];
								var LogOuts=[];
						
								for (var j=0;j<LogResult[0].length;j++){
									if(LogResult[0][j].UserID==UsersResult[i].InternID){
										LogIns.push(LogResult[0][j].Data);
									}
								}

								for (var j=0;j<LogResult[1].length;j++){
									if(LogResult[1][j].UserID==UsersResult[i].InternID){
										LogOuts.push(LogResult[1][j].Data);
									}
								}
								//it is possible that someone is still loged in
								var x;
								if (LogIns.length==LogOuts.length)
									x=LogIns.length;
								else 
									x=LogIns.length-1;
								for (var j=0;j<x ;j++){

									var a=LogIns[j];
									var b=LogOuts[j];
									var k=(b-a)/3600000;
									NrOfHours+=k;
								}
							}
							console.log(NrOfHours);
							//result
	 						connection.end();
						});	

		});
	}

function MedianTimeRunGadget()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();
		connection.query('SELECT * FROM Operations WHERE TypeOperation ="R" ',function (err,RunResult){
			if (err) throw err;		
			connection.query('SELECT InternID FROM Users',
							function (err,UsersResult){
								if (err) throw err;				
								var NrOfLog=0;
								connection.query('SELECT * FROM `LogTable` WHERE `In`= 1',
												function (err,LogResult){
													if (err) throw err;	
													var TimeList = [];
													var contor=0;
													var median= 0;
													for(var i=0;i<UsersResult.length;i++){
												    	
												    	//first Registration and first RunGadget(or minim)
												    	var MinLogIn= new Date();
												    	var MinRun1= new Date();

												    	for(var j=0;j<LogResult.length;j++){
												    		if(LogResult[j].UserID == UsersResult[i].InternID && MinLogIn > LogResult[j].Data)
												    			MinLogIn=LogResult[j].Data;	
														}
													
												    	for(var j=0;j<RunResult.length;j++){
												    		if(RunResult[j].UserID == UsersResult[i].InternID && MinRun1 > RunResult[j].Data)
												    			MinRun1=RunResult[j].Data;	
														}
														TimeList[contor]=(MinLogIn-MinRun1)/3600000;
														contor++;
													}
													TimeList = TimeList.sort();
								
													if(contor % 2 ==1)
														median = TimeList[contor/2];
													else{
														var p=(contor-1)/2;
														median =(TimeList[contor/2] +TimeList[Math.floor(p)])/2;			
													}
													//do something with the result
													console.log(median);
													connection.end();
												});
							});
		});
	}

function GadgetsUsage()
	{
	var connection = mysql.createConnection(conn);	
	connection.connect();
		connection.query('SELECT GadgetName FROM Gadgets ',
						function (err,GadgetResult){
							if (err) throw err;
							var hash = [];
							for(var i=0;i<GadgetResult.length;i++){
								if(!(GadgetResult[i].GadgetName in hash))
									hash[GadgetResult[i].GadgetName]=0;
								hash[GadgetResult[i].GadgetName]++;
							}
							console.log(hash);
   						
						});
		connection.end();
	}

//OnlineHours();
GadgetsUsage();

//pentru luna actuala nu pt o luna intro+ dusa de noi
//ziua mai trebuie verificata
//proiecte adaugata(din Options table) chiar daca au fost sterse in luna respectiva
//MediumNrOfProjects();

//luna actuala
//proiecte adaugata chiar daca au fost sterse in luna respectiva
//ziua verificata
//ProjectPerUserWithPro();


//ProjectsPerUser();
//SplitTenPercentOnXAxis();


//MonthlyRegistered();
//MedianNrOfProjects();
//MedianProjectPerUserWithPro();
//MedianTimeRunGadget();

