jQuery.sap.declare("com.sap.expenseplanning.util.AjaxUtil");
com.sap.expenseplanning.util.AjaxUtil = {
	asynchGetJSON: function(thiz, sPath, fDoneCallback, fFailCallback, fAlwaysCallback) {
		return jQuery.ajax({
			url: sPath,
			type: "GET",
			dataType: "json",
			context: thiz
		}).done(fDoneCallback).fail(fFailCallback).always(fAlwaysCallback);
	},

	asynchPostJSON: function(thiz, sPath, oData, fDoneCallback, fFailCallback, fAlwaysCallback) {
		return jQuery.ajax({
			url: sPath,
			type: "POST",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(oData),
			context: thiz
		}).done(fDoneCallback).fail(fFailCallback).always(fAlwaysCallback);
	},

	asyncPostWithHeader: function(thiz, url, payload, headers, succuessCb, failCb, finnalCb) {
		return jQuery.ajax({
			url: url,
			type: "POST",
			dataType: "json",
			headers: headers,
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(payload),
			context: thiz
		}).done(succuessCb).fail(failCb).always(finnalCb);
	},

	asynchDelete: function(thiz, sPath, fDoneCallback, fFailCallback, fAlwaysCallback) {
		return jQuery.ajax({
			url: sPath,
			type: "DELETE",
			context: thiz
		}).done(fDoneCallback).fail(fFailCallback).always(fAlwaysCallback);
	},

	csrfToken: function(thiz, sPath, cb) {
		return jQuery.ajax({
			type: "GET",
			url: sPath,
			headers: {
				"X-CSRF-Token": "fetch"
			},
			success: function(data, textStatus, jqXHR) {
				var x_csrf_token = jqXHR.getResponseHeader("x-csrf-token");
				cb(x_csrf_token);
			}
		});
	}
};