function addDepartmant(name) {
	$.ajax({
		url: "/api/accounting/add-dep",
		type: "POST",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(name) ,
		success: function (data) {
			alert(data);
		}
	});
};

function addBank(name) {
	$.ajax({
		url: "/api/accounting/add-bank",
		type: "POST",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(name),
		success: function (data) {
			alert(data);
		}
	});
};