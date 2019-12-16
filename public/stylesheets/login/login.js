const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container-modal');
const btnClose = document.getElementsByClassName('closeBtn');
const btnSignUp = document.getElementById('button-signup');
const btnSignIn = document.getElementById('button-signin');
const modal = document.getElementById('body-modal');

btnSignUp.addEventListener('click',( )=> {
	btnClose[0].style.right = "0";
	modal.style.display = "flex";
	container.classList.add("right-panel-active");
});

btnSignIn.addEventListener('click',() => {	
	modal.style.display = "flex";	
	container.classList.remove("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

signUpButton.addEventListener('click', () => {
	btnClose[0].style.right = "0";
	container.classList.add("right-panel-active");
});

btnClose[0].addEventListener('click',()=>{
	modal.style.display = "none";
});

btnClose[1].addEventListener('click',()=>{
	modal.style.display = "none";
});

window.addEventListener('click',()=>{
	if (event.target == modal) {
		modal.style.display = "none";
	  }
});
