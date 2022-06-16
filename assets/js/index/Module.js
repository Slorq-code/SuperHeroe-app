//----------------------------------------------------------------
//Revealing Module Pattern using IIFE Module Design Pattern//
//----------------------------------------------------------------
const superHeroApp = (() => {
	//Variable Declarations//
	const videos = document.getElementsByClassName("headerVideo");
	const footerVideo = document.getElementsByClassName("footerVideo")[0];
	const template = document.querySelector(".template ul li");
	const suggestionBox = document.getElementsByClassName("autocomplete-box")[0];
	const input = document.getElementsByTagName("input")[0];
	const UL = document.querySelector(".search-box ul");
	const footerRect = document.querySelector("footer").getBoundingClientRect();
	const height = Math.max(
		document.body.scrollHeight,
		document.body.offsetHeight,
		document.body.clientHeight
	);
	let i = 0;
	let flag = "not found";
	let superheroes = [];
	const heartToggle = (favouriteBtn, name) => {
		let arr = [];
		let item = name.trim().toLowerCase();
		//If Favourites exist in localStorage
		if ("favourites" in localStorage) {
			//Convert the string to array
			arr = JSON.parse(localStorage.getItem("favourites"));
			//If the superhero is already in the favourites
			if (arr.includes(item)) {
				favouriteBtn.style.color = "red";
			}
			//If the superhero is not in the favourites
			else {
				favouriteBtn.style.color = "black";
			}
		}
		//If Favourites don't exist in localStorage
		else {
			favouriteBtn.style.color = "black";
		}
	};
	//----------------------------------------------------------------
	//Function: Plays the Spider-Web Video in the Background in the Footer//
	const spiderWeb = () => {
		if (window.scrollY + 300 >= Math.floor(height - footerRect.height)) {
			//On Clicking the background, video plays
			footerVideo.parentElement.onclick = () => {
				footerVideo.play();
			};
			//On Double Clicking the background, video stops
			footerVideo.parentElement.ondblclick = () => {
				footerVideo.currentTime = 0;
				footerVideo.pause();
			};
		}
	};
	//----------------------------------------------------------------
	//Function: Plays the Superhero Intro Videos in the Background//
	const videoPlay = () => {
		if ("videoIndex" in localStorage) {
			//If videoIndex exists in localStorage
			i = parseInt(localStorage.getItem("videoIndex"));
			//Only 4 Videos exists
			if (i < 4) {
				i += 1;
			} else {
				i = 0;
			}
		} else {
			//If videoIndex doesn't exist in localStorage
			i = -1;
		}

		//Sets the videoIndex in localStorage
		localStorage.setItem("videoIndex", i);
		console.log("videoIndex: ", i);

		//Starts playing the video on every logo click
		if (i !== -1) {
			videos[i].classList.remove("hide");
			videos[i].play();
			//If video ends then hide the video
			if (videos[i].ended) {
				videos[i].currentTime = 0;
				videos[i].pause();
				videos[i].classList.add("hide");
			}
		}
	};
	//----------------------------------------------------------------
	//Function: Fetches all the Superheroes//
	const fetchSuperhero = async (value) => {
		if (input.value.length === 0) {
			//If input is empty then hide the suggestion box
			UL.style.visibility = "hidden";
			flag = "not found";
			return;
		} else {
			//Fetching the Superheroes from the Superhero API
			try {
				const url = `https://superheroapi.com/api/125001886776752/search/${value}`;
				const response = await fetch(url);
				const data = await response.json();
				//If the response is Error then hide the suggestion box
				if (data.response === "error") {
					UL.style.visibility = "hidden";
					flag = "not found";
					return;
				}
				const superheroList = data.results;
				//Remove the previous suggestions
				suggestionBox.querySelectorAll("li").forEach((li) => {
					li.remove();
				});
				//Clone the template for each superhero
				superheroes = superheroList.map((superhero) => {
					const suggestion = template.cloneNode(true);
					const name = suggestion.querySelector("div span");
					const image = suggestion.querySelector("div img");
					const favouriteBtn = suggestion.querySelector(".fav-btn");
					//Setting the name and image of the superhero
					if (superhero.name.toLowerCase().includes(value.toLowerCase())) {
						name.textContent = superhero.name;
						image.src = superhero.image.url;
						suggestion.setAttribute("data-id", superhero.id);
						suggestion.setAttribute(
							"data-image-url",
							superhero.image.url
						);
						//Setting the favourite button color
						heartToggle(favouriteBtn, superhero.name);
					}
					//If the content is empty then return null
					if (
						name.textContent === "" ||
						name.textContent === null ||
						name.textContent === undefined
					) {
						return null;
					}
					//Return the superhero
					return suggestion;
				});
				//If the content is empty (Array is null) then hide the suggestion box
				if (superheroes[0] === null) {
					UL.style.visibility = "hidden";
					flag = "not found";
					return;
				}
				//Showing the suggestions in the suggestion box
				suggestionBox.append(...superheroes);
				UL.style.visibility = "visible";
				flag = "found";
			} catch (error) {
				UL.style.visibility = "hidden";
				if (error.message === "Failed to fetch") {
					//If there is an error, hide the suggestion box
					console.log("Please check your internet connection !!!");
				} else if (error.name === "TypeError") {
					//If superhero not found, hide the suggestion box
					console.log("Please enter a valid superhero name !!!");
				}
				flag = "not found";
			}
		}
	};
	//----------------------------------------------------------------
	//Function: Handles the Click Events//
	const handleClick = (event) => {
		//Stops Event Bubbling
		event.stopPropagation();
		//Fetch the clicked element
		const target = event.target;
		const li = document.querySelectorAll(".search-box ul li");
		const toast = document.querySelector(".toast");

		//If the clicked element is a Wrapper Container (Left/Right of Nav Links)
		if (target.id === "wrapper") {
			try {
				//Toggles the video on and off
				let i = parseInt(localStorage.getItem("videoIndex"));
				if (i !== -1) {
					if (videos[i].paused) {
						videos[i].play();
					} else {
						videos[i].pause();
					}
				}
			} catch (error) {}
		}
		//If the clicked element is not Search Bar or Suggestion Box
		if (target.id === "form" || target.id === "wrapper") {
			//Hide the suggestion box
			UL.style.visibility = "hidden";
		}
		//If the clicked element is Search Bar
		if (
			target.id === "search-input" &&
			target.value.length > 0 &&
			flag === "found"
		) {
			//Show the suggestion box
			UL.style.visibility = "visible";
		}
		//If the clicked element is a Suggestion from the Suggestion Box
		li.forEach((li) => {
			//If list item is clicked
			if (target === li) {
				//Store the superhero name in local storage
				localStorage.setItem(
					"superhero",
					target.textContent.trim().toLowerCase()
				);
				//Redirect to the superhero page
				window.location.href = "./superhero-page.html";
				return;
			}
			//If list item div is clicked
			if (target === li.children[0]) {
				//Store the superhero name in local storage
				localStorage.setItem(
					"superhero",
					target.children[1].textContent.trim().toLowerCase()
				);
				//Redirect to the superhero page
				window.location.href = "./superhero-page.html";
				return;
			}
			//If list item span is clicked
			if (target === li.children[0].children[1]) {
				//Store the superhero name in local storage
				localStorage.setItem(
					"superhero",
					target.textContent.trim().toLowerCase()
				);
				//Redirect to the superhero page
				window.location.href = "./superhero-page.html";
				return;
			}
			//If list item image is clicked
			if (target === li.children[0].children[0]) {
				//Store the superhero name in local storage
				localStorage.setItem(
					"superhero",
					target.nextElementSibling.textContent.trim().toLowerCase()
				);
				//Redirect to the superhero page
				window.location.href = "./superhero-page.html";
				return;
			}
			//If Heart Icon is clicked
			if (target === li.children[1]) {
				let arr = [];
				let images = [];
				let item = target.previousElementSibling.children[1].textContent
					.trim()
					.toLowerCase()
					.toLowerCase();
				let url = target.parentElement.getAttribute("data-image-url");
				toast.children[0].children[0].textContent = item;

				//If Favourites exist in localStorage
				if ("favourites" in localStorage) {
					//Convert the string to array
					arr = JSON.parse(localStorage.getItem("favourites"));
					//Convert the string to array
					images = JSON.parse(localStorage.getItem("images"));

					//If the superhero is already in the favourites
					if (arr.includes(item)) {
						//Remove the superhero from the favourites
						arr = arr.filter((i) => i !== item);
						//Remove the superhero image URL from the favourites
						images = images.filter((obj) => obj.name !== item);
						//Change color of the heart icon
						target.style.color = "black";
						//Change toast message
						toast.children[1].children[0].textContent =
							"Removed from Favourites !!!";
					}
					//If the superhero is not in the favourites
					else {
						//Push the favourite superhero to the array
						arr.push(item);
						//Push the favourite superhero image URL to the array
						images.push({ name: item, image: url });
						//Change color of the heart icon
						target.style.color = "red";
						//Change toast message
						toast.children[1].children[0].textContent =
							"Added to Favourites !!!";
					}
				}
				//If Favourites don't exist in localStorage
				else {
					//Push the favourite superhero to the array
					arr.push(item);
					//Push the favourite superhero image URL to the array
					images.push({ name: item, image: url });
					//Change color of the heart icon
					target.style.color = "red";
					//Change toast message
					toast.children[1].children[0].textContent =
						"Added to Favourites !!!";
				}

				//Convert the array to string and store it in localStorage
				localStorage.setItem("favourites", JSON.stringify(arr));
				//Convert the array to string and store it in localStorage
				localStorage.setItem("images", JSON.stringify(images));
				//Show the toast
				toast.classList.add("show", "fadeLeft");
				//Hide the toast after 3 seconds
				setTimeout(() => {
					toast.classList.remove("show", "fadeLeft");
				}, 3000);
				return;
			}
		});
		// If the clicked element is the Search Button
		if (target.id === "search-button") {
			event.preventDefault();
			const val = target.previousElementSibling.children[0].value;
			if (val.length > 0) {
				//Store the superhero name in localStorage
				localStorage.setItem("superhero", val.toLowerCase());
				//Redirect to the superhero page
				window.location.href = "./superhero-page.html";
				return;
			}
			return;
		}
	};
	//----------------------------------------------------------------
	/*Debounce is a mechanism which forces a Function/API-Call to wait 
	a certain amount of time before running again. This is used to 
	prevent the API-Call from being called multiple times.*/

	//Function: Debouncing mechanism for the API Calls//
	const debounce = (callback, delay = 180) => {
		let timeoutID;
		//Returns a function
		return (...value) => {
			//If there is a previous timeoutID then clear it, so that if we stop typing then only it registers the input as the final word after the delay & displays it.
			clearTimeout(timeoutID);
			//Set the timeoutID along with running the callback with a delay
			timeoutID = setTimeout(() => {
				callback(...value);
			}, delay);
		};
	};
	//----------------------------------------------------------------
	//Function: It is used to invoke debounce() & receives a function in return//
	const search = debounce((value) => {
		//Calls the fetchSuperheroes() function
		fetchSuperhero(value);
	}, 180);
	//----------------------------------------------------------------
	//Function: Handles the Click Events//
	const handleInput = (event) => {
		//Stops Event Bubbling
		event.stopPropagation();
		//Value of the input field as we type
		const value = event.target.value;
		//Calls search()
		search(value);
	};
	//----------------------------------------------------------------
	//Function: Initializes the Superhero Hunter App//
	const initializeApp = () => {
		//Click Event Delegation
		document.addEventListener("click", handleClick);
		//Input Event Listener
		document.addEventListener("input", handleInput);
		//Scroll Event Listener
		document.addEventListener("scroll", spiderWeb);
		//Runs on every Window Load/Reload
		window.onload = () => {
			//Runs the videoPlay function
			videoPlay();
		};
	};
	//----------------------------------------------------------------
	return {
		initialize: initializeApp,
	};
})();
//----------------------------------------------------------------
