'use strict';

var appointments = {};
var static_inst = 0;

/*
Very important!

React.createElement(type, {class: 'hey', child1, child2, child3...)

is equivalent to

<type class="hey">
	<child1></child1>
	<child2></child2>
	<child3></child3>
	...
</type>

in HTML!

Note: Children can include nested elements!
*/

const e = React.createElement; //so we don't have to keep typing it

const CardWidth = {
	width : '50%',
}

class Appointment extends React.Component {
	constructor(props, datetime, doctor, id) {
		super(props);
		this.datetime = datetime;
		this.doctor = doctor;
		this.id = id;
	}

	render() {
		var dateString =
			this.datetime.getUTCFullYear() + "." +
			("0" + (this.datetime.getUTCMonth()+1)).slice(-2) + "." +
			("0" + this.datetime.getUTCDate()).slice(-2)
		var timeString = 
			("0" + this.datetime.getUTCHours()).slice(-2) + ":" +
			("0" + this.datetime.getUTCMinutes()).slice(-2);
		var block = e('div',
			{class: 'card border-dark mt-2 mx-auto text-center', style : CardWidth},
			e(
				'div',
				{class: 'card-header'},
				"Date: " + dateString + "\n" +
				"Time: " + timeString
			),
			e(
				'div',
				{class: 'card-text'},
				"Doctor: " + this.doctor
			),
			e(
				'button',
				{type: 'button', class: 'btn mb-2 mt-2 mx-auto btn-danger', onClick: () => { delete_appointment(this.id) }},
				'Cancel'
			)
		);
		return block;
	}
}

function render() {
	const domContainer = document.querySelector('#appointment_list');

	var list = Object.keys(appointments).map(function(key) {
    	return appointments[key];
	});

	list.sort(function(a,b){
  		return new Date(a.datetime) - new Date(b.datetime);
	});

	var child = []
	
	for (var i = 0; i < list.length; i++) {
		child.push(list[i].render())
	}
	if (child.length === 0) {
		child.push("No appointment exists")
	}
	ReactDOM.render(e('div', 
		{},
		...child //... operator unpacks list into arguments
	), domContainer);
}

function add_appointment() {
	var doctor = window.prompt("Enter the doctor's name: ");
	var datetime = new Date();
	datetime.setDate(datetime.getDate() + static_inst);
	appointments[static_inst] = new Appointment({}, datetime, doctor, static_inst);
	static_inst++;
	render();
}

function delete_appointment(id) {
	delete appointments[id];
	render();
}
