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

function createModal(content, type) {
	var modal = document.createElement("div");
	modal.id = "modal_" + modalNumber;
	modalNumber = modalNumber +1;
	modal.className = "modal";

	var modalClose = document.createElement("span");
	modalClose.className = "close";
	modalClose.innerHTML = "&times";
	modal.appendChild(modalClose);

	/*

	*/

	if(type == "edit") {
        var modalEdit = document.createElement("input");
        modalEdit.className = "modalEdit";
        modalEdit.type = "text";
        modalEdit.value = content;
        modal.appendChild(modalEdit);
    }
    else
	{
		var modalContent = document.createElement("p");
		modalContent.innerHTML = content;
		modal.appendChild(modalContent);
	}
	return modal;
}

function createRow(year, name, measure, target, actual, plan) {
	var row = document.createElement("div");
	row.className = "row hoverrow";
	var fieldYear = document.createElement("div");
	fieldYear.className = "field first";
	fieldYear.setAttribute("value", year);
	if(year.length > 12)
	{
		var modal = createModal(year,"content");
		row.appendChild(modal);
		var yearid = "".concat(modal.id);
		fieldYear.onclick = function() {displayModal(this, yearid)};
		fieldYear.innerHTML = year.substring(0,13) + "...";
	}
	else{fieldYear.innerHTML = year;}

	var fieldName = document.createElement("div");
	fieldName.className = "field";
	fieldName.setAttribute("value", name);
	if(name.length > 12)
	{
		var modal = createModal(name,"content");
		row.appendChild(modal);
		var nameid = "".concat(modal.id);
		fieldName.onclick = function() {displayModal(this, nameid)};
		fieldName.innerHTML = name.substring(0,13) + "...";
	}
	else{fieldName.innerHTML = name;}

	var fieldMeasure = document.createElement("div");
	fieldMeasure.className = "field";
	fieldMeasure.setAttribute("value", measure);
	if(measure.length > 12)
	{
		var modal = createModal(measure,"content");
		row.appendChild(modal);
		var measureid = "".concat(modal.id);
		fieldMeasure.onclick = function() {displayModal(this, measureid)};
		fieldMeasure.innerHTML = measure.substring(0,13) + "...";
	}
	else{fieldMeasure.innerHTML = measure;}

	var fieldTarget = document.createElement("div");
	fieldTarget.className = "field";
	fieldTarget.setAttribute("value", target);
	if(target.length > 12)
	{
		var modal = createModal(target,"content");
		row.appendChild(modal);
		var targetid = "".concat(modal.id);
		fieldTarget.onclick = function() {displayModal(this, targetid)};
		fieldTarget.innerHTML = target.substring(0,13) + "...";
	}
	else{fieldTarget.innerHTML = target;}

	var fieldActual = document.createElement("div");
	fieldActual.className = "field";
	fieldActual.setAttribute("value", actual);
	if(actual.length > 12)
	{
		var modal = createModal(actual,"content");
		row.appendChild(modal);
		var actualid = "".concat(modal.id);
		fieldActual.onclick = function() {displayModal(this, actualid)};
		fieldActual.innerHTML = actual.substring(0,13) + "...";
	}
	else{fieldActual.innerHTML = actual;}
	//fieldActual.innerHTML = actual;
	if(target == actual)
	{
		fieldActual.style.background = "#00cc33";
		fieldActual.style.color = "white";
	}
	else
	{
		fieldActual.style.background = "yellow";
	}

	var fieldPlan = document.createElement("div");
	fieldPlan.className = "field";
	fieldPlan.setAttribute("value", plan);
	if(plan.length > 12)
	{
		var modal = createModal(plan,"content");
		row.appendChild(modal);
		var planid = "".concat(modal.id);
		fieldPlan.onclick = function() {displayModal(this, planid)};
		fieldPlan.innerHTML = plan.substring(0,13) + "...";
	}
	else{fieldPlan.innerHTML = plan;}

	var fieldDelete = document.createElement("div");
	fieldDelete.className = "field";
	fieldDelete.id = "inputfield";
	//fieldDelete.innerHTML = '<button class="tableinput" onclick="deleteRow(this.parentNode.parentNode);">Delete</button>';
	fieldDelete.innerHTML = '<i style="cursor: pointer;" title="View Historic Data" onclick="getHistoricData(this.parentNode.parentNode);" class="fa fa-calendar" aria-hidden="true"></i>&nbsp;' +
		'&nbsp;<i style="cursor: pointer;" title="Update Actual Field" onclick="editRow(this.parentNode.parentNode);" class="fa fa-pencil" aria-hidden="true"></i>&nbsp;' +
		'&nbsp;<i style="cursor: pointer;" title="Delete Row" onclick="deleteRow(this.parentNode.parentNode);" class="fa fa-trash" aria-hidden="true"></i>&nbsp;';

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

function createEditRow(year,name,measure,target,actual,plan) {
	var row = document.createElement("div");
	row.className = "row";
	var fieldYear = document.createElement("div");
	fieldYear.className = "field first";
	fieldYear.innerHTML = '<input class="tableinput" type="text" name="year_input" id="year_input" value="'+year+'">';
	var fieldName = document.createElement("div");
	fieldName.className = "field";
	fieldName.innerHTML = '<input class="tableinput" type="text" name="name_input" id="name_input" value="'+name+'">';
	var fieldMeasure = document.createElement("div");
	fieldMeasure.className = "field";
	fieldMeasure.innerHTML = '<input class="tableinput" type="text" name="measure_input" id="measure_input" value="'+measure+'">';
	var fieldTarget = document.createElement("div");
	fieldTarget.className = "field";
	fieldTarget.innerHTML = '<input class="tableinput" type="text" name="target_input" id="target_input" value="'+target+'">';
	var fieldActual = document.createElement("div");
	fieldActual.className = "field";
	fieldActual.innerHTML = '<input class="tableinput" type="text" name="actual_input" id="actual_input" value="'+actual+'">';
	var fieldPlan = document.createElement("div");
	fieldPlan.className = "field";
	fieldPlan.innerHTML = '<input class="tableinput" type="text" name="plan_input" id="plan_input" value="'+plan+'">';
	var fieldAdd = document.createElement("div");
	fieldAdd.className = "field";
	fieldAdd.innerHTML = '<i onclick="saveEditRow(this.parentNode.parentNode)" style="cursor:pointer;" class="fa fa-floppy-o" aria-hidden="true"></i>';

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

function deleteRow(thisRow)
{
	thisRow.parentNode.removeChild(thisRow);
}

function editRow(thisRow)
{
	var fields = thisRow.getElementsByClassName("field");
	var editRow = createEditRow(fields[0].getAttribute("value"),
							fields[1].getAttribute("value"),
							fields[2].getAttribute("value"),
							fields[3].getAttribute("value"),
							fields[4].getAttribute("value"),
							fields[5].getAttribute("value"));
	thisRow.innerHTML = editRow.innerHTML;
}

function saveEditRow(thisRow)
{
	var fields = thisRow.getElementsByClassName("field");
	var savedRow = createRow(fields[0].firstChild.value,
							fields[1].firstChild.value,
							fields[2].firstChild.value,
							fields[3].firstChild.value,
							fields[4].firstChild.value,
							fields[5].firstChild.value);
	thisRow.innerHTML = savedRow.innerHTML;
}

function displayModal(field, modalId) {
	//console.log("modalId: " + modalId);
	var modal = document.getElementById(modalId);
	modal.style.display = "block";
	modal.firstChild.onclick = function() {
		//field.innerText = modal.lastChild.value;
		this.parentElement.style.display = "none";
	};
}

function hideModal(modalId)
{
	document.getElementById(modalId).style.display = "none";
}

function generateJSON() {
	var scn = document.getElementById("scorecard_name").innerHTML;
	console.log(scn);
	var output = '{"scorecard_name":"'.concat(scn).concat('",');
	if(document.getElementById("scorecard_name").getAttribute("share_id")) {
        output = output + '"share_id": "' + document.getElementById("scorecard_name").getAttribute("share_id") + '",'
    }
	var output = output + '"tables":{';
	var tablesarray = [document.getElementById("learngrowtable"),document.getElementById("businesstable"),document.getElementById("customertable"),document.getElementById("financialtable")];

	for(var i = 0; i < tablesarray.length; i++) {
		output = output.concat('"' + tablesarray[i].id + '":{"rows":[');

		var rows = tablesarray[i].childNodes;

		for(var j = 0; j < rows.length; j++) {
			if(rows[j].nodeType == 1 && !rows[j].id.includes("inputrow") && rows[j].id != "titlerow") {
				console.log("TEST");
				var fields = rows[j].getElementsByClassName("field");
                output = output.concat('{');

                output = output.concat('"year":');
                output = output.concat('"').concat(fields[0].innerText).concat('",');

				output = output.concat('"name":');
				output = output.concat('"').concat(fields[1].innerText).concat('",');

				output = output.concat('"measure":');
				output = output.concat('"').concat(fields[2].innerText).concat('",');

				output = output.concat('"target":');
				output = output.concat('"').concat(fields[3].innerText).concat('",');

				output = output.concat('"actual":');
				output = output.concat('"').concat(fields[4].innerText).concat('",');

				output = output.concat('"poa":');
				output = output.concat('"').concat(fields[5].innerText).concat('",');

				output = output.concat('"rowid":');
				if(rows[j].hasAttribute("rowid")) {
                    output = output.concat('"').concat(rows[j].getAttribute("rowid")).concat('"');
                }
                else {
					output = output.concat('"new"');
				}

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

function generateCSV()
{
	var tablesarray = [document.getElementById("learngrowtable"),document.getElementById("businesstable"),document.getElementById("customertable"),document.getElementById("financialtable")];
	var output = '"Table","Year","Performance Index","Method of Measure","Target Value","Actual Value","Plan of Action"';
	for(var i = 0; i < tablesarray.length; i++) {
		var tablename = "";
		if(tablesarray[i].id == "learngrowtable")
		{
			tablename="learning_and_growth";
		}
		else if(tablesarray[i].id == "businesstable")
		{
			tablename="internal_regional";
		}
		else if(tablesarray[i].id == "customertable")
		{
			tablename="citizen";
		}
		else
		{
			tablename="vision";
		}
		var rows = tablesarray[i].childNodes;

		for(var j = 0; j < rows.length; j++) {
			if(rows[j].nodeType == 1 && !rows[j].id.includes("inputrow") && rows[j].id != "titlerow") {
				var fields = rows[j].getElementsByClassName("field");
				var row = '"' + tablename + '",';
				row = row.concat('"' + fields[0].innerText + '",');
				row = row.concat('"' + fields[1].innerText + '",');
				row = row.concat('"' + fields[2].innerText + '",');
				row = row.concat('"' + fields[3].innerText + '",');
				row = row.concat('"' + fields[4].innerText + '",');
				row = row.concat('"' + fields[5].innerText + '"');
				output = output.concat('\n'+row);
			}
		}
	}
	console.log(output);
	return output;
}

function setSaveForm(data, filename)
{
	document.getElementById("tablejson_save").value = data;
	document.getElementById("filename_save").value = filename;
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
				alert(xhr.responseText);
				console.log("status: " + status);
				console.log("error: " + error);
			}
	});
}

function loadScorecard()
{
	select = document.getElementById("scorecard_select");
	selected_option = select.options[select.selectedIndex].value;

	if(select.options[select.selectedIndex].hasAttribute('share_id'))
	{
		$.ajax({url: document.getElementById("loadtables").getAttribute("action"),
			type: "POST",
			data: {
				scorecard_share_id: select.options[select.selectedIndex].getAttribute('share_id')
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
    else
	{
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

	//clear existing entries
	for(i = modal_select.childNodes.length-1; i >= 0 ; i--)
	{
		//if(modal_select.childNodes[i].nodeType == 1 && !modal_select.childNodes[i].id.includes("inputrow") && !modal_select.childNodes[i].id.includes("titlerow"))
		//{

		modal_select.removeChild(modal_select.childNodes[i]);

		//}
	}

	//populate with JSON entries
	var obj = JSON.parse(input);
	var cards = obj.scorecards;
	var owned = cards.owned;
	var shared = cards.shared;

	option = document.createElement("option");
	option.disabled = "true";
	option.value = "-OWNED-";
	option.innerHTML = "-OWNED-";
	modal_select.appendChild(option);

	for(i = 0; i < owned.length; i++)
	{
		option = document.createElement("option");
		option.value = owned[i].scorecard_name;
		option.innerHTML = owned[i].scorecard_name;
		modal_select.appendChild(option);
	}

	option = document.createElement("option");
	option.disabled = "true";
	option.value = "-SHARED-";
	option.innerHTML = "-SHARED-";
	modal_select.appendChild(option);

	for(i = 0; i < shared.length; i++)
	{
		option = document.createElement("option");
		option.value = shared[i].scorecard_name;
		option.innerHTML = shared[i].scorecard_name;
		option.setAttribute("share_id", shared[i].share_id);
		modal_select.appendChild(option);
	}

	document.getElementById("scorecard_load_modal").style.display = "block";
}

function loadJson(input) {
	var obj = JSON.parse(input);

	document.getElementById('scorecard_name').innerHTML = obj.scorecard_name;
	document.getElementById('scorecard_name').setAttribute("share_id", obj.share_id);
	document.getElementById('scorecard_edit').innerHTML = obj.scorecard_name;

	if("share_id" in obj)
	{
		document.getElementById("share_id_in_modal").innerHTML = obj.share_id;
	}

	var tableNames = Object.keys(obj.tables);
	var tables = [obj.tables.learngrowtable, obj.tables.businesstable, obj.tables.customertable, obj.tables.financialtable];
	for(var i = 0; i < tables.length; i++) {
		var table = document.getElementById(tableNames[i]);

		var rows = tables[i].rows;
		for(var j = 0; j < rows.length; j++) {
			var newRow = createRow(rows[j].year, rows[j].name, rows[j].measure, rows[j].target, rows[j].actual, rows[j].poa);

			if("rowid" in rows[j])
			{
				newRow.setAttribute("rowid", rows[j].rowid);
			}

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

	var tables = document.getElementsByClassName("table");
	for(i = 0; i < tables.length; i++)
	{
		tables[i].style.width = "634px";
	}

	var titlerow = document.getElementsByClassName("titlerow");
	for(i = 0; i < titlerow.length; i++)
	{
		titlerow[i].style.width = "634px";
	}

	var row = document.getElementsByClassName("row");
	for(i = 0; i < row.length; i++)
	{
		row[i].style.width = "634px";
	}

	var field = document.getElementsByClassName("field");
	for(i = 0; i < field.length; i++)
	{
		field[i].style.width = "16%";
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

	tables = document.getElementsByClassName("table");
	for(i = 0; i < tables.length; i++)
	{
		tables[i].style.width = "742px";
	}

	var titlerow = document.getElementsByClassName("titlerow");
	for(i = 0; i < titlerow.length; i++)
	{
		titlerow[i].style.width = "740px";
	}

	var row = document.getElementsByClassName("row");
	for(i = 0; i < row.length; i++)
	{
		row[i].style.width = "740px";
	}

	var field = document.getElementsByClassName("field");
	for(i = 0; i < field.length; i++)
	{
		field[i].style.width = "14%";
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

    $('.register-btn').click(function(e) {
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
	test.id = "createdfilebutton";
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

function openShareModal()
{
	if(document.getElementById('share_id_in_modal').getAttribute('loaded') == 'false')
	{
		//get from db
	}
	document.getElementById("swotcard_share_modal").style.display = "block";
}

function addToShares()
{
	$.ajax({url: document.getElementById("addtoshares").getAttribute("action"),
			type: "POST",
			data: {
				scorecard_share_id: document.getElementById("share_id_input").value
			},
			success: function(result){
				getScorecards();
				alert("Successfully added to your list");
				console.log("success: " + result);
			},
			error: function(xhr, status, error){
				console.log("xhr: " + xhr.responseText);
				console.log("status: " + status);
				console.log("error: " + error);
			}
	});
}

function newScorecard()
{
	//reset title
	document.getElementById("scorecard_name").innerHTML = "Scorecard Name...";
	document.getElementById("scorecard_edit").innerHTML = "Scorecard Name...";

	//clear share_id
	document.getElementById("scorecard_name").removeAttribute("share_id");

	//clear tables
	clearTables();

	//alert
	alert("New Scorecard Created");
}

function populateHistoricModal(json)
{
	var table = document.getElementById("historic_data_table");

	//clear table
	table.innerHTML = "";

	//add title row
	var actualTitle = document.createElement("th");
	actualTitle.innerHTML = "Actual";
	var timestampTitle = document.createElement("th");
	timestampTitle.innerHTML = "Timestamp";
	var rowTitle = document.createElement("tr");
	rowTitle.appendChild(actualTitle);
	rowTitle.appendChild(timestampTitle);
	table.appendChild(rowTitle);

	//add rows
	var obj = JSON.parse(json);
	var obs = obj.observations;
	for(i = 0; i < obs.length; i++)
	{
		var newRow = document.createElement("tr");
		var newActual = document.createElement("td");
		var newTimestamp = document.createElement("td");
		newActual.innerHTML = obs[i].value;
		newTimestamp.innerHTML = obs[i].timestamp;
		newRow.appendChild(newActual);
		newRow.appendChild(newTimestamp);
		table.appendChild(newRow);
	}
	document.getElementById("historic_data_modal").style.display = "block";
}

function getHistoricData(thisRow)
{
	$.ajax({url: document.getElementById("historic_data_table").getAttribute("action"),
			type: "GET",
			data: {
				rowid: thisRow.getAttribute("rowid")
			},
			success: function(result){
				console.log("success: " + result);
				populateHistoricModal(result);
			},
			error: function(xhr, status, error){
				console.log("xhr: " + xhr.responseText);
				console.log("status: " + status);
				console.log("error: " + error);
			}
	});
}