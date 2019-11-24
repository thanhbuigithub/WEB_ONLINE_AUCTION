$(document).ready(function()
{   
    "use strict";
    
    exitLogin();
    exitSignUp();

    function exitLogin()
    {
        var modal = document.getElementById('login');
			    window.onclick = function(event) {
				if (event.target == modal) {
					modal.style.display = "none";
			}
		}
    }
    function exitSignUp()
    {
        var modal = document.getElementById('signup');
			window.onclick = function(event) {
				if (event.target == modal) {
					modal.style.display = "none";
			}
		}
    }
});