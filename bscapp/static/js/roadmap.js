function test(element)
{
	showing = document.getElementsByClassName("show");
	for(i = showing.length-1; i > -1; i--)
	{
		if(showing[i].tagName == "UL")
		{
			showing[i].className = "submenu";
		}
		else if(showing[i].tagName == "SPAN")
		{
			showing[i].className = "menu_title";
		}
	}

	children = element.childNodes;
	for(i = 0; i < children.length; i++)
	{
		if(children[i].className == "menu")
		{
			for(j = 0; j < children[i].childNodes.length; j++)
			{
				if(children[i].childNodes[j].tagName == "SPAN")
				{
					console.log(children[i].childNodes[j].className);
					if(!children[i].childNodes[j].className.includes("show"))
					{
						children[i].childNodes[j].className += " show";
					}
					console.log(children[i].childNodes[j].className);
				}
				if(children[i].childNodes[j].tagName == "UL")
				{
					if(!children[i].childNodes[j].className.includes("show"))
					{
						children[i].childNodes[j].className += " show";
					}
				}
			}
		}
	}
}