function currentDate() {
	let today = new Date(),
		dd = today.getDate(),
		mm = today.getMonth() + 1,
		yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	} 
	if (mm < 10) {
		mm = '0' + mm;
	}
	
	today = dd + '/' + mm + '/' + yyyy;
	return today;
}

window.addEventListener('DOMContentLoaded', function(){
  var myDatepicker = document.querySelector('input[name="demo"]');
  myDatepicker.DatePickerX.init({
	mondayFirst      : true,
	format           : 'dd/mm/yyyy',
	minDate          : new Date(),
	maxDate          : new Date(2099, 11, 31),
	weekDayLabels    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
	shortMonthLabels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	singleMonthLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	todayButton      : false,
	todayButtonLabel : 'Today',
	clearButton      : false,
	clearButtonLabel : 'Clear'
  });
});


let tasks = [];

function remover() {
	let tempHolder = (this.parentNode).parentNode.rowIndex;
	tasks.splice(tempHolder - 1,1);
	for (let i = 0; i < tasks.length; i++){
		tasks[i]["Task Number"] = i + 1;
	}
	if (tasks.length > 0) {
		document.querySelector("#toDoList").removeChild(document.querySelector("#toDoList").firstChild);
		document.querySelector("#toDoList").appendChild(tableBuilder(tasks));
	} else {
		document.querySelector("#toDoList").removeChild(document.querySelector("#toDoList").firstChild);
		document.getElementById("message").classList.remove("empty");
	}
}

function tableBuilder(data) {
	let table = document.createElement("table");
	let	taskFields = Object.keys(data[0]);
	let	headerRow = document.createElement("tr");
	for (let i = 0; i < taskFields.length - 1; i++){
		let headerCell = document.createElement("th");
		headerCell.textContent = taskFields[i];
		headerRow.appendChild(headerCell);
	};
	table.appendChild(headerRow);
	
	data.forEach(function(object) {
		let row = document.createElement("tr");
		for (let i = 0; i < taskFields.length - 1; i++){
			let cell = document.createElement("td");
			cell.textContent = object[taskFields[i]];
			row.appendChild(cell);
		};
		table.appendChild(row);
		
	});
	for (let i = 1, row; row = table.rows[i]; i++) {
		
		let tdChecker = document.createElement("input");
		tdChecker.type = "checkbox";
		tdChecker.classList.add("checkerBox");
		tdChecker.checked = tasks[row.rowIndex -1].Done;
		tdChecker.addEventListener("click", function() {
			if (this.checked == true) {
				tasks[row.rowIndex - 1].Done = true;
				if(row.classList.contains("sameDayColor")) {
					row.classList.remove("sameDayColor");
				}
				row.classList.add("doneColor");
				tdChecker.disabled = true;
			} else {
				tasks[row.rowIndex - 1].Done = false;
				row.classList.remove("doneColor");
			}
		});
	
		let taskDelete = document.createElement("img");
		taskDelete.src = "../images/recyclebin.jpg";
		taskDelete.style.height= "18px";
		taskDelete.style.width= "18px";
		taskDelete.addEventListener("click", remover);
		taskDelete.classList.add("taskDeleteImg");
		
		row.cells[4].setAttribute("id","row"+i+"cell");
		row.cells["row"+i+"cell"].appendChild(tdChecker);
		row.cells["row"+i+"cell"].appendChild(taskDelete);
		row.cells["row"+i+"cell"].addEventListener("keyup", function() {
			tasks[this.parentNode.rowIndex -1].Actions = this.textContent;
		});
		if(tasks[row.rowIndex - 1].Done === true) {
			row.classList.add("doneColor");
			tdChecker.disabled = true;
		}
		if (tasks[row.rowIndex - 1].Done === false) {
			comparison(row);
		}
	}
	return table;
}
	
function addTask() {
	if (document.getElementById("taskName").value === "" || document.querySelector('input[name="demo"]').value === "") {
		if (document.getElementById("taskName").value === "") {
			document.getElementById("taskName").classList.add("alertColor");
			document.getElementById("taskName").placeholder = "Enter a task name first";
			setTimeout(function() {
				document.getElementById("taskName").classList.remove("alertColor");
				document.getElementById("taskName").placeholder = "Name your task";
			}, 1500);
		}
		if (document.querySelector('input[name="demo"]').value === "") {
			document.querySelector('input[name="demo"]').classList.add("alertColor");
			document.querySelector('input[name="demo"]').placeholder = "Pick a date first";
			setTimeout(function() {
				document.querySelector('input[name="demo"]').classList.remove("alertColor");
				document.querySelector('input[name="demo"]').placeholder = "Due on date";
			}, 1500);
		}
	}else {
		if (tasks.length === 0) {
			document.getElementById("message").classList.add("empty");
		}
	
		tasks.push({
			"Task Number": tasks.length + 1,
			"Task Name": document.getElementById("taskName").value,
			"Date Added": currentDate(),
			"Due On": document.querySelector('input[name="demo"]').value,
			"Actions": "",
			"Done": false
		});
		if(document.querySelector("#toDoList").hasChildNodes()){
			document.querySelector("#toDoList").removeChild(document.querySelector("#toDoList").firstChild);
		}
		document.querySelector("#toDoList").appendChild(tableBuilder(tasks));
		document.getElementById("taskName").value = "";
		document.querySelector('input[name="demo"]').value = "";
	}
	console.log(tasks);
}

let idleTime;
window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;
function notIdle() {
	if (tasks.length > 0) {
		document.querySelector("#toDoList").removeChild(document.querySelector("#toDoList").firstChild);
		document.querySelector("#toDoList").appendChild(tableBuilder(tasks));
		resetTimer();
	} 
}
function resetTimer() {
	clearTimeout(idleTime);
	idleTime = setTimeout(notIdle, 60000);
}

function comparison(rowData) {
	let givenTime = tasks[rowData.rowIndex - 1]["Due On"];
	let parsedTime = givenTime.split("/");
	let currentTime = currentDate().split("/");
	if (currentTime[0] === parsedTime[0] && currentTime[1] === parsedTime[1] && currentTime[2] === parsedTime[2]) {
		rowData.classList.add("sameDayColor");
	} else if ((currentTime[0] > parsedTime[0] && currentTime[1] === parsedTime[1] && currentTime[2] === parsedTime[2]) || 
	(currentTime[1] > parsedTime[1] && currentTime[2] === parsedTime[2]) || currentTime[2] > parsedTime[2]) {
		rowData.classList.remove("sameDayColor");
		rowData.classList.add("missedDayColor");
	}
}