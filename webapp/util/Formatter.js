jQuery.sap.declare("com.sap.expenseplanning.util.Formatter");
com.sap.expenseplanning.util.Formatter = {

	str2Float : function(value) {
		return parseFloat(value);
	},

	valuteState : function(text) {
		if (text === "")
			return "Error";
		else
			return "None";
	}
};