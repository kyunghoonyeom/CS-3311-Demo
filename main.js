'use strict';

var appointments = {};
var static_inst = 0;

var end = new Date()
end.setMonth(end.getMonth() + 3);

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
                {type: 'button', class: 'btn mb-2 mt-2 mx-auto btn-danger', onClick: () => { confirm_cancellation(this.id) }},
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

function add_appointment(datetime, doctor) {
    appointments[static_inst] = new Appointment({}, datetime, doctor, static_inst);
    static_inst++;
    render();
}

function delete_appointment(id) {
    delete appointments[id];
    render();
}

function confirm_cancellation(id) {
    var r = confirm("Do you really cancel the appointment?");
    if (r == true) {
        return delete_appointment(id);
    } else {
        return;
    }
}

function demo_add() {
    var doctor = window.prompt("Enter the doctor's name: ");
    add_appointment(randomDate(new Date(), end), doctor);
}

function demo_wipe() {
    appointments = {};
    static_inst = 0;
    render();
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function openForm() {
    document.getElementById("add").style.display = "block";
}

function closeForm() {
    document.getElementById("add").style.display = "none";
}

function confirmForm() {
    var doctor = document.getElementById('doctor');
    var datetime = document.getElementById('datetime');

    if (doctor.value != '' && datetime.value != '') {
        add_appointment(datetime, doctor);
        closeForm();
    } else {
        window.alert('Fill out the entries.');
    }
}