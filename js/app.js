var app = angular.module('myApp', []);

app.controller('reservaionCtrl', function($scope) {
	var tickets = [
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0},
		{value : 1, cls : '', status : 0}
	];
	var selectedTickets = {};
	
	var updateTicketClass = function(index) {
		var style = '';
		
		if((index % 12) == 0 && index != 0)
			style = ' clsClearLeft';
		
		return style;
	};
	
	var showAvailablityError = function(tickets, isGet) {
		var isAvailable = false;
		var msg;
		
		for(var i in tickets) {
			if(tickets[i].status == 0) {
				isAvailable = true;
				break;
			}
		}
		
		if(typeof isGet != 'undefined' && isGet == true) {
			return isAvailable;
		}
		
		if(isAvailable)
			msg = 'Please select the ticket first.!';
		else
			msg = 'All seats are booked. Please try after sometimes.!';
		
		alert(msg);
		
		return isAvailable;
	};
	
	var getReservedCountDetails = function(tickets) {
		var count = 0;
		var seatsNo = '';
		
		for(var ticketNo in tickets) {
			++count;
			
			if(seatsNo == '')
				seatsNo = ticketNo;
			else
				seatsNo += ', ' + ticketNo;
		}
		
		return {count : count, seatsNo: seatsNo};
	};
	
	$scope.isHideClearBtn = true;
	
	$scope.updateTicket = function(tickets) {
		$scope.tickets = [];
		
		for(var i in tickets) {
			var ticket = tickets[i];
			
			if(ticket.status == 0)
				ticket.cls = 'clsAvailable';
			else if(ticket.status == 1)
				ticket.cls = 'clsReserved';
			else if(ticket.status == 2)
				ticket.cls = 'clsBooked';
			else
				continue;
			
			ticket.cls += updateTicketClass(i);
			ticket.value = ++i;
			
			$scope.tickets.push(ticket);
		}
	};
	
	$scope.doReserve = function(ticketNo) {
		var tickets = angular.copy($scope.tickets);
		var index, ticket;
		
		try {
			if(ticketNo < 1 || ticketNo > tickets.length) {
				throw({msg : 'Error in ticket selection. Please try again sometimes later.!'});
			}
			
			index = ticketNo - 1;
			ticket = tickets[index];
		
			if(ticket.status == 2) {
				showAvailablityError(tickets);
				throw({msg : ''});
			}
		} catch(e) {
			if(typeof e.msg == 'undefined')
				e.msg = 'Sorry something wrong. Please try again later.!';
			
			if(e.msg != '')
				alert(e.msg);
			
			return false;
		}
		
		if(ticket.status == 0) {
			ticket.status = 1;
			
			selectedTickets[ticketNo] = ticket;
		} else {
			ticket.status = 0;
			
			delete selectedTickets[ticketNo];
		}
		
		tickets[index] = ticket;
		
		$scope.updateTicket(tickets);
		
		var reservedSeatDetails = getReservedCountDetails(selectedTickets);
		
		$scope.reservedCount = reservedSeatDetails.count;
		$scope.selectedSeatNo = reservedSeatDetails.seatsNo;
	};
	
	$scope.doBooking = function() {
		var tickets = angular.copy($scope.tickets);
		var count = 0;
		
		for(var ticketNo in selectedTickets) {
			if(selectedTickets[ticketNo].status != 1) {
				delete selectedTickets[ticketNo];
				continue;
			}
			
			selectedTickets[ticketNo].status = 2;
			count++;
			
			var index = ticketNo - 1;
			
			tickets[index] = selectedTickets[ticketNo];
		}
		
		if(count == 0) {
			showAvailablityError(tickets);
			return;
		} else if(typeof localStorage != 'undefined') {
			localStorage.setItem('tickets', JSON.stringify(tickets));
		}
		
		selectedTickets = {};
		$scope.updateTicket(tickets);
		
		$scope.isHideClearBtn = showAvailablityError($scope.tickets, true);
		$scope.reservedCount = 0;
		$scope.selectedSeatNo = '';
	};
	
	$scope.clearBooking = function() {
		if(typeof localStorage != 'undefined') {
			localStorage.clear();
			
			$scope.updateTicket(tickets);
			$scope.isHideClearBtn = showAvailablityError(tickets, true);
		}
	};
	
	var storageItems = localStorage.getItem('tickets');
	
	if(storageItems != null && storageItems != '') {
		try {
			if(typeof localStorage == 'undefined') {
				throw({});
			}
			
			var storageTicket = JSON.parse(localStorage.getItem('tickets'));
			
			$scope.updateTicket(storageTicket);
		} catch(e) {}
	} else {
		$scope.updateTicket(tickets);
	}
	
	
	$scope.isHideClearBtn = showAvailablityError($scope.tickets, true);
	$scope.reservedCount = 0;
	$scope.selectedSeatNo = '';
});