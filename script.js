const theme = document.querySelector('#theme-button');
const body = document.getElementsByTagName('body')[0];
const themeName = document.querySelector('.theme-name');
const dialog = document.querySelector('#country-dialog');

const storedTheme = localStorage.getItem('theme');
if(storedTheme == 'dark'){
    body.classList.add('dark');
    themeName.textContent = "Dark mode";
    theme.firstElementChild.innerHTML = '<svg class="icon moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>';
}
else{
    body.classList.remove('dark');
    themeName.textContent = "Light mode";
    theme.firstElementChild.innerHTML = '<svg class="icon sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>';
}
theme.addEventListener('click', (e) => {
    const themeButton = e.target.closest('.theme-button');
    if(themeButton.firstElementChild.innerHTML.includes('sun-icon')) {
        themeButton.firstElementChild.innerHTML = '<svg class="icon moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>';
        themeButton.lastElementChild.textContent = "Dark mode";
        body.classList.add('dark');
        localStorage.setItem("theme", "dark");
    }
    else{
        themeButton.firstElementChild.innerHTML = '<svg class="icon sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>';
        themeButton.lastElementChild.textContent = "Light mode";
        body.classList.remove('dark');
        localStorage.setItem("theme", "light");
    }
    })

    let information;
    async function fetchCountries() {
		try{
            loadSpinner();
       let response = await fetch('countries-data.json');
            information = await response.json();
                dialog.close();
                renderCountries(information.data.objects);
		}
        catch(error){
                console.error(error);
            }
  
    };
    
    fetchCountries();


function renderCountries(countries){
	const catalogue = document.querySelector('#catalogue');
	catalogue.replaceChildren();
	
    countries.forEach(element => {
        const container = document.createElement('article');
		container.classList.add('country-card');
		const flagUrl = element.flag?.url_svg || element.flag?.url_png || element.flag?.emoji;
        if(flagUrl){
            const flag = document.createElement('img');
            flag.src = flagUrl || './assets/flag.svg';
            container.append(flag);
        }
		else{
			const flag = document.createElement('img');
            flag.src = './assets/flag.svg';
            container.append(flag);
		}
		const info = document.createElement('div');
		info.classList.add('country-info');

		const countryName = element.names?.common;
		if(countryName){
			const name = document.createElement('h2');
			name.textContent = countryName;
			info.append(name);
		}
		const countryDescription = element.descriptions?.short;
		if(countryDescription){
			const description = document.createElement('p');
			description.textContent = countryDescription;
			info.append(description);
		}
		const countryRegion = element.region;
	    if(countryRegion){
		    const region = document.createElement('strong');
		    region.textContent = `Region: ${countryRegion}`;
		    info.append(region);
	}
		container.append(info);
        catalogue.append(container);
    });
 
};

const regionFilter = document.querySelector('.region-filter');
const nav = document.querySelector('#nav-container');
nav.addEventListener('click',(event) => {
	let filter = event.target.closest('a');
	event.preventDefault();
	if(!filter)return;
	let filterName = filter.textContent.trim();
    if(filterName == 'All regions'){
        renderCountries(information.data.objects);
    }
    else{
	filterCountries(information,filterName);
    }

     regionFilter.open = !regionFilter.open;
});
function filterCountries(json,region){
	let countries = json.data.objects;
	let  filteredCountries = countries.filter( (item) => (item.region || '').toLowerCase() === region.toLowerCase() );
	renderCountries(filteredCountries);
};

function loadSpinner(){
    let modal = document.createElement('div');
    modal.id = 'modal';
    let dotOne = document.createElement('div');
    dotOne.classList.add('dot');
    dotOne.id = 'cont-one';
    modal.append(dotOne);

    let dotTwo = document.createElement('div');
    dotTwo.classList.add('dot');
    dotTwo.id = 'cont-two';
    modal.append(dotTwo);

    let dotThree = document.createElement('div');
    dotThree.classList.add('dot');
    dotThree.id = 'cont-one';
    modal.append(dotThree);

    if(storedTheme == 'dark'){
        dialog.style.backgroundColor = 'var(--text)'; 
    }
    dialog.replaceChildren(modal);
    dialog.showModal();
}

const searchBar = document.querySelector('#search-bar');

searchBar.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    if (!information) return;               // data hasn't loaded yet
    searchCountry(information.data.objects);
});

function searchCountry(countries){
    const input = searchBar.value.trim().toLowerCase();

    if (!input) {
        renderCountries(countries);
        return;
    }

    const matches = countries.filter((item) =>
        (item.names?.common || '').toLowerCase().includes(input)
    );

    if (matches.length) {
        renderCountries(matches);
    } else {
        const catalogue = document.querySelector('#catalogue');
        const message = document.createElement('p');
        message.textContent = 'No country matches your search !';
        catalogue.replaceChildren(message);
    }
}