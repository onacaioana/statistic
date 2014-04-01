var func = require('./statisticsLibrary');
var mysql = require('mysql');
var conn = {
  host     : 'localhost',
  user     : 'root',
  password : 'ioana',
  database : 'Statistics',
  supportBigNumbers : true,
  bigNumberStrings : true,
};



function ProjectPerUser()
{
var connection = mysql.createConnection(conn);	
	connection.connect();
	var NoProjectsPerUser=0;
		connection.query('SELECT InternID FROM Users',function (err,UsersResult)
		{
			if (err) throw err;				
			
			connection.query('SELECT InternID FROM Projects',function (err,ProjectsResult)
			{

				NoProjectsPerUser=ProjectsResult.length/UsersResult.length;
				console.log(NoProjectsPerUser);
			});
		});
}
ProjectPerUser();
