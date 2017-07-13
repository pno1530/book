var arr = [];var cleanSource = [];var cleanDest = [];var departDate ; var returnDate; var ticketList = [];var placeholder;

$(document).ready(function() { 
    $.ajax({
        type: "GET",
        url:"bookMyTrip.json",
        dataType: "json",
        success: function (data) {
    		$.each(data.obj,function(i,data)
            {
            	arr.push(data);

            }); 
             sourceList();
        }

    });

   
    disableReturnByDefault();

	$(function(){
		$('#return').datepicker({
			minDate: new Date(),
			dateFormat: 'yy-mm-dd'
			});
		$('#depart').datepicker({
			minDate: new Date(),
			dateFormat : 'yy-mm-dd',
			onSelect: function(){
				var selectedDate = $(this).datepicker("getDate");
				$('#return').datepicker('option','minDate',selectedDate);
			}
		});
	});
	

	document.getElementById('onewayBtn').addEventListener("click",disableReturn);
	document.getElementById('roundBtn').addEventListener("click",enableReturn);
	document.getElementById('form1').addEventListener("submit",function(event){loadDoc(event);},false);
	document.getElementById('from').addEventListener("blur",properSource);
	document.getElementById('to').addEventListener("blur",properDestination);
	document.getElementById('depart').addEventListener("blur",departSpan);
	document.getElementById('return').addEventListener("blur",returnSpan);
	document.getElementById('tableBookSubmitButton').addEventListener("click",function(event){bookTripSubmitButton(event)},false);
	document.getElementById('contact').addEventListener("submit",function(event){bookingDetailsDiv(event);},false);
	document.getElementById('nm').addEventListener("blur",properName);
	document.getElementById('em').addEventListener("blur",properEmail);
	document.getElementById('no').addEventListener("blur",properMobile);

	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener("mousedown",function(event){emptySpan();});
	}

});

function elementDuplicate(){
	var array = [];
	cleanSource = []; var sourceIds = []; cleanDest = [];var destIds = [];
	for(var i = 0; i < arr.length ; i ++){
		if($.inArray(arr[i].from,sourceIds) == -1 ){
			sourceIds.push(arr[i].from);
			cleanSource.push(arr[i].from);
		}
		if($.inArray(arr[i].to,destIds) == -1 ){
			destIds.push(arr[i].to);
			cleanDest.push(arr[i].to);
		}
	}
	array = [cleanSource,cleanDest];
	return array;
}

function sourceList(){                          
	var array = [];

	array = elementDuplicate();
 	for(var i = 0 ; i < array[0].length ; i++){
		var source = "<option value='"+array[0][i]+"'>"+"</option>";
		$('#source').append(source);	
	}

	for(var i = 0 ; i < array[1].length ; i++){
		var destination="<option value='"+array[1][i]+"''>"+"</option>";
		$('#destination').append(destination);
	}
	
}

function disableReturnByDefault(){
document.getElementById('return').disabled = true;
$('#roundBtn').attr('class','disableReturnClass');
}

function disableReturn(){
	if(document.getElementById('return').disabled == false){
		document.getElementById('return').disabled = true;
	}
}

function enableReturn(){
	if(document.getElementById('return').disabled == true){
		document.getElementById('return').disabled = false;
		$('#roundBtn').attr('class','enableReturnClass');
	}
}

function properSource(){
	var inputSource = document.getElementById('from').value; 
	var source = inputSource.toLowerCase();
	var status = false;
	if(source == ""){
		$('#sourceAlert').text("Please enter origin") ; 
	}
	else if(source != ""){
		for(var i = 0; i < cleanSource.length ; i++){
				if(cleanSource[i] == source){
					status = true;
					document.getElementById('sourceAlert').innerHTML = ""; 
				}
		}
		if( status == false ){
				$('#from').val('');
				document.getElementById('sourceAlert').innerHTML = "No match found for search"; 
				document.getElementById(this.id).focus();
		}
	}
}

function properDestination(){
	var inputDestination = document.getElementById('to').value; 
	var destination = inputDestination.toLowerCase();
	var status = false;
	if(destination != ""){
		for(var i = 0; i < cleanDest.length ; i++){
				if(cleanDest[i] == destination){
					status = true;
					document.getElementById('destAlert').innerHTML = ""; 
				}
		}
		if( status == false ){
			$('#to').val('');
			document.getElementById('destAlert').innerHTML = "No match found for destination"; 
			document.getElementById(this.id).focus();
		}
	}
}

function departSpan(){
	document.getElementById('departAlert').innerHTML = "";
}
function returnSpan(){
	document.getElementById('returnAlert').innerHTML = "";
}

function departTable(nameOfTable,source,destination){
	var x; var myArray = [];
	var userData = {}; 
	var arrayOfFlightTime = [];

	for (var i = 0; i < arr.length; i++) {

		if(source == arr[i].from && destination == arr[i].to){
	
			for (var j = 0; j < arr[i].time.length; j++) {
				arrayOfFlightTime.push(arr[i].time[j]);
			}
			for (var j = 0; j < arrayOfFlightTime.length; j++) {
				userData['from'] = arr[i].from;
				userData['to'] = arr[i].to;
				userData['time'] = arrayOfFlightTime[j];
			    x = "<tr>"+
			    "<td id = '"+nameOfTable+"frm"+j+"'>"+userData.from+"</td>"+
			    "<td id = '"+nameOfTable+"to"+j+"' >"+userData.to+"</td>"+
			    "<td id = '"+nameOfTable+"tym"+j+"'>"+userData.time+"</td>"+
			    "<td><input type='checkbox' class='"+nameOfTable+"' id='"+nameOfTable+"Book"+j+"'></input></td>"+
			    "</tr>";
				myArray.push(x);
			}
			 
		}
		arrayOfFlightTime = [];

	}
	return myArray;
}

function cleanTableAfterSubmit(){
	if($('#tableDepart tbody tr').html()){
		var x = $('#tableDepart tbody tr').children().length;
		var source = "";
		var destination = "";

			for (var i = 0; i < x; i++) {
				$('#tableDepart tbody tr').children()[i].innerHTML = "";	
			}
	};
}

function checkOneCheckBox(nameOfClass,check){
	for (var i = 0; i < check.length; i++) {
		document.getElementsByClassName(nameOfClass)[i].addEventListener('click',function(){
			$('.'+nameOfClass).removeAttr('checked');
			$('.checkButtons').prop('checked', false);
			
			$(this).attr("checked", 'checked');
			$(this).prop('checked', true);
			$('.headerOfResultTable').text("");
		});
	}
}

function loadDoc(event){
	cleanTableAfterSubmit();

	var status=false;
	var returnValue = true
	source = document.getElementById('from').value;
	destination = document.getElementById('to').value;
	departDate = document.getElementById('depart').value;
	returnDate = document.getElementById('return').value;
	var returnButtonEnable = $('#roundBtn').hasClass("enableReturnClass");

	if (source == "" || destination == "" || departDate == "" || (source == destination && source != "" && destination != "") ) {
		if(source == ""){
			$('#sourceAlert').text("Please enter origin") ; 
		}else if(destination == ""){
			$('#destAlert').text("Please enter destination"); 
		}else if(departDate == ""){
			$('#departAlert').text("Please enter departure Date"); 
		}else if(source == destination && source != "" && destination != ""){
			returnValue = false;
			$('#submitSpan').text("source and destination should be different.");
		}
	}
	else if( returnButtonEnable == true && returnDate == ""){

		$('#returnAlert').text("Please enter return Date"); 

	}
	else{

		$('#form1').css("display","none");
		$('.type').css("display","none");

		var myArray = []; 
	    myArray = departTable("dprt",source,destination);
	    for (var i = 0; i < myArray.length; i++) {
	    	 $("#tableDepart tbody").append(myArray[i]);
	    }
	    $('#tableDepart').css("display","inline-table");
	    $('#tableBookSubmitButton').css("display","block");

		if(returnButtonEnable){
			var src = destination;
			var dest = source;
		    var myArray = departTable("rtrn",src,dest);
		    for (var i = 0; i < myArray.length; i++) {
		    	 $("#tableReturn").append(myArray[i]);
		    }
		    $('#tableReturn').css("display","inline-table");
		}
	}

	var checkDprt = $(".dprt");
	var checkRtrn = $(".rtrn");
	if(checkDprt != 0){
		checkOneCheckBox("dprt",checkDprt);
	}
	if( checkRtrn != 0){
		checkOneCheckBox("rtrn",checkRtrn);
	}
	event.preventDefault();
}

function bookTripSubmitButton(event){
	var status = true; 
	var fare = 0;
	var noOfCheckedElement = 0;
	$('.headerOfUserDiv').css("display","none");
	var check = $("input[type = checkbox]");
	var l;
	var date;
	var list =[];
	
	for (var i = 0; i < check.length; i++) {
		if(check[i].checked){
			noOfCheckedElement++;
			if(i == 0){
				date = departDate;
			}else{
				date = returnDate;
			}
			console.log(noOfCheckedElement);
			var checkedId = check[i].getAttribute("id");
			var tr = $("#"+checkedId).parent().parent();
			var source = tr.children()[0].innerHTML;
			var destination = tr.children()[1].innerHTML;
			for (var j = 0; j < arr.length; j++) {
				if(source == arr[j].from && destination == arr[j].to){
					fare += parseInt(arr[j].fare);
				}
			}
			var frm = tr.children()[0].innerHTML;
			var dprt = tr.children()[1].innerHTML;
			var tym = tr.children()[2].innerHTML;
			var tempArray = [date,frm,dprt,tym];
			ticketList.push(tempArray);
			var l = "<li class='list'>"+"<span class='dateSpan'>"+date+"</span><span>"+ frm +"</span><span class='planeLogo'></span><span>"+ dprt+"</span> <span class='timeSpan'>@ "+tym+"</span></li>";
			list.push(l);
		}

	}
	var fareList = "<li class='list'>Total fare : Rs. "+fare+"</li>";
	list.push(fareList);

	if(noOfCheckedElement != 0){
		$('#result').css("display","none");
		$('.userDiv').css("display","block");
		$('.flightsBooked').append(list);
	}
	else{
		$('.headerOfResultTable').css("display","block");
		// status = false;
	}
	
	event.preventDefault();
}

function bookingDetailsDiv(event){
	var name = document.getElementById('nm').value;
	var mail = document.getElementById('em').value;
	var number = document.getElementById('no').value;

	if( name == "" || mail == "" || number == "" ){
		$('#userSubmitSpan').text("All fields are mandatory.");
		$('#userSubmitSpan').css("display","block");
	}
	else{
		$('.header').html("Your flight details");
		$('.userDiv').css("display","none");

		for (var i = 0; i < ticketList.length; i++) {
			var l = "<li class='list'>"+ ticketList[i][1] +" to "+ ticketList[i][2]+" @ "+ticketList[i][3]+" on "+ticketList[i][0]+"</li>";
			var x = "<tr><<td colspan='2'>"+l+"</td></tr>"
			$('.bookingDetailsTable tbody').append(x);
		}

		$('.bookingDetailsTable tbody').append("<tr><td>Name </td><td>"+$('#nm').val()+"</td>");
		$('.bookingDetailsTable tbody').append("<tr><td>Mail </td><td>"+$('#em').val()+"</td>");
		$('.bookingDetailsTable tbody').append("<tr><td>Mobile </td><td>"+$('#no').val()+"</td>");
		var check = $("input[type = radio]");

		for(var i = 0 ; i < check.length ; i++) {
			if (check[i].checked ) {
				$('.bookingDetailsTable tbody').append("<tr><td>Gender </td><td>"+check[i].value+"</td></tr>");
			}
			
		}
	}
	event.preventDefault();
}

function properName(){
	$('#nameSpan').text("");
	var name = document.getElementById('nm').value;
	var pattern = /^[a-zA-Z][a-zA-Z\s]+$/;
	var res = pattern.test(name);
	if(res == false && name != ""){
		$('#nm').val('');
		$('#nameSpan').text("Characters only.");
		$(this).focus();
	}

}

function properEmail(){
	$('#mailSpan').text("");
	var mail = document.getElementById('em').value;
	var pattern = /^[a-zA-Z]+@[a-zA-Z]+\.(com|in|org)$$/;
	var res = pattern.test(mail);
	if(res == false && mail != ""){
		$('#em').val('');
		$('#mailSpan').text("Email is not valid. Email must start with alphabet and must contain @ and .com/.org/.in.");
		$(this).focus();
	}
}

function properMobile(){
	$('#noSpan').text("");
	var no = document.getElementById('no').value;
	var pattern = /^[7-9]{1}[0-9]{9}$/;
	var res = pattern.test(no);
	if(res == false && no != ""){
		$('#no').val('');
		$('#noSpan').text("Enter a valid no.");
		$(this).focus();
	}
}

function emptySpan(){
	$('.spanAlert').text("");
	$('#submitSpan').text("");
	$('#userSubmitSpan').text("");
	$(this).focus();
}

function validation(event,inputField){
	console.log(inputField.value);
	properSource();
}




	 
