let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let app = express();
let jsonParser = bodyParser.json();
const {DATABASE_URL, PORT} = require('./config')

let { StudentList } = require('./model');
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use(express.static('public'));

app.use(morgan("dev"));

let students = [
	{
		name: "Mario",
		id: 52436
	},
	{
		name: "Maria",
		id: 83746
	},
	{
		name: "Pitz",
		id: 13425
	}
];

/*
	req: holds all the paremeters that the presentation layer will send
	res: holds the response that return to the front end
	next: used with middleware and specifies the next task to perform
*/
app.get("/api/students", (req, res, next)=> {
	StudentList.getAll()
		.then( students => {
			return res.status(200).json(students);
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})

	//res.statusMessage = "Something went wrong, please try again";
	//return res.status(400).json({message: "Something went wrong, please try again",status: 400}); //all apis by default send a status, the .json parses the 'students' array to a JSON
	//return res.status(200).json(students);
});

app.post("/api/postStudent", jsonParser,  (req, res) =>{
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let id = req.body.id;

	let newStudent = {
		firstName,
		lastName,
		id
	};

	if(!firstName || !lastName || !id) {
		res.statusMessage = "Missing field in body!";
		return res.status(406).json({
			message: "Missing field in body!",
			status: 406
		});
	}

	StudentList.getById(id)
		.then( student => {
			if(!student) {
				StudentList.post(newStudent)
					.then(student => {
						return res.status(201).json({
							message: "Student added to the list", 
							status: 201, 
							student : student
						});
					})
					.catch(error => {
						res.statusMessage = "Something went wrong with the DB. Try again later.";
						return res.status(500).json({
							message: "Something went wrong with the DB. Try again later.",
							status: 500
						});
					})
			} else {
				res.statusMessage = "Repeated identifier";
				return res.status(409).json({
					message: "Repeated identifier"
				});
			}			
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})

	
});

app.get("/api/getStudentById", (req, res, next) =>{
	if (!req.query.id){
		res.statusMessage = "Missing Id in params";
		return res.status(406).json({
			message: "Missing Id in params"
		});
	}

	StudentList.getById(req.query.id)
		.then( student => {
			if(!student) {
				res.statusMessage = "Student id not found on the list";
				return res.status(404).json({
					message: "Student id not found on the list",
					status: 404
				});
			}
			return res.status(200).json(student);
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})
});

app.delete("/api/removeStudent/:id", (req, res) =>{
	let id = req.params.id;
	let stud;

	StudentList.deleteById(req.params.id)
		.then( student => {
			if(!student) {
				res.statusMessage = "Student id not found on the list";
				return res.status(404).json({
					message: "Student id not found on the list",
					status: 404
				});
			}
			return res.status(200).json(student);
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})

	/*for (let i=0; i<students.length; i++){
		if (students[i].id == id){
			stud = students[i];
			students.splice(i, 1);

			return res.status(200).json(stud);
		}
	}

	return res.status(404).json({
		message: "Student is not on the list",
		status: 404
	});*/	

});

app.put("/api/updateStudent/:id", jsonParser, (req, res) => {
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let id = req.body.id;

	let newStud = {
		firstName,
		lastName,
		id
	}

	if(!firstName || !lastName || !id) {
		res.statusMessage = "Missing field in body!";
		return res.status(406).json({
			message: "Missing field in body!",
			status: 406
		});
	}

	if (id != req.params.id) {
		res.statusMessage = "Bad request: Id in params does not match with body";
		return res.status(400).json({
			message: "Bad request: Id in params does not match with body",
			status: 400
		});
	}

	StudentList.updateById(newStud)
		.then( student => {
			if(!student) {
				res.statusMessage = "Student id not found on the list";
				return res.status(404).json({
					message: "Student id not found on the list",
					status: 404
				});
			}
			return res.status(200).json(student);
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})
});

let server;
function runServer(port, databaseUrl) { //function to run when the server starts
	return new Promise((resolve, reject) => {
		mongoose.connect( databaseUrl, error => { //the 'error' parameter is only going to be holding
			if(error){							  //something when an error is triggered
				return reject(error);
			}

			server = app.listen(port, ()=> {
				console.log("Something is going on on port " + port);
				resolve();
			})
		})
	})
}

function closeServer(){
	 return mongoose.disconnect()
	 .then(() => {
	 	return new Promise((resolve, reject) => {
	 		console.log('Closing the server');
			server.close( err => {
				 if (err){
				 	return reject(err);
				 }
				 else{
				 	resolve();
				 }
			 });
	 	});
	 });
}

runServer(PORT, DATABASE_URL)
	.catch(error => {
		console.log(error);
	});

module.exports = {app, runServer, closeServer};
