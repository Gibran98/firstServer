console.log("SOMETHING");

function init(){
	//CALL TO THE API USING NATIVE JAVASCRIPT
	fetch('/api/students')
		.then( response => {
			if (response.ok){
				return response.json();
			}
			throw new Error (response.statusText);
		})
		.then(responseJSON => {
			for (let stud of responseJSON) {
				$("#studentList").append(`<li>${stud.firstName}</li>`)
			}
		})
		.catch(err=> {
			console.log(err);
		});
}

$(init);


function watchForm() {
	$("#dogForm").on("submit", function(event) {
		event.preventDefault();

		//CALL TO THE API USING NATIVE JAVASCRIPT
		/*let APIurl = 'https://dog.ceo/api/breeds/image/random';
		let settings = {
			method: "GET"
		};

		fetch(APIurl, settings) 
			.then(function(response) {
				console.log(response);
				if(response.ok){
					return response.json();
				}

				throw new Error( "Something went wrong: " + response.statusText);
			})
			.then( function(responseJSON){
				console.log(responseJSON);
				$("#dogImages").append(`<li><img src="${responseJSON.data.memes[number(math.random()].url}"/></li>`);
			})
			.catch( function(err){
				$("#dogImages").html(`<li>Something went wrong. Try again later</li>`);
			})
		*/

		//CALL TO THE API USING JQUERY
		$.ajax({
			url: 'https://dog.ceo/api/breeds/image/random',
			//data : OBJECT WITH PARAMETERS
			method: 'GET',
			dataType: 'json', //TYPE OF DATA TO BE RECIEVED
			//ContentType: TYPE OF DATA TO BE SENT TO THE API
			success: function(responseJSON){
						console.log(responseJSON);
						$("#dogImages").append(`<li><img src="${responseJSON.message}"/></li>`);
					},
			error: function(err){
						$("#dogImages").html(`<li>Something went wrong. Try again later</li>`);
					}
		})
	});

	$("ul").on("click", "li", function(event) {
		event.preventDefault();

		console.log("Clicked the image");
	})
}

//watchForm();