$.ajaxSetup({
	 beforeSend: function(xhr, settings) {
		 function getCookie(name) {
			 var cookieValue = null;
			 if (document.cookie && document.cookie != '') {
				 var cookies = document.cookie.split(';');
				 for (var i = 0; i < cookies.length; i++) {
					 var cookie = jQuery.trim(cookies[i]);
					 // Does this cookie string begin with the name we want?
					 if (cookie.substring(0, name.length + 1) == (name + '=')) {
						 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						 break;
					 }
				 }
			 }
			 return cookieValue;
		 }
		 if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
			 // Only send the token to relative URLs i.e. locally.
			 xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
		 }
	 }
});

var modalNumber = 0;
function set_layout(layoutName)
{
	document.getElementById("learngrow_perspective").style.display = "none";
	document.getElementById("business_perspective").style.display = "none";
	document.getElementById("customer_perspective").style.display = "none";
	document.getElementById("financial_perspective").style.display = "none";

	document.getElementById("learn_grow_button").className = "div-button-inactive";
	document.getElementById("business_button").className = "div-button-inactive";
	document.getElementById("customer_button").className = "div-button-inactive";
	document.getElementById("financial_button").className = "div-button-inactive";

	switch(layoutName)
	{
		case "learngrow":
			document.getElementById("learngrow_perspective").style.display = "block";
			document.getElementById("learn_grow_button").className = "div-button-active";
			break;
		case "business":
			document.getElementById("business_perspective").style.display = "block";
			document.getElementById("business_button").className = "div-button-active";
			break;
		case "customer":
			document.getElementById("customer_perspective").style.display = "block";
			document.getElementById("customer_button").className = "div-button-active";
			break;
		case "financial":
			document.getElementById("financial_perspective").style.display = "block";
			document.getElementById("financial_button").className = "div-button-active";
			break;
		case "all":
			document.getElementById("learngrow_perspective").style.display = "block";
			document.getElementById("business_perspective").style.display = "block";
			document.getElementById("customer_perspective").style.display = "block";
			document.getElementById("financial_perspective").style.display = "block";
	}
}

function createModal(content) {
	var modal = document.createElement("div")
	modal.id = "modal_" + modalNumber;
	modalNumber = modalNumber +1;
	modal.className = "modal";

	var modalClose = document.createElement("span");
	modalClose.className = "close";
	modalClose.innerHTML = "&times";

	/*
		var modalContent = document.createElement("p");
		modalContent.innerHTML = content;
	*/

	var modalEdit = document.createElement("input");
	modalEdit.className = "modalEdit"
	modalEdit.type = "text";
	modalEdit.value = content;

	modal.appendChild(modalClose);
	//modal.appendChild(modalContent);
	modal.appendChild(modalEdit);

	return modal;
}

function createRow(year, name, measure, target, actual, plan) {
	var row = document.createElement("div");
	row.className = "row hoverrow";

	var fieldYear = document.createElement("div");
	fieldYear.className = "field first";

	var modal = createModal(year);
	row.appendChild(modal);
	fieldYear.innerHTML = year;
	var yearid = "".concat(modal.id);
	fieldYear.onclick = function() {displayModal(this, yearid)};

	var fieldName = document.createElement("div");
	fieldName.className = "field";

	var modal = createModal(name);
	row.appendChild(modal);
	fieldName.innerHTML = name;
	var nameid = "".concat(modal.id);
	fieldName.onclick = function() {displayModal(this, nameid)};

	var fieldMeasure = document.createElement("div");
	fieldMeasure.className = "field";
	var modal = createModal(measure);
	row.appendChild(modal);
	fieldMeasure.innerHTML = measure;
	var measureid = "".concat(modal.id);
	fieldMeasure.onclick = function() {displayModal(this, measureid)};

	var fieldTarget = document.createElement("div");
	fieldTarget.className = "field";
	var modal = createModal(target);
	row.appendChild(modal);
	fieldTarget.innerHTML = target;
	var targetid = "".concat(modal.id);
	fieldTarget.onclick = function() {displayModal(this, targetid)};

	var fieldActual = document.createElement("div");
	fieldActual.className = "field";
	var modal = createModal(actual);
	row.appendChild(modal);
	fieldActual.innerHTML = actual;
	var actualid = "".concat(modal.id);
	fieldActual.onclick = function() {displayModal(this, actualid)};

	var fieldPlan = document.createElement("div");
	fieldPlan.className = "field";
	var modal = createModal(plan);
	row.appendChild(modal);
	fieldPlan.innerHTML = plan;
	var planid = "".concat(modal.id);
	fieldPlan.onclick = function() {displayModal(this, planid)};

	var fieldDelete = document.createElement("div");
	fieldDelete.className = "field";
	fieldDelete.id = "inputfield";
	fieldDelete.innerHTML = '<button class="tableinput" onclick="deleteRow(this.parentNode.parentNode);">Delete</button>';

	row.appendChild(fieldYear);
	row.appendChild(fieldName);
	row.appendChild(fieldMeasure);
	row.appendChild(fieldTarget);
	row.appendChild(fieldActual);
	row.appendChild(fieldPlan);
	row.appendChild(fieldDelete);

	return row;
}

function createInputRow(idName) {
	var row = document.createElement("div");
	row.id = idName.concat("_inputrow");
	row.className = "row";
	var fieldYear = document.createElement("div");
	fieldYear.className = "field first";
	fieldYear.innerHTML = '<input class="tableinput" type="text" name="year_input" id="'+idName+'_year_input">';
	var fieldName = document.createElement("div");
	fieldName.className = "field";
	fieldName.innerHTML = '<input class="tableinput" type="text" name="name_input" id="'+idName+'_name_input">';
	var fieldMeasure = document.createElement("div");
	fieldMeasure.className = "field";
	fieldMeasure.innerHTML = '<input class="tableinput" type="text" name="measure_input" id="'+idName+'_measure_input">';
	var fieldTarget = document.createElement("div");
	fieldTarget.className = "field";
	fieldTarget.innerHTML = '<input class="tableinput" type="text" name="target_input" id="'+idName+'_target_input">';
	var fieldActual = document.createElement("div");
	fieldActual.className = "field";
	fieldActual.innerHTML = '<input class="tableinput" type="text" name="actual_input" id="'+idName+'_actual_input">';
	var fieldPlan = document.createElement("div");
	fieldPlan.className = "field";
	fieldPlan.innerHTML = '<input class="tableinput" type="text" name="plan_input" id="'+idName+'_plan_input">';
	var fieldAdd = document.createElement("div");
	fieldAdd.className = "field";
	fieldAdd.innerHTML = '<button class="tableinput" onclick="addRow(' + "'" + idName + "'" + ');">Add Row</button>';

	row.appendChild(fieldYear);
	row.appendChild(fieldName);
	row.appendChild(fieldMeasure);
	row.appendChild(fieldTarget);
	row.appendChild(fieldActual);
	row.appendChild(fieldPlan);
	row.appendChild(fieldAdd);

	return row;
}

function addRow(idName) {
	var year = document.getElementById(idName + "_year_input").value;
	var name = document.getElementById(idName + "_name_input").value;
	var measure = document.getElementById(idName + "_measure_input").value;
	var target = document.getElementById(idName + "_target_input").value;
	var actual = document.getElementById(idName + "_actual_input").value;
	var plan = document.getElementById(idName + "_plan_input").value;

	var table = document.getElementById(idName);

	var inputRow = document.getElementById(idName + "_inputrow");
	inputRow.parentNode.removeChild(inputRow);

	table.appendChild(createRow(year, name, measure, target, actual, plan));
	table.appendChild(createInputRow(idName));
}

function addRow5(name, measure, target, plan, tablename)
{
	var table = document.getElementById(tablename);

	var inputRow = document.getElementById(table + "_inputrow");
	inputRow.parentNode.removeChild(inputRow);

	table.appendChild(createRow(name, measure, target, plan));
	table.appendChild(createInputRow(idName));
}

function deleteRow(thisRow)
{
	thisRow.parentNode.removeChild(thisRow);
}

function displayModal(field, modalId) {
	//console.log("modalId: " + modalId);
	var modal = document.getElementById(modalId);
	modal.style.display = "block";
	modal.firstChild.onclick = function() {
		field.innerText = modal.lastChild.value;
		this.parentElement.style.display = "none";
	};
}

function hideModal(modalId)
{
	document.getElementById(modalId).style.display = "none";
}

function generateJSON() {
	var scn = document.getElementById("scorecard_name").innerHTML;
	var output = '{"scorecard_name":"'.concat(scn).concat('",');
	var output = output + '"tables":{';
	var tablesarray = [document.getElementById("learngrowtable"),document.getElementById("businesstable"),document.getElementById("customertable"),document.getElementById("financialtable")];

	for(var i = 0; i < tablesarray.length; i++) {
		output = output.concat('"' + tablesarray[i].id + '":{"rows":[');

		var rows = tablesarray[i].childNodes;

		for(var j = 0; j < rows.length; j++) {
			if(rows[j].nodeType == 1 && !rows[j].id.includes("inputrow") && rows[j].id != "titlerow") {
				console.log("TEST");
				var fields = rows[j].childNodes;
                output = output.concat('{');

                output = output.concat('"year":');
                output = output.concat('"').concat(fields[6].innerText).concat('",');

				output = output.concat('"name":');
				output = output.concat('"').concat(fields[7].innerText).concat('",');

				output = output.concat('"measure":');
				output = output.concat('"').concat(fields[8].innerText).concat('",');

				output = output.concat('"target":');
				output = output.concat('"').concat(fields[9].innerText).concat('",');

				output = output.concat('"actual":');
				output = output.concat('"').concat(fields[10].innerText).concat('",');

				output = output.concat('"poa":');
				output = output.concat('"').concat(fields[11].innerText).concat('"');

				output = output.concat('},');
			}
		}
		if(output[output.length-1] == ",")
			output = output.substring(0, output.length - 1);
		output = output.concat(']},');
	}
	if(output[output.length-1] == ",")
		output = output.substring(0, output.length - 1);
	output = output.concat('}}');

	return output;
}

function setSaveForm()
{
	document.getElementById("tablejson_save").value = generateJSON();
	document.getElementById("download_data_form").submit();
}

function showScorecardNameEdit()
{
	document.getElementById("scorecard_name_div").style.display = "none";
	document.getElementById("scorecard_edit_div").style.display = "block";
}

function hideScorecardNameEdit()
{
	document.getElementById("scorecard_name_div").style.display = "block";
	document.getElementById("scorecard_edit_div").style.display = "none";
	document.getElementById("scorecard_name").innerHTML = document.getElementById("scorecard_edit").value;
}

function saveScorecard()
{
	$.ajax({url: document.getElementById("savetables").getAttribute("action"),
			type: "POST",
			data: {
				tablejson: generateJSON()
			},
			success: function(result){
				console.log("success: " + result);
				alert("Scorecard succesfully saved.")
			},
			error: function(xhr, status, error){
				console.log("xhr: " + xhr.responseText);
				console.log("status: " + status);
				console.log("error: " + error);
			}
	});
}

function loadScorecard()
{
	select = document.getElementById("scorecard_select");
	selected_option = select.options[select.selectedIndex].value;

	$.ajax({url: document.getElementById("loadtables").getAttribute("action"),
			type: "POST",
			data: {
				scorecard_name: selected_option
			},
			success: function(result){
				console.log("success: " + result);
				clearTables();
				loadJson(result);
				document.getElementById("scorecard_load_modal").style.display = "none";
			},
			error: function(xhr, status, error){
				console.log("xhr: " + xhr.responseText);
				console.log("status: " + status);
				console.log("error: " + error);
			}
	});
}

function getScorecards()
{
	$.ajax({url: document.getElementById("getscorecards").getAttribute("action"),
			type: "GET",
			success: function(result){
				console.log("success: " + result);
				populateModalSelect(result);
			},
			error: function(xhr, status, error){
				console.log("xhr: " + xhr.responseText);
				console.log("status: " + status);
				console.log("error: " + error);
			}
	});
}

function populateModalSelect(input)
{
	var modal_select = document.getElementById("scorecard_select");

	for(i = modal_select.childNodes.length-1; i >= 0 ; i--)
	{
		if(modal_select.childNodes[i].nodeType == 1 && !modal_select.childNodes[i].id.includes("inputrow") && !modal_select.childNodes[i].id.includes("titlerow"))
		{
			modal_select.removeChild(modal_select.childNodes[i]);
		}
	}

	var obj = JSON.parse(input);
	var cards = obj.scorecards;
	for(i = 0; i < cards.length; i++)
	{
		option = document.createElement("option");
		option.value = cards[i].scorecard_name;
		option.innerHTML = cards[i].scorecard_name;
		modal_select.appendChild(option);
	}
	document.getElementById("scorecard_load_modal").style.display = "block";
}

function loadJson(input) {
	var obj = JSON.parse(input);
	var tableNames = Object.keys(obj.tables);
	var tables = [obj.tables.learngrowtable, obj.tables.businesstable, obj.tables.customertable, obj.tables.financialtable];
	for(var i = 0; i < tables.length; i++) {
		var table = document.getElementById(tableNames[i]);

		var rows = tables[i].rows;
		for(var j = 0; j < rows.length; j++) {
			var newRow = createRow(rows[j].year, rows[j].name, rows[j].measure, rows[j].target, rows[j].actual, rows[j].poa);

			var inputRow = document.getElementById(tableNames[i] + "_inputrow");
			inputRow.parentNode.removeChild(inputRow);

			table.appendChild(newRow);
			table.appendChild(createInputRow(tableNames[i]));
		}
	}
}

function clearTables()
{
	var learngrow = document.getElementById("learngrowtable");
	for(i = learngrow.childNodes.length-1; i >= 0 ; i--)
	{
		if(learngrow.childNodes[i].nodeType == 1 && !learngrow.childNodes[i].id.includes("inputrow") && !learngrow.childNodes[i].id.includes("titlerow"))
		{
			learngrow.removeChild(learngrow.childNodes[i]);
		}
	}

	var businesstable = document.getElementById("businesstable");
	for(i = businesstable.childNodes.length-1; i >= 0 ; i--)
	{
		if(businesstable.childNodes[i].nodeType == 1 && !businesstable.childNodes[i].id.includes("inputrow") && !businesstable.childNodes[i].id.includes("titlerow"))
		{
			businesstable.removeChild(businesstable.childNodes[i]);
		}
	}

	var customertable = document.getElementById("customertable");
	for(i = customertable.childNodes.length-1; i >= 0 ; i--)
	{
		if(customertable.childNodes[i].nodeType == 1 && !customertable.childNodes[i].id.includes("inputrow") && !customertable.childNodes[i].id.includes("titlerow"))
		{
			customertable.removeChild(customertable.childNodes[i]);
		}
	}

	var financialtable = document.getElementById("financialtable");
	for(i = financialtable.childNodes.length-1; i >= 0 ; i--)
	{
		if(financialtable.childNodes[i].nodeType == 1 && !financialtable.childNodes[i].id.includes("inputrow") && !financialtable.childNodes[i].id.includes("titlerow"))
		{
			financialtable.removeChild(financialtable.childNodes[i]);
		}
	}
}

function export_pdf()
{
	set_layout("all");

	document.getElementById("learngrowtable_inputrow").style.display = "none";
	document.getElementById("businesstable_inputrow").style.display = "none";
	document.getElementById("customertable_inputrow").style.display = "none";
	document.getElementById("financialtable_inputrow").style.display = "none";

	var inputfields = document.getElementsByClassName("field");
	for(i in inputfields)
	{
		console.log(i);
		if(inputfields[i].id == "inputfield")
		{
			inputfields[i].style.display = "none";
		}
	}

	perspectivediv_html = document.getElementById("perspective_div").outerHTML;
	document.getElementById("perspectivediv_html").value = perspectivediv_html;

	document.getElementById("exporttopdf_form").submit();

	// $.ajax({url: document.getElementById("exporttopdf").getAttribute("action"),
	// 		type: "POST",
	// 		data: {html_string:perspectivediv_html},
	// 		success: function(result){
	// 			console.log("success: " + result);
	// 			populateModalSelect(result);
	// 		},
	// 		error: function(xhr, status, error){
	// 			console.log("xhr: " + xhr.responseText);
	// 			console.log("status: " + status);
	// 			console.log("error: " + error);
	// 		}
	// });

	for(i in inputfields)
	{
		if(inputfields[i].id == "inputfield")
		{
			inputfields[i].style.display = "flex";
		}
	}

	document.getElementById("learngrowtable_inputrow").style.display = "block";
	document.getElementById("businesstable_inputrow").style.display = "block";
	document.getElementById("customertable_inputrow").style.display = "block";
	document.getElementById("financialtable_inputrow").style.display = "block";

	set_layout("learngrow");
}

$(document).ready(function() {
  var auth = new auth0.WebAuth({
    domain: 'onlines3.eu.auth0.com',
    clientID: 'vE0hJ4Gx1uYG9LBtuxgqY7CTIFmKivFH'
   });


    $('.login-btn').click(function(e) {
      e.preventDefault();
      auth.authorize({
        audience: 'https://onlines3.eu.auth0.com/userinfo',
        scope: 'openid profile email',
        responseType: 'code',
        redirectUri: 'http://li1088-54.members.linode.com:8082/bscapp/callback/'
      });
    });
});

/*
destroys element that triggered the event
*/
function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

/*
This creates an input element of type 'file' and clicks it.
The effect is a file selction pop-up.
*/
function createAndClickFile()
{
	var test = document.createElement("input");
	test.type = "file";
	test.id = "createdfilebutton"
	//test.style.display = "none";
	test.onchange = loadFileAsText;
	document.body.appendChild(test);
	test.click();
}

/*
This method loads a text file from disk and adds its contents to the lists on the page.
*/
function loadFileAsText()
{
	console.log("Loading JSON File");
	var fileToLoad = document.getElementById("createdfilebutton").files[0];
	document.body.removeChild(document.getElementById("createdfilebutton"));

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent)
	{
		var input = fileLoadedEvent.target.result;
		loadJson(input);
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
	//document.body.removeChild(test);
}


