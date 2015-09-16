ShoutApp.filter('longAgo', function(){
	return function(input){
		var ago;
		var pd = new Date(input);
		var cd = new Date();
		if(pd.getFullYear() < cd.getFullYear()){
			ago = 'More than a year ago.'
		}else if(pd.getMonth() < cd.getMonth()){
			if((cd.getMonth() - pd.getMonth()) === 1){
				ago = (cd.getMonth() - pd.getMonth()) + " month ago."
			} else {
				ago = (cd.getMonth() - pd.getMonth()) + " months ago."
			}
		}else if(pd.getDate() < cd.getDate()){
			if((cd.getDate() - pd.getDate()) === 1){
				ago = (cd.getDate() - pd.getDate()) + " day ago."
			} else {
				ago = (cd.getDate() - pd.getDate()) + " days ago."
			}
		}else if(pd.getHours() < cd.getHours()){
			if((cd.getHours() - pd.getHours()) === 1){
				ago = (cd.getHours() - pd.getHours()) + " hour ago."
			} else {
				ago = (cd.getHours() - pd.getHours()) + " hours ago."
			}
		}else if(pd.getMinutes() < cd.getMinutes()){
			if((cd.getMinutes() - pd.getMinutes()) === 1){
				ago = (cd.getMinutes() - pd.getMinutes()) + " minute ago."
			} else {
				ago = (cd.getMinutes() - pd.getMinutes()) + " minutes ago."
			}
		}else{
			ago = "Less than a minute ago."
		}
		return ago
	}
})