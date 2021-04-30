/**
 * Ntaglibs.js
 * The Container and Controller Object for all JavaScript objects
 * It loads all other script files.It is loaded from FEBAScripts.js
 * It contains objects to parse the Ajax response
 *
 * Created on Aug 16, 2011
 * COPYRIGHT NOTICE:
 * Copyright (c) 2004 Infosys Technologies Limited, Electronic City,
 * Hosur Road, Bangalore - 560 100, India.
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Infosys Technologies Ltd. ("Confidential Information"). You shall
 * not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered
 * into with Infosys.
 */

feba.js.common={
	
	displayWarning : "Y",
	//This method will bring focus on the HTML element with the given id
	focus : function(elementId){
		var element = document.getElementById(elementId);
		if(element){
			element.focus();
		}
	},
	
	//This method will check if JavaScript is enabled on the page
	checkJS : function(flagId){
		document.getElementById(flagId).value = 'Y';
	},
	
	//This method is used to enable selectAll functionality for tables
	selectAll : function(checkbox,tableID,row,rows){
		var table = document.getElementById(tableID);
		var tblLen = rows;
		row--;
		for(var i = 0; i<tblLen; i++){
			if(document.getElementById(checkbox+"["+row+"]") == null){
				break;
			}
			//if the header checkbox is checked, then check all check boxes
			if(document.getElementById(checkbox).checked){
				document.getElementById(checkbox+"["+row+"]").checked = true;
			}else {
				document.getElementById(checkbox+"["+row+"]").checked = false;
			}
			row++;
		}
	},
	
	//This method will check to see if the selectAll checkbox is selected in case
	//some of the rows are not selected 
	checkSelectAll : function(tablecheckboxId,row,lastrec,firstrec){
		var tblLen = lastrec;
		firstrec--;
		var selectAllCheck = true;
		row--;
		
		if(!document.getElementById(tablecheckboxId+"["+row +"]").checked){
			
			document.getElementById(tablecheckboxId).checked = false;
			selectAllCheck = false;
			
		}else{
			
			for(var i = firstrec; i<tblLen; i++){
				if(document.getElementById(tablecheckboxId+"["+i+"]") == null){
					break;
				}
				if(!document.getElementById(tablecheckboxId+"["+i+"]").checked){
					selectAllCheck = false;
					break;
				}
			}
			
		}
		if(!selectAllCheck){
			document.getElementById(tablecheckboxId).checked = false;
		}else{
			document.getElementById(tablecheckboxId).checked = true;
		}
	},
	
	//Checks if grouplets are present on the page and paints the appropriate message if not present
	checkGrouplets : function(){
		if(feba.js.ajax.groupletCounter === 0 && "Y"===feba.js.common.displayWarning){
			LIB.__HANDLE_ERROR__(null,"<div role=\"alert\" class=\"redbg\"><a id=\"errorlink1\" href=\"#\"><img class=\"absmiddle\" title=\""+getMessage("NoWidgetsTitle")+"\" " +
					"alt=\""+getMessage("NoWidgetsAlt")+"\" src=\""+getMessage("NoWidgetsImageSrc")+"\"></a><span dir=\"ltr\">[CONTLS0004] [100053] </span>"+getMessage("NoWidgets")+"</div>",null,null,"true",false,null);
		}
	},
	
	//blocks the ui on hyperlink clicks
	blockOnHyperlinkClicks : function(imagePath){
		if(Constants.YES===CONFIG.blockOnHyperLinkClicksRequired){
			feba.domManipulator.getElement('a[data-dontBlockUI!="true"]').click(
					function(){
						
						var hrefAttrib = feba.domManipulator.getAttribute(this,Constants.HREF); 
						var targetAttrib =  feba.domManipulator.getAttribute(this,Constants.TARGET);
						
						if(isPageRefreshLink(hrefAttrib) && targetAttrib.indexOf("new")==-1){
							var downloadLinkAttribute = feba.domManipulator.getAttribute(this,Constants.DOWNLOAD_LINK);
							var body = feba.domManipulator.getElement('body');
							if(downloadLinkAttribute===Constants.TRUE){
								feba.domManipulator.blockUI(
										{
											message:feba.domManipulator.getElementById(imagePath),
											baseZ: 9999,
											allowBodyStretch:false,
											timeout: 5000
										}
								);
							}else{
								feba.domManipulator.blockUI(
										{
											message:feba.domManipulator.getElementById(imagePath),
											allowBodyStretch:false,
											baseZ: 9999										
										}
								);
							}
						}
					}
				);
		}
	},
	
	//blocks the ui on button clicks
	blockOnButtonClicks : function(imagePath){
		if(Constants.YES===CONFIG.blockOnButtonClicksRequired){
			feba.domManipulator.getElement(':submit[data-dontBlockUI!="true"]').click(
				function(){
					var downloadButtonAttribute = feba.domManipulator.getAttribute(this,Constants.DOWNLOAD_BUTTON);
					if(downloadButtonAttribute===Constants.TRUE){
						feba.domManipulator.blockUI(
								{
									message:feba.domManipulator.getElementById(imagePath),
									baseZ: 9999,
									allowBodyStretch:false,
									timeout: 5000
								}
						);
					}else{
						feba.domManipulator.blockUI(
								{
									message:feba.domManipulator.getElementById(imagePath),
									allowBodyStretch:false,
									baseZ: 9999
								}
						);
					}
					
				}
			);
		}
	},
	
	//Runs a custom function based on the function name. Function should be present in feba.js.custom
	runPageCustomFunction : function(functionName){
		if(typeof feba.js.custom[functionName] === 'function'){
			feba.js.custom[functionName]();
		}
	},
	
	clear : function(inputFieldId,dropdownId,defaultValues){
		var defaultvalarr = defaultValues.split(';');
		var arrayLength = defaultvalarr.length;
		for(i=0;i<arrayLength;i++){
			var valueArray = defaultvalarr[i].split('=');
			if(feba.js.common.doesArrayContain(valueArray,dropdownId)){
				document.getElementById(inputFieldId).value=valueArray[1];
				document.getElementById(dropdownId).value=valueArray[2];
			}
		}
		feba.domManipulator.trigger(feba.domManipulator.getElementById(dropdownId),"change");
	},
	

	//checks if the element is present in the array
	doesArrayContain : function (array,element){
		if(array){
			var arrayLength = array.length;
			for (var i = 0; i < arrayLength; i++) {
				if (array[i] == element) {
					return true;
				}
			}
		}
		return false;
	},
	
	submitProduct : function(crn,schemecode,formsGroupID){
		var value=document.getElementById(crn).value;
		document.getElementById(formsGroupID+".SCHEME_CODE").value=schemecode;
		document.getElementById(formsGroupID+".PRODUCT_CRN").value=value;
	},

	submitProductOverDraft : function (schemecode,formsGroupID){
		document.getElementById(formsGroupID+".SCHEME_CODE").value=schemecode;	

	},
	
	submitPackage : function (crn,packagecode,formsGroupID){
		var value=document.getElementById(crn).value;
		document.getElementById(formsGroupID+".PACKAGE_CODE").value=packagecode;
		document.getElementById(formsGroupID+".PRODUCT_CRN").value=value;
	},
	
	submitForSimulation : function (crn,schemecode,formsGroupID){
		var value=document.getElementById(crn).value;
		document.getElementById(formsGroupID+".SCHEME_CODE").value=schemecode;	
		document.getElementById(formsGroupID+".SIMULATION_CRN").value=value;
	},
	
	hideseekthree : function (id,img,imagePath,lcExpand,lcCollapse){

		var flag=document.getElementById(id).style.display;
		if (flag == "block"){

			document.getElementById(id).style.display="none";
			document.getElementById(img).src=imagePath +"/plus.gif";
			document.getElementById(img).alt=lcExpand;
		}else{
			
			document.getElementById(id).style.display="";
			document.getElementById(img).src=imagePath +"/minus.gif";
			document.getElementById(img).alt=lcCollapse;
		}
		
		for (var i=0; i<=10; i++){
		    if(id=="id"+i){
			document.getElementById('id'+i).style.display="";
			document.getElementById('img'+i).src=imagePath +"/minus.gif";
			document.getElementById('img'+i).alt=lcCollapse;
		    }else if(id!="id"+i){
			document.getElementById('id'+i).style.display="none";
			document.getElementById('img'+i).src=imagePath +"/plus.gif";
			document.getElementById('img'+i).alt=lcExpand;
		    }
		}
	}
};
