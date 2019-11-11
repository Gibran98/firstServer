let mongoose = require('mongoose'); //dependency to connect Node with Mongo
mongoose.Promise = global.Promise; // 

let studentSchema = mongoose.Schema({ //Schema is a meethod to build a schema, you
	firstName : { type : String }, //pass in an object with the attributes the schema will have
	lastName : { type : String },
	id : { type : Number, required : true }
});

let Student = mongoose.model('Student', studentSchema); //Model is a method to create a collection

let StudentList = { //this object will contain all the queries for the database
	getAll : function(){
		return Student.find()
					.then(students => {
						return students;
					})
					.catch(error => {
						throw Error(error);
					})
	},
	post : function(newStudent) {
		return Student.create(newStudent)
			.then(student => {
				return student;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	getById : function(sId) {
		return Student.findOne({id : sId})
			.then(student => {
				return student;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	deleteById : function(sId) {
		return Student.findOneAndRemove({id : sId})
			.then(student => {
				return student;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	updateById : function(newStud) {
		return Student.findOneAndUpdate({id : newStud.id}, {$set : {firstName:newStud.firstName, lastName:newStud.lastName}}, {new:true})
			.then(student => {
				return student;
			})
			.catch(error => {
				throw Error(error);
			})
	}
}


module.exports = {StudentList};